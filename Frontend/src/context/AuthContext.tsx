import { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User & { token?: string }) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            // Helper to check URL query param for token (OAuth redirect)
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token');

            if (urlToken) {
                localStorage.setItem('token', urlToken);
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const currentToken = urlToken || token;

            if (!currentToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = (userData: User & { token?: string }) => {
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Optional: Call backend to clear cookie if used, but largely relying on client token removal
            localStorage.removeItem('token');
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
