import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const NewArrivals = () => {
  const { data: newProducts = [] } = useProducts({ isNew: true });

  return (
    <section className="section-padding bg-background">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-label mb-4 block">Just In</span>
            <h2 className="heading-section">New Arrivals</h2>
          </div>
          <Link
            to="/products?filter=new"
            className="flex items-center gap-2 text-sm font-medium tracking-wide mt-4 md:mt-0 link-underline"
          >
            Shop New In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
