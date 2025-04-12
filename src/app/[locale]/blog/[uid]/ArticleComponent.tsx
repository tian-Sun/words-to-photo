'use client'

import { Layout } from '~/components/blog/Layout';
import { Profile } from '~/components/blog/Profile';
import { Article as ArticleType } from '~/types/blog';
import { formatDate } from '~/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { articles } from '~/lib/blog/mockData';
import { useState, useEffect } from 'react';

interface ArticleComponentProps {
  article: ArticleType;
  locale: string;
  blogText: {
    title: string;
    description: string;
    notFound: string;
    readMore: string;
    latestArticles: string;
  };
}

export default function ArticleComponent({ article, locale, blogText }: ArticleComponentProps) {
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Get other articles for the "More articles" section
  const otherArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <Layout
      locale={locale}
      page="blog"
      title={blogText.title}
      description={blogText.description}
    >
      <article>
        {/* Hero section */}
        <header className="relative">
          <div className="h-[70vh] relative">
            <Image
              src={article.featured_image.url}
              alt={article.featured_image.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-16">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 text-sm text-white/90 mb-4">
                  <time dateTime={article.publication_date}>
                    {formatDate(article.publication_date)}
                  </time>
                  <span>•</span>
                  <span>{article.author.name}</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-6">
                  {article.title}
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Article content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>
          </div>
        </div>

        {/* Share section */}
        <div className="border-t border-slate-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link
                href={`/${locale}/blog`}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to articles
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">Share:</span>
                {shareUrl && (
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-500"
                  >
                    <span className="sr-only">Share on Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* More articles section */}
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                {blogText.latestArticles}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {otherArticles.map((otherArticle) => (
                  <article key={otherArticle.id} className="group">
                    <Link
                      href={`/${locale}/blog/${otherArticle.uid}`}
                      className="block aspect-[4/3] relative mb-6 overflow-hidden rounded-lg bg-slate-100"
                    >
                      <Image
                        src={otherArticle.featured_image.url}
                        alt={otherArticle.featured_image.alt}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <time dateTime={otherArticle.publication_date}>
                        {formatDate(otherArticle.publication_date)}
                      </time>
                      <span>•</span>
                      <span>{otherArticle.author.name}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <Link
                        href={`/${locale}/blog/${otherArticle.uid}`}
                        className="text-slate-900 hover:text-slate-600 transition-colors"
                      >
                        {otherArticle.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 line-clamp-2">
                      {otherArticle.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Profile locale={locale} />
      </article>
    </Layout>
  );
}