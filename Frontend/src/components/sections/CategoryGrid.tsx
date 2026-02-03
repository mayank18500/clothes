import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import categoryWomen from '@/assets/category-women.jpg';
import categoryMen from '@/assets/category-men.jpg';
import categoryAccessories from '@/assets/category-accessories.jpg';
import categorySale from '@/assets/category-sale.jpg';

const categories = [
  { id: 'women', name: 'Women', image: categoryWomen, link: '/products?category=women' },
  { id: 'men', name: 'Men', image: categoryMen, link: '/products?category=men' },
  { id: 'accessories', name: 'Accessories', image: categoryAccessories, link: '/products?category=accessories' },
  { id: 'sale', name: 'Sale', image: categorySale, link: '/products?category=sale' },
];

const CategoryGrid = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-label mb-4 block">Collections</span>
          <h2 className="heading-section">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={category.link} className="group block relative overflow-hidden rounded-lg">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl md:text-2xl font-serif text-primary-foreground mb-2">
                    {category.name}
                  </h3>
                  <span className="text-sm text-primary-foreground/80 link-underline">
                    Discover
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
