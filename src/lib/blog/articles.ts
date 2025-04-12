import { Article } from '~/types/blog';

// 模拟文章数据
const articles: Article[] = [
  {
    id: 1,
    uid: 'getting-started-with-words-to-photo',
    title: 'Getting Started with Words to Photo',
    excerpt: 'Learn how to use Words to Photo to transform your text into beautiful images.',
    content: `
      <p>Words to Photo is a powerful tool that helps you create stunning images from text. In this article, we'll explore the basics of using Words to Photo and how to get the most out of it.</p>
      
      <h2>What is Words to Photo?</h2>
      <p>Words to Photo is an AI-powered tool that converts text into visually appealing images. It's perfect for creating social media posts, blog headers, and more.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Easy to use interface</li>
        <li>Multiple style options</li>
        <li>High-quality output</li>
        <li>Customizable settings</li>
      </ul>
    `,
    featured_image: {
      url: '/images/blog/getting-started.jpg',
      alt: 'Getting Started with Words to Photo'
    },
    publication_date: '2024-03-20',
    author: {
      name: 'John Doe',
      avatar: '/images/authors/john-doe.jpg'
    }
  },
  {
    id: '2',
    uid: 'advanced-composition-techniques',
    title: 'Advanced Composition Techniques for Stunning Photos',
    excerpt: 'Take your photography to the next level with these advanced composition techniques.',
    content: `
      <h2>Advanced Composition Techniques</h2>
      <p>Once you've mastered the basics, it's time to explore more advanced composition techniques.</p>
      
      <h3>Creating Depth</h3>
      <p>Learn how to create a sense of depth in your images using various techniques:</p>
      <ul>
        <li>Foreground Interest</li>
        <li>Layering</li>
        <li>Atmospheric Perspective</li>
      </ul>

      <h2>Using Light Effectively</h2>
      <p>Understanding and working with light is crucial for creating compelling images:</p>
      <ul>
        <li>Golden Hour Photography</li>
        <li>Backlighting</li>
        <li>Silhouettes</li>
      </ul>
    `,
    featured_image: {
      url: '/images/blog/advanced-composition.jpg',
      alt: 'Advanced photography composition techniques'
    },
    publication_date: '2024-03-20',
    author: {
      name: 'Sarah Johnson',
      avatar: '/images/authors/sarah-johnson.jpg'
    }
  }
];

export async function getArticleByUid(uid: string): Promise<Article | null> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  return articles.find(article => article.uid === uid) || null;
}

export async function getAllArticles(): Promise<Article[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  return articles;
} 