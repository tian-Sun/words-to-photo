'use client'
import { articles } from '~/lib/blog/mockData';
import { Article } from '~/components/blog/Article';
import { Layout } from '~/components/blog/Layout';
import { Profile } from '~/components/blog/Profile';
import { useEffect, useRef, useState } from "react";
import { useCommonContext } from "~/context/common-context";

const PageComponent = ({
  locale,
  blogText,
}) => {
  const [pagePath] = useState('blog');
  const { setShowLoadingModal } = useCommonContext();

  const useCustomEffect = (effect, deps) => {
    const isInitialMount = useRef(true);
    useEffect(() => {
      if (process.env.NODE_ENV === 'production' || isInitialMount.current) {
        isInitialMount.current = false;
        return effect();
      }
    }, deps);
  };

  useCustomEffect(() => {
    setShowLoadingModal(false);
    return () => {
    }
  }, []);

  return (
    <Layout
      locale={locale}
      page={pagePath}
      title={blogText.title}
      description={blogText.description}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              {blogText.h1Text}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {blogText.descriptionBelowH1Text}
            </p>
          </div>
          <div className="space-y-24">
            {articles.map((article) => (
              <Article key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      </div>
      <Profile locale={locale} />
    </Layout>
  );
};

export default PageComponent; 