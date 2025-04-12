'use client'
import Link from 'next/link';
import { Navigation } from './Navigation';

interface HeaderProps {
  locale: string;
}

export const Header = ({ locale }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href={`/${locale}`}
            className="text-2xl font-bold text-slate-900 hover:text-slate-600 transition-colors"
          >
            Words to Photo
          </Link>
          <Navigation locale={locale} />
        </div>
      </div>
    </header>
  );
}; 