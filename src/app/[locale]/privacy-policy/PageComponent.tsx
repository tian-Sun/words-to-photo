'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Markdown from "react-markdown";
import TopBlurred from "~/components/TopBlurred";
import {useEffect, useRef, useState} from "react";
import {useCommonContext} from "~/context/common-context";

const PageComponent = ({
                         locale,
                         privacyPolicyText,
                       }) => {

  const [pagePath] = useState("privacy-policy");
  const {setShowLoadingModal} = useCommonContext();

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
    <>
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={privacyPolicyText.title}
        description={privacyPolicyText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />

      <div className="mt-6 my-auto min-h-[80vh]">
        <TopBlurred/>
        <main className="w-[95%] md:w-[65%] lg:w-[55%] 2xl:w-[45%] mx-auto h-full my-8">
          <div className="p-6 prose mx-auto text-gray-300 div-markdown-color">
            <Markdown>
              {privacyPolicyText.detailText}
            </Markdown>
          </div>
        </main>
      </div>

      <Footer
        locale={locale}
        page={pagePath}
      />
    </>
  )
}

export default PageComponent
