import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const lookbookImages = [
  { id: 1, alt: 'Fashion editorial 1' },
  { id: 2, alt: 'Fashion editorial 2' },
  { id: 3, alt: 'Fashion editorial 3' },
  { id: 4, alt: 'Fashion editorial 4' },
  { id: 5, alt: 'Fashion editorial 5' },
  { id: 6, alt: 'Fashion editorial 6' },
];

const Lookbook = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-label mb-4 block">@maisonofficial</span>
          <h2 className="heading-section mb-4">Shop the Look</h2>
          <p className="text-fashion text-muted-foreground max-w-md mx-auto">
            Get inspired by our community. Share your style with #MaisonStyle
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {lookbookImages.map((image, index) => (
          <motion.a
            key={image.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative aspect-square overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-br from-sand to-cream" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Lookbook;
