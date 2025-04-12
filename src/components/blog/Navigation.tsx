'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  locale: string;
}

export const Navigation = ({ locale }: NavigationProps) => {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/blog`, label: 'Articles' },
    { href: `/${locale}/blog/about`, label: 'About' },
    { href: `/${locale}/blog/contact`, label: 'Contact Me' },
  ];

  return (
    <nav className="flex items-center space-x-8">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-base ${
              isActive
                ? 'font-semibold text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}; 