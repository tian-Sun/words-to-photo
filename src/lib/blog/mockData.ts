import { Article } from "~/types/blog";

// 模拟文章列表数据
export const articles: Article[] = [
  {
    id: '1',
    uid: 'getting-started',
    title: 'How AI is Revolutionizing Tattoo Design',
    publication_date: '2025-04-12',
    featured_image: {
      url: '/images/blog/website.png',
      alt: 'Getting Started Guide'
    },
    excerpt: 'Welcome to the AITattoo.pro blog! In this blog post, we will dive into how AITattoo.pro can help you create your dream tattoo.',
    author: {
      name: 'AI Tattoo.Pro Team',
      avatar: '/images/authors/team.jpg'
    }
  }
];

// 模拟文章详情数据
export const articleDetails: Article[] = [
  {
    ...articles[0],
    content: `
      <h2>The Future of Tattoo Design: AI Tattoo Generation</h2>
    <p>In the world of tattoo art, creativity knows no bounds. Traditionally, finding the right tattoo design could be a time-consuming process, with countless hours spent researching or working with an artist. But what if you could bypass all that and generate a custom tattoo in just a few minutes? That’s where AITattoo.pro comes in.</p>

    <p>At AITattoo.pro, we use cutting-edge AI technology to create unique, personalized tattoos based on your preferences. Whether you have a clear vision of your tattoo or just a rough idea, our platform lets you customize every detail—gender, body placement, reference images, and more.</p>

    <h3>How It Works:</h3>
    <ul>
        <li><strong>Select Your Preferences:</strong> Our easy-to-use platform allows you to select your gender and body placement, ensuring your tattoo fits the way you envision it.</li>
        <li><strong>Upload a Reference Image or Describe Your Idea:</strong> You can upload a reference image of a design you like or simply describe your idea in detail. Whether it’s a delicate flower, a bold dragon, or something abstract, our AI will work with the details you provide.</li>
        <li><strong>Let the AI Do the Magic:</strong> Once you’ve entered your preferences, the AI generates a unique tattoo design just for you. It’s quick, free, and fully customizable. You can tweak the design to your liking and make it truly yours!</li>
        <li><strong>Get Your Custom Tattoo:</strong> After finalizing your design, it’s ready to take to your tattoo artist, so you can get your new ink!</li>
    </ul>

    <h3>Why Choose AITattoo.pro?</h3>
    <ul>
        <li><strong>Speed & Convenience:</strong> Skip the traditional design process and get a unique tattoo in minutes.</li>
        <li><strong>Fully Customizable:</strong> Tailor your tattoo to your exact specifications, ensuring it’s truly one-of-a-kind.</li>
        <li><strong>Free & Easy:</strong> Create your tattoo at no cost, and without needing any design experience.</li>
        <li><strong>AI-Driven Innovation:</strong> Benefit from the latest in artificial intelligence technology to bring your ideas to life.</li>
    </ul>

    <h2>Conclusion:</h2>
    <p>Your perfect tattoo is just a few clicks away with AITattoo.pro. Whether you're looking for a classic design or something completely unique, our platform empowers you to create a tattoo that’s as individual as you are. Say goodbye to long design consultations and endless revisions. Embrace the future of tattoo design with AI at your fingertips.</p>

    <h2>Stay Tuned:</h2>
    <p>We’ll be posting more tips, stories, and inspiration on the blog soon, so make sure to check back regularly! In the meantime, start designing your custom tattoo today at <a href="https://www.aitattoo.pro" target="_blank" rel="noopener noreferrer">AITattoo.pro</a>.</p>
    `
  }
]; 