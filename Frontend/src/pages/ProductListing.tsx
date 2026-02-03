import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync internal state with URL params
  // Use useEffect to update state when URL params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      // If no category param (e.g. "All Products"), we probably want to start fresh or keep empty
      // If the user manually cleared, it's empty.
      // If we came from ?category=men to /products, we should probably clear 'men'.
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  const categories = ['women', 'men', 'accessories', 'sale'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Navy', hex: '#000080' },
  ];

  const { data: products = [], isLoading, error } = useProducts({
    filter: filterParam || undefined,
    category: categoryParam || undefined
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    // Only apply client-side category filter if we are NOT on a specific category page
    // OR if the user has explicitly selected categories that DIFFERENT from the current page context
    // Ideally, if we are on /products?category=men, the backend returns men.
    // If selectedCategories includes 'men', it filters 'men' from 'men', which is fine.
    // BUT if there is a mismatch case or something, it breaks.
    // Let's trust the backend data primarily.
    if (selectedCategories.length > 0) {
      // If the params Category is present, we should probably SKIP this filter if the selection matches the param
      // to avoid double-filtering issues.
      // However, simply filtering should be fine if data is correct.
      // The user issue "All empty" suggests a mismatch.
      // Let's be defensive: If backend returned data, and we filter it to empty, that's bad.
      // Debugging showed "Filtered Products" was empty.
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by special filters
    if (filterParam === 'new') {
      result = result.filter((p) => p.isNewArrival);
    } else if (filterParam === 'trending') {
      result = result.filter((p) => p.isTrending);
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategories, selectedSizes, selectedColors, priceRange, sortBy, filterParam, products]);


  console.log('API Products:', products);
  console.log('Filtered Products:', filteredProducts);
  console.log('Active Filters:', { selectedCategories, selectedSizes, selectedColors, priceRange });


  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 1000]);
  };

  const activeFiltersCount =
    selectedCategories.length + selectedSizes.length + selectedColors.length;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <span className="text-sm capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${selectedSizes.includes(size)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColors.includes(color.name)
                ? 'border-primary scale-110'
                : 'border-transparent'
                }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  const getPageTitle = () => {
    if (filterParam === 'new') return 'New Arrivals';
    if (filterParam === 'trending') return 'Trending Now';
    if (categoryParam) return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    return 'All Products';
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">Failed to load products.</div>
        ) : (
          <>
            {/* Page Header */}
            <div className="bg-secondary/30 py-12 md:py-16">
              <div className="container-fashion">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="heading-display mb-4">{getPageTitle()}</h1>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="sticky top-16 md:top-20 z-30 bg-background border-b border-border">
              <div className="container-fashion py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="w-5 h-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Active Filters */}
                  <div className="hidden md:flex items-center gap-2 flex-1">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full"
                      >
                        {category}
                        <button onClick={() => toggleCategory(category)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedSizes.map((size) => (
                      <span
                        key={size}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-secondary rounded-full"
                      >
                        {size}
                        <button onClick={() => toggleSize(size)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container-fashion py-8 md:py-12">
              <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-40">
                    <FilterContent />
                  </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-lg font-serif mb-2">No products found</p>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                      <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
