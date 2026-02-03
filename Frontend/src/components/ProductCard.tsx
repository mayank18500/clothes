import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 rounded-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNewArrival && (
              <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary text-primary-foreground rounded-sm">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-destructive text-destructive-foreground rounded-sm">
                Sale
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <button className="w-full py-3 text-sm font-medium tracking-wider uppercase bg-primary text-primary-foreground hover:bg-charcoal transition-colors rounded-md">
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium tracking-wide group-hover:underline transition-all">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 pt-2">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
