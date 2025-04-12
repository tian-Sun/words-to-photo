import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '~/lib/utils';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featured_image: {
    url: string;
    alt: string;
  };
  publication_date: string;
}

interface LatestArticlesProps {
  articles: Article[];
  currentArticleId?: string;
}

export function LatestArticles({ articles, currentArticleId }: LatestArticlesProps) {
  const filteredArticles = articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, 3);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.id}`}
            className="group block"
          >
            <article className="space-y-4">
              <div className="relative w-full h-48">
                <Image
                  src={article.featured_image.url}
                  alt={article.featured_image.alt}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {article.excerpt}
                </p>
                <time className="text-sm text-gray-500">
                  {formatDate(article.publication_date)}
                </time>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
} 