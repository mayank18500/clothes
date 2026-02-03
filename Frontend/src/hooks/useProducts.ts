import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '@/lib/api';
import { Product } from '@/data/products';

export interface UseProductsParams {
    category?: string;
    isNew?: boolean;
    isTrending?: boolean;
    filter?: string;
}

export const useProducts = (params?: UseProductsParams) => {
    let queryString = '';
    if (params) {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.isNew) searchParams.append('isNew', 'true');
        if (params.isTrending) searchParams.append('isTrending', 'true');
        if (params.filter === 'new') searchParams.append('isNew', 'true');
        if (params.filter === 'trending') searchParams.append('isTrending', 'true');
        queryString = searchParams.toString();
    }

    return useQuery<Product[]>({
        queryKey: ['products', queryString],
        queryFn: () => fetchProducts(queryString),
    });
};

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
};
