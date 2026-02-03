const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TemporaryUser = require('../models/TemporaryUser');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use SMTP details from .env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Register - Step 1: Create Temporary User & Send Verification Email
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const temporaryUserExists = await TemporaryUser.findOne({ email });
        if (temporaryUserExists) {
            await TemporaryUser.deleteOne({ email }); // Remove old temporary user if exists to allow retry
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Plain text password here because pre-save hook in TemporaryUser will hash it
        await TemporaryUser.create({
            name,
            email,
            password, // Mongoose pre-save hook will hash this
            role,
            verificationToken
        });

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please click the link below to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        };

        // In a real app, you wait for this or background it.
        // For now, valid but might fail if creds are missing.
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
        }

        res.status(200).json({ message: 'Verification email sent' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register - Step 2: Verify Email & Create Actual User
router.post('/verify-email', async (req, res) => {
    const { token } = req.body;
    try {
        const tempUser = await TemporaryUser.findOne({ verificationToken: token });
        if (!tempUser) return res.status(400).json({ message: 'Invalid or expired token' });

        // Create actual user
        // Note: tempUser.password is ALREADY HASHED from TemporaryUser model
        // User model ALSO has a pre-save hook to hash password if modified.
        // We need to be careful not to double hash.
        // Option: Pass isModified: false for password? Or rely on behavior.
        // Actually, if we pass the hashed password to User.create, and User model hashes it again... that's bad.
        // User model: if (!this.isModified('password')) return;
        // User.create triggers save.

        // Fix: Use a specific method or bypass middleware?
        // Or, since we are moving data, we can set the hashed password directly and save.
        // But `User.create` calls `new User(..).save()`.

        // Let's create the user instance explicitly.
        const user = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password, // Already hashed
            role: tempUser.role
        });

        // We need to ensure we don't re-hash. 
        // The User model checks `isModified('password')`. When creating new, it IS modified.
        // So it WILL re-hash. Troubleshooting double hashing:
        // Logic: Verify if the password looks hashed? No.

        // Workaround: We can't use the pre-save hook on User to hash if it's already hashed.
        // But the TemporaryUser hashed it.
        // Simplest: Don't hash in TemporaryUser? 
        // Security risk if TemporaryUser DB is leaked? Yes.
        // Better: Hash in TemporaryUser. When moving, decoding? No.

        // BEST: TemporaryUser stores it hashed. User model expects unhashed usually.
        // But we can assign it and use { strict: false } or similar? No.

        // If we simply `await User.create({...})` it will hash again.
        // We can manually set the password field on the document and save with `validateBeforeSave: false`? No, hooks still run.

        // Actually, I'll modify the loop.
        // Quickest fix for this context: 
        // DO NOT hash in TemporaryUser (since it expires in 15m and is low risk compared to main DB?). 
        // NO, that's bad practice.

        // Correct fix:
        // Set a flag on the user instance to skip hashing?
        // Or, keep it simple: TemporaryUser hashes. User model hashes.
        // When transferring, we have the Hashed password.
        // We can create the user with a DUMMY password, then update it with the hashed one using updateOne (which skips hooks).

        const newUser = await User.create({
            name: tempUser.name,
            email: tempUser.email,
            password: 'temp_placeholder_to_be_replaced', // Will be hashed (wasted effort but safe)
            role: tempUser.role
        });

        // Overwrite with the actual hashed password from tempUser
        await User.updateOne(
            { _id: newUser._id },
            { $set: { password: tempUser.password } }
        );

        await TemporaryUser.deleteOne({ _id: tempUser._id });

        const authToken = generateToken(newUser._id);
        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: authToken,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const token = generateToken(req.user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Redirect to frontend
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);

    }
);

// Logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out' });
});

// Get User Profile
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// Update User Profile
router.put('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
