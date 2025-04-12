'use client'
import HeadInfo from "~/components/HeadInfo";
import { Header } from "./Header";
import Footer from "~/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
  locale: string;
  page: string;
  title: string;
  description: string;
}

export const Layout = ({ children, locale, page, title, description }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <HeadInfo
        locale={locale}
        page={page}
        title={title}
        description={description}
      />
      <Header locale={locale} />
      <main className="py-16">
        {children}
      </main>
      <Footer
        locale={locale}
        page={page}
      />
    </div>
  );
}; 