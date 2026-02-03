import { Product } from '@/data/products';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchProducts = async (params?: string): Promise<Product[]> => {
    const query = params ? `?${params}` : '';
    console.log(`Fetching products from: ${API_URL}/products${query}`);

    // Authorization header
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products${query}`, { headers });
    if (!response.ok) {
        console.error('Failed to fetch products:', response.status, response.statusText);
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log('Products fetched:', data);
    return data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
    console.log(`Fetching product by ID: ${id}`);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products/${id}`, { headers });
    if (!response.ok) {
        console.error(`Failed to fetch product ${id}:`, response.status);
        throw new Error('Failed to fetch product');
    }
    return response.json();
};
