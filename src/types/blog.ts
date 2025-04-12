export interface Article {
  id: string;
  uid: string;
  title: string;
  excerpt: string;
  content?: string;
  featured_image: {
    url: string;
    alt: string;
  };
  publication_date: string;
  author: {
    name: string;
    avatar: string;
  };
} 