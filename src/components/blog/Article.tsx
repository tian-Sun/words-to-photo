'use client'
import Image from "next/image";
import Link from "next/link";
import { Article as ArticleType } from '~/types/blog';
import { formatDate } from '~/lib/utils';

interface ArticleProps {
  article: ArticleType;
  locale: string;
}

export const Article = ({ article, locale }: ArticleProps) => {
  return (
    <article className="group grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 items-center">
      <Link 
        href={`/${locale}/blog/${article.uid}`}
        className="block overflow-hidden rounded-lg bg-slate-50 aspect-[4/3] relative"
      >
        <Image
          src={article.featured_image}
          alt={article.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div>
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <time dateTime={article.publication_date}>
            {formatDate(article.publication_date)}
          </time>
          <span>•</span>
          <span>{article.author}</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">
          <Link 
            href={`/${locale}/blog/${article.uid}`}
            className="text-slate-900 hover:text-slate-600 transition-colors"
          >
            {article.title}
          </Link>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          {article.excerpt}
        </p>
        <Link
          href={`/${locale}/blog/${article.uid}`}
          className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors"
        >
          Read More
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}; 