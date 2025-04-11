'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Pricing from "~/components/PricingComponent";
import {useEffect, useRef, useState} from "react";
import TopBlurred from "~/components/TopBlurred";
import {useCommonContext} from "~/context/common-context";


const PageComponent = ({
                         locale,
                       }) => {
  const [pagePath] = useState('pricing');

  const {
    setShowLoadingModal,
    pricingText
  } = useCommonContext();

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
        title={pricingText.title}
        description={pricingText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <div className={"mt-8 my-auto min-h-[90vh]"}>
        <TopBlurred/>
        <Pricing
          redirectUrl={`${locale}/pricing`}
          isPricing={true}
        />
      </div>
      <Footer
        locale={locale}
        page={pagePath}
      />
    </>
  )
}

export default PageComponent
