
import React from 'react';
import { ArrowRight, Store, Coins, Brain, Carrot, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div>
              <span className="tag bg-accent/10 text-accent font-medium">{t('hero.tag')}</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 leading-tight">
                <span className="text-green-600">{t('hero.title.part1')}</span> {t('hero.title.part2')} <span className="text-accent">{t('hero.title.part3')}</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-6">
                {t('hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary flex items-center justify-center">
                <span>{t('hero.exploreButton')}</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/about" className="btn-outline flex items-center justify-center">
                {t('hero.learnMoreButton')}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Store className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t('hero.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t('hero.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-down">
            <div className="relative z-10 glass rounded-2xl overflow-hidden">
              <img 
                src="/warungsayur.png" 
                alt="Warung Sayur Digital" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-6 -right-6 -z-10 rounded-2xl w-full h-full bg-green-300/30 blur-2xl opacity-50"></div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <div className="glass flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl animate-scale-in bg-gradient-to-r from-green-50 to-blue-50">
            <div className="space-y-2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">{t('hero.cta.title')}</h3>
              <p className="text-muted-foreground">{t('hero.cta.description')}</p>
            </div>
            <Link to="/products" className="btn-accent">
              {t('hero.cta.button')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
