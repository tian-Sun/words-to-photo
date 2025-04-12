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
    <div className="min-h-screen bg-gradient-to-b from-[#8B5CF6] to-[#6366F1]">
      <HeadInfo
        locale={locale}
        page={page}
        title={title}
        description={description}
      />
      <Header locale={locale} />
      <div className="bg-white">
        {children}
      </div>
      <Footer
        locale={locale}
        page={page}
      />
    </div>
  );
}; 