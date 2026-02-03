import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product7 from '@/assets/product-7.jpg';

// Keeping images import if they are used elsewhere?
// Actually if the backend serves images as URLs, we might not need these here unless we are mapping.
// But the seed data put '/assets/product-1.jpg' into the DB.
// So the frontend needs to serve these assets.

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'women' | 'men' | 'accessories' | 'sale';
  subcategory: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNewArrival?: boolean;
  isTrending?: boolean;
  inStock: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  alignment: 'left' | 'center' | 'right';
}
