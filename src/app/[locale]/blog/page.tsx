import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import PageComponent from './PageComponent';

export const revalidate = 0;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Blog');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Blog');
  
  return (
    <PageComponent
      locale={locale}
      blogText={{
        title: t('title'),
        description: t('description'),
        h1Text: t('h1Text'),
        descriptionBelowH1Text: t('descriptionBelowH1Text'),
      }}
    />
  );
} 