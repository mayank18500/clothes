import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
// import { products } from '@/data/products'; // REMOVED
import { useProduct, useProducts } from '@/hooks/useProducts'; // Added useProducts

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Hook must be called unconditionally
  const { data: allProducts = [] } = useProducts({
    category: product?.category
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24 flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-fashion section-padding text-center">
            <h1 className="heading-section mb-4">Product not found</h1>
            <Link to="/products" className="btn-fashion-outline inline-block">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedToCart(true);

    setTimeout(() => {
      setIsAddedToCart(false);
      setIsCartOpen(true);
    }, 1000);
  };

  /* REMOVED DUPLICATE HOOK CALL */

  const relatedProducts = allProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-4">
          <div className="container-fashion">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link
                to={`/products?category=${product.category}`}
                className="text-muted-foreground hover:text-foreground capitalize"
              >
                {product.category}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span>{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-fashion py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.isNewArrival && (
                    <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary text-primary-foreground">
                      New
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-destructive text-destructive-foreground">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-24 bg-secondary rounded-md overflow-hidden transition-all ${currentImageIndex === index
                      ? 'ring-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="heading-section mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-medium">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-fashion text-muted-foreground">{product.description}</p>

              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Color</span>
                  <span className="text-sm text-muted-foreground">{selectedColor}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Size</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground link-underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 flex items-center justify-center text-sm border transition-colors ${selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="text-sm font-medium mb-3 block">Quantity</span>
                <div className="flex items-center border border-border rounded-md w-fit">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`flex-1 h-14 btn-fashion ${isAddedToCart
                    ? 'bg-primary hover:bg-primary'
                    : 'btn-fashion-primary'
                    }`}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Bag
                    </>
                  ) : (
                    'Add to Bag'
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-border"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-border"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {!selectedSize || !selectedColor ? (
                <p className="text-sm text-muted-foreground">
                  Please select a color and size
                </p>
              ) : null}

              {/* Product Details Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm font-medium">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Premium quality materials</li>
                      <li>Tailored fit</li>
                      <li>Dry clean only</li>
                      <li>Imported</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-sm font-medium">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      Free standard shipping on orders over $150. Express shipping
                      available at checkout.
                    </p>
                    <p>
                      Free returns within 30 days of purchase. Items must be unworn
                      with tags attached.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-padding bg-secondary/30">
            <div className="container-fashion">
              <h2 className="heading-section mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
