import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  alignment: 'left' | 'center' | 'right';
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Spring Collection',
    subtitle: 'Discover the new season essentials',
    cta: 'Shop Now',
    ctaLink: '/products?category=women',
    image: hero1,
    alignment: 'left',
  },
  {
    id: '2',
    title: 'Timeless Elegance',
    subtitle: 'Crafted for the modern wardrobe',
    cta: 'Explore',
    ctaLink: '/products?category=men',
    image: hero2,
    alignment: 'center',
  },
  {
    id: '3',
    title: 'The Art of Accessorizing',
    subtitle: 'Complete your look with signature pieces',
    cta: 'View Collection',
    ctaLink: '/products?category=accessories',
    image: hero3,
    alignment: 'right',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-center text-center';
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container-fashion w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`flex flex-col ${getAlignmentClasses(slide.alignment)} max-w-xl ${
                slide.alignment === 'right' ? 'ml-auto' : slide.alignment === 'center' ? 'mx-auto' : ''
              }`}
            >
              <span className="text-label text-primary-foreground/90 mb-4">New Season</span>
              <h1 className="heading-display text-primary-foreground mb-4">
                {slide.title}
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-md">
                {slide.subtitle}
              </p>
              <Link
                to={slide.ctaLink}
                className="btn-fashion bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-background/20 backdrop-blur-sm hover:bg-background/40 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-primary-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-background/20 backdrop-blur-sm hover:bg-background/40 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-0.5 transition-all duration-300 ${
              index === currentSlide ? 'w-12 bg-primary-foreground' : 'w-6 bg-primary-foreground/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
