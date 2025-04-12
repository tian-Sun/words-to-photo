import Image from "next/image";
import { formatDate } from "~/lib/utils";
import { Heading } from "./Heading";
import { ArticleType } from "./Article";

export type ArticleDetailType = ArticleType & {
  content: string;
};

interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image: {
      url: string;
      alt: string;
    };
    publication_date: string;
    author: {
      name: string;
      avatar: string;
    };
  };
  locale: string;
}

export function ArticleDetail({ article, locale }: ArticleDetailProps) {
  return (
    <article className="prose prose-lg mx-auto">
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={article.featured_image.url}
          alt={article.featured_image.alt}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-12 h-12">
          <Image
            src={article.author.avatar}
            alt={article.author.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{article.author.name}</p>
          <time className="text-gray-500 text-sm">
            {formatDate(article.publication_date)}
          </time>
        </div>
      </div>
      
      <div className="text-xl text-gray-600 mb-8">
        {article.excerpt}
      </div>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
} 