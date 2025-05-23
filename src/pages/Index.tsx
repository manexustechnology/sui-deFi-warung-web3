
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import LanguageSelector from '@/components/common/LanguageSelector';

const Index = () => {
  return (
    <div className="page">
      <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
        <LanguageSelector />
      </div>
      <Hero />
      <FeaturedProducts />
    </div>
  );
};

export default Index;
