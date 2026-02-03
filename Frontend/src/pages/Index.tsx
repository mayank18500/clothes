import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/sections/HeroCarousel';
import CategoryGrid from '@/components/sections/CategoryGrid';
import TrendingProducts from '@/components/sections/TrendingProducts';
import NewArrivals from '@/components/sections/NewArrivals';
import BrandStory from '@/components/sections/BrandStory';
import Lookbook from '@/components/sections/Lookbook';
import Newsletter from '@/components/sections/Newsletter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <CategoryGrid />
        <TrendingProducts />
        <NewArrivals />
        <BrandStory />
        <Lookbook />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
