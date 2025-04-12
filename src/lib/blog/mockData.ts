import { Article } from "~/types/blog";

// 模拟文章列表数据
export const articles: Article[] = [
  {
    id: '1',
    uid: 'getting-started',
    title: '开始使用 Words to Photo',
    publication_date: '2024-03-20',
    featured_image: '/images/blog/getting-started.jpg',
    excerpt: '欢迎使用 Words to Photo！本指南将帮助您开始使用我们的平台，了解基本功能和如何创建您的第一个作品。',
    author: 'Words to Photo Team'
  },
  {
    id: '2',
    uid: 'advanced-features',
    title: '高级功能指南',
    publication_date: '2024-03-21',
    featured_image: '/images/blog/advanced-features.jpg',
    excerpt: '探索 Words to Photo 的高级功能，这些功能可以提升您的创作体验，让您的作品更加独特和精美。',
    author: 'Words to Photo Team'
  },
  {
    id: '3',
    uid: 'tips-and-tricks',
    title: '获得更好结果的技巧和窍门',
    publication_date: '2024-03-22',
    featured_image: '/images/blog/tips-and-tricks.jpg',
    excerpt: '学习一些技巧和窍门，帮助您从 Words to Photo 获得最佳结果，创建令人惊叹的图像。',
    author: 'Words to Photo Team'
  }
];

// 模拟文章详情数据
export const articleDetails: Article[] = [
  {
    ...articles[0],
    content: `
      <h2>欢迎使用 Words to Photo</h2>
      <p>Words to Photo 是一个强大的 AI 驱动的图像生成平台，可以将您的文字描述转化为精美的图像。无论您是设计师、艺术家还是创意工作者，我们的平台都能帮助您快速创建独特的视觉内容。</p>
      
      <h2>基本功能</h2>
      <p>我们的平台提供以下基本功能：</p>
      <ul>
        <li>文本到图像生成</li>
        <li>多种风格和主题选择</li>
        <li>高分辨率输出</li>
        <li>简单的用户界面</li>
      </ul>
      
      <h2>如何开始</h2>
      <p>要开始使用 Words to Photo，只需按照以下步骤操作：</p>
      <ol>
        <li>注册一个账户</li>
        <li>选择您想要的图像风格</li>
        <li>输入您的文字描述</li>
        <li>点击"生成"按钮</li>
        <li>下载或分享您的作品</li>
      </ol>
      
      <h2>提示</h2>
      <p>为了获得最佳结果，请尝试使用详细和具体的描述。例如，不要只写"一只猫"，而是尝试"一只橘色的猫，坐在窗台上，阳光透过窗户照射在它身上"。</p>
      
      <h2>下一步</h2>
      <p>现在您已经了解了基础知识，为什么不尝试创建您的第一个作品呢？如果您想了解更多高级功能，请查看我们的高级功能指南。</p>
    `
  },
  {
    ...articles[1],
    content: `
      <h2>Words to Photo 的高级功能</h2>
      <p>一旦您熟悉了 Words to Photo 的基本功能，您就可以开始探索我们平台提供的高级功能，这些功能可以帮助您创建更加独特和精美的图像。</p>
      
      <h2>自定义风格</h2>
      <p>我们的平台允许您自定义图像的风格，包括：</p>
      <ul>
        <li>艺术风格（如印象派、立体派、超现实主义等）</li>
        <li>色彩方案</li>
        <li>构图和视角</li>
        <li>光照效果</li>
      </ul>
      
      <h2>批量生成</h2>
      <p>如果您需要创建多个相似的图像，我们的批量生成功能可以节省您的时间。只需上传一个包含多个描述的 CSV 文件，系统将自动为每个描述生成一个图像。</p>
      
      <h2>图像编辑</h2>
      <p>生成图像后，您可以使用我们的内置编辑工具进行进一步的调整：</p>
      <ul>
        <li>裁剪和调整大小</li>
        <li>调整亮度和对比度</li>
        <li>应用滤镜和效果</li>
        <li>添加文字和图形</li>
      </ul>
      
      <h2>高级提示技巧</h2>
      <p>要充分利用我们的高级功能，请尝试以下提示技巧：</p>
      <ol>
        <li>使用特定的艺术术语来描述您想要的风格</li>
        <li>指定图像的构图和视角</li>
        <li>描述光照和阴影效果</li>
        <li>指定颜色和纹理</li>
      </ol>
      
      <h2>集成和 API</h2>
      <p>对于开发者和高级用户，我们提供 API 访问，允许您将 Words to Photo 的功能集成到您自己的应用程序和工作流程中。</p>
    `
  },
  {
    ...articles[2],
    content: `
      <h2>Words to Photo 的技巧和窍门</h2>
      <p>无论您是 Words to Photo 的新手还是经验丰富的用户，这些技巧和窍门都可以帮助您获得更好的结果，创建更加令人惊叹的图像。</p>
      
      <h2>编写有效的提示</h2>
      <p>提示的质量直接影响生成图像的质量。以下是一些编写有效提示的技巧：</p>
      <ul>
        <li>使用具体和详细的描述</li>
        <li>包含有关风格、构图和光照的信息</li>
        <li>使用艺术术语来描述您想要的风格</li>
        <li>避免模糊和矛盾的描述</li>
      </ul>
      
      <h2>示例提示</h2>
      <p>以下是一些有效的提示示例：</p>
      <ul>
        <li>"一只橘色的猫，坐在窗台上，阳光透过窗户照射在它身上，印象派风格"</li>
        <li>"未来主义城市景观，霓虹灯照亮了雨后的街道，赛博朋克风格"</li>
        <li>"宁静的山间湖泊，倒映着周围的松树和雪山，日出时分，写实风格"</li>
      </ul>
      
      <h2>迭代和改进</h2>
      <p>生成图像后，不要害怕进行迭代和改进：</p>
      <ol>
        <li>分析生成的图像</li>
        <li>确定需要改进的方面</li>
        <li>调整您的提示</li>
        <li>再次生成</li>
      </ol>
      
      <h2>常见问题解决</h2>
      <p>如果您遇到以下问题，请尝试以下解决方案：</p>
      <ul>
        <li><strong>图像质量不佳：</strong> 尝试使用更详细的提示，并指定高分辨率输出</li>
        <li><strong>风格不一致：</strong> 在提示中明确指定风格，并使用一致的术语</li>
        <li><strong>构图问题：</strong> 在提示中明确描述您想要的构图和视角</li>
        <li><strong>颜色问题：</strong> 在提示中明确指定颜色和色彩方案</li>
      </ul>
      
      <h2>高级技巧</h2>
      <p>对于想要更进一步的高级用户，请尝试以下技巧：</p>
      <ul>
        <li>使用参考图像</li>
        <li>结合多种风格</li>
        <li>使用负面提示来避免不需要的元素</li>
        <li>实验不同的参数设置</li>
      </ul>
    `
  }
]; 