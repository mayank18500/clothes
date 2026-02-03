import { Product } from '@/data/products';

const API_URL = '/api';

export const fetchProducts = async (params?: string): Promise<Product[]> => {
    const query = params ? `?${params}` : '';
    console.log(`Fetching products from: ${API_URL}/products${query}`);
    const response = await fetch(`${API_URL}/products${query}`);
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
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        console.error(`Failed to fetch product ${id}:`, response.status);
        throw new Error('Failed to fetch product');
    }
    return response.json();
};
