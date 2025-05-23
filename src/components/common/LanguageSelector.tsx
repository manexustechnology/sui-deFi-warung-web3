
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 bg-white/70 backdrop-blur-sm"
        >
          <Globe className="h-4 w-4" />
          <span>{language === 'en' ? 'English' : 'Indonesia'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <span className={language === 'en' ? 'font-bold' : ''}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('id')}>
          <span className={language === 'id' ? 'font-bold' : ''}>Indonesia</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
