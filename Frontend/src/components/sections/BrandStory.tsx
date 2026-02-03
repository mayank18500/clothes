import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BrandStory = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-fashion">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label text-primary-foreground/70 mb-4 block">Our Story</span>
            <h2 className="heading-section mb-6">Crafted with Purpose</h2>
            <p className="text-fashion text-primary-foreground/80 mb-6">
              At MAISON, we believe in the art of thoughtful design. Every piece in our collection 
              is carefully crafted to stand the test of time, both in quality and style.
            </p>
            <p className="text-fashion text-primary-foreground/80 mb-8">
              We partner with artisans who share our commitment to excellence, using only the 
              finest materials sourced responsibly from around the world.
            </p>
            <Link
              to="/about"
              className="btn-fashion bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-secondary/20 to-muted/20 rounded-lg" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/30 rounded-lg" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
