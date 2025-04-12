import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { articles, articleDetails } from '~/lib/blog/mockData';
import ArticleComponent from './ArticleComponent';

export const revalidate = 0;

export async function generateMetadata({ params: { locale, uid } }: { params: { locale: string; uid: string } }): Promise<Metadata> {
  const article = articleDetails.find(article => article.uid === uid);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Words to Photo Blog`,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    uid: article.uid,
  }));
}

interface ArticlePageProps {
  params: {
    uid: string;
    locale: string;
  };
}

export default async function ArticlePage({ params: { locale, uid } }: ArticlePageProps) {
  unstable_setRequestLocale(locale);
  
  const article = articleDetails.find(article => article.uid === uid);
  const t = await getTranslations('Blog');
  
  if (!article) {
    notFound();
  }

  return (
    <ArticleComponent
      article={article}
      locale={locale}
      blogText={{
        title: t('title'),
        description: t('description'),
        notFound: t('notFound'),
        readMore: t('readMore'),
        latestArticles: t('latestArticles'),
      }}
    />
  );
} 