import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '', // Added stock
        category: '',
        subcategory: '',
        description: '',
        isNewArrival: false,
        isTrending: false,
    });
    const [image, setImage] = useState<string>('');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]); // Added sizes

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (val: string) => {
        setFormData(prev => ({ ...prev, category: val }));
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }));
    };

    const handleSizeChange = (size: string, checked: boolean) => {
        if (checked) {
            setSelectedSizes(prev => [...prev, size]);
        } else {
            setSelectedSizes(prev => prev.filter(s => s !== size));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadData,
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.text();
                setImage(`http://localhost:5000${data}`);
                toast.success('Image uploaded');
            } else {
                toast.error('Image upload failed');
            }
        } catch (error) {
            toast.error('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            ...formData,
            id: `prod-${Date.now()}`, // Simple ID generation
            images: [image],
            price: Number(formData.price),
            stock: Number(formData.stock),
            sizes: selectedSizes,
            colors: [{ name: 'Default', hex: '#000000' }] // Default color
        };

        try {
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Product created successfully');
                navigate('/admin/products');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to create product');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input id="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="sale">Sale</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input id="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g., t-shirts" />
                </div>

                <div className="space-y-2">
                    <Label>Sizes</Label>
                    <div className="flex flex-wrap gap-4">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <div key={size} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`size-${size}`}
                                    checked={selectedSizes.includes(size)}
                                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                                />
                                <Label htmlFor={`size-${size}`}>{size}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input id="image" type="file" onChange={handleFileChange} />
                    {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                    {image && <img src={image} alt="Preview" className="h-32 w-32 object-cover rounded-md mt-2" />}
                </div>

                <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isNewArrival"
                            checked={formData.isNewArrival}
                            onCheckedChange={(checked) => handleCheckboxChange('isNewArrival', checked as boolean)}
                        />
                        <Label htmlFor="isNewArrival">New Arrival</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isTrending"
                            checked={formData.isTrending}
                            onCheckedChange={(checked) => handleCheckboxChange('isTrending', checked as boolean)}
                        />
                        <Label htmlFor="isTrending">Trending</Label>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin/products')}>
                        Cancel
                    </Button>
                    <Button type="submit" className="w-full" disabled={loading || uploading || !image}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
