'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {getCompressionImageLink, getLinkHref, getShareToPinterest, getTotalLinkHref} from "~/configs/buildLink";
import {useCommonContext} from "~/context/common-context";
import {useInterval} from "ahooks";
import PricingModal from "~/components/PricingModal";
import TopBlurred from "~/components/TopBlurred";
import {getResultStrAddSticker} from "~/configs/buildStr";
import {pinterestSvg} from "~/components/svg";


const PageComponent = ({
                         locale,
                         detailText,
                         workDetail,
                         similarList,
                       }) => {
  const [pagePath] = useState(`sticker/${workDetail.uid}`);

  const {
    setShowLoadingModal,
    userData,
    setShowPricingModal,
    setShowLoginModal,
    commonText
  } = useCommonContext();
  const [availableTimes, setAvailableTimes] = useState({
    available_times: 0,
    subscribeStatus: '0'
  });
  const [intervalAvailableTimes, setIntervalAvailableTimes] = useState(undefined);

  const getAvailableTimes = async () => {
    if (!userData) {
      return;
    }
    const userId = userData.user_id;
    if (userId) {
      const response = await fetch(`/api/user/getAvailableTimes?userId=${userId}`);
      const availableTimes = await response.json();
      setAvailableTimes(availableTimes);
      if (availableTimes.available_times >= 0) {
        setIntervalAvailableTimes(undefined);
      }
    }
  }
  useInterval(() => {
    getAvailableTimes();
  }, intervalAvailableTimes);

  const downloadResult = (url, index) => {
    if (process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      if (!userData) {
        setShowLoginModal(true);
        return;
      }
      if (index == 0) {
        window.location.href = url;
      } else {
        if (process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0') {
          if (availableTimes.subscribeStatus != 'active') {
            setShowPricingModal(true);
          } else {
            window.location.href = url;
          }
        }
      }
    } else {
      window.location.href = url;
    }
  }

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
    if (process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0' && process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0') {
      setIntervalAvailableTimes(1000);
    }
    return () => {
    }
  }, []);

  return (
    <>
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={detailText.title}
        description={detailText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <PricingModal
        locale={locale}
        page={pagePath}
      />
      <div className="mt-4 my-auto min-h-[90vh]">
        {/*<TopBlurred/>*/}
        <div className="block overflow-hidden bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div
              className="mx-auto flex max-w-4xl flex-col items-center text-center py-10">
              <h1 className="mb-4 text-2xl font-bold md:text-4xl">{detailText.h1Text}</h1>
            </div>

            <div key={"more"} className={"px-6 py-4"}>
              <Link
                href={getLinkHref(locale, '') + '?prompt=' + workDetail.input_text}
                onClick={() => setShowLoadingModal(true)}
                rel={"nofollow"}
                className={"flex justify-center items-center text-xl text-red-400 hover:text-blue-600"}>
                {commonText.generateNew} {'>>'}
              </Link>
            </div>

            <div className={"mx-auto"}>
              <div className={"flex-col px-8 py-4 justify-center items-center mx-auto"}>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
                  {
                    workDetail?.output_url?.length > 0 ?
                      <div className={"rounded-lg flex justify-center items-start"}>
                        <div className={"flex-col items-center"}>
                          <div className="relative">
                            <img
                              title={workDetail.input_text}
                              src={getCompressionImageLink(workDetail?.output_url[0])}
                              alt={workDetail.input_text + ' ' + process.env.NEXT_PUBLIC_IMAGE_ALT_ADDITION_TEXT}
                              className={"rounded-lg checkerboard z-20"}
                              width={400}
                              height={400}
                            />
                            <Link
                              href={`${getShareToPinterest(locale, 'sticker/' + workDetail.uid, detailText.h1Text)}`}
                              target={"_blank"}
                              className={"absolute top-1 left-1"}>
                              {pinterestSvg}
                            </Link>
                          </div>
                          <div
                            className="flex justify-center items-center space-x-3 px-2 py-2">
                            <div className="pt-2">
                              <button
                                type="submit"
                                onClick={() => downloadResult(workDetail?.output_url[0], 0)}
                                className="w-full inline-flex justify-center items-center rounded-md bg-[#ffa11b] px-3 py-2 text-xs md:text-lg font-semibold text-white shadow-sm hover:bg-[#f05011]"
                              >
                                {commonText.download}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      null
                  }
                  {
                    workDetail?.output_url?.length > 1 ?
                      <div className={"rounded-lg flex justify-center items-start"}>
                        <div className={"flex-col items-center"}>
                          <div className="relative">
                            <img
                              title={workDetail.input_text}
                              src={getCompressionImageLink(workDetail?.output_url[1])}
                              alt={workDetail.input_text + ' ' + process.env.NEXT_PUBLIC_IMAGE_ALT_ADDITION_TEXT}
                              className={"rounded-lg checkerboard"}
                              width={400}
                              height={400}
                            />
                            <Link
                              href={`https://pinterest.com/pin/create/button/?url=${getShareToPinterest(locale, 'sticker/' + workDetail.uid, detailText.h1Text)}`}
                              target={"_blank"}
                              className={"absolute top-1 left-1"}>
                              {pinterestSvg}
                            </Link>
                          </div>
                          <div
                            className="flex justify-center items-center space-x-3 px-2 py-2">
                            <div className="pt-2">
                              <button
                                type="submit"
                                onClick={() => downloadResult(workDetail?.output_url[1], 1)}
                                className="w-full inline-flex justify-center items-center rounded-md bg-[#ffa11b] px-3 py-2 text-xs md:text-lg font-semibold text-white shadow-sm hover:bg-[#f05011]"
                              >
                                {commonText.download} PNG
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2
          className={"w-[80%] mx-auto text-white pt-4 text-xl md:text-4xl flex justify-center items-center"}>{detailText.h2Text}</h2>
        <div className={"w-[90%] mx-auto mb-20"}>
          <div role="list"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {similarList?.map((file, index) => (
              <div key={file.input_text + index} className={"mt-6"}>
                <div
                  className="rounded-xl flex justify-center items-start checkerboard relative">
                  <Link
                    href={getLinkHref(locale, `sticker/${file.uid}`)}
                    onClick={() => setShowLoadingModal(true)}
                    className={"cursor-pointer"}
                  >
                    <img
                      src={getCompressionImageLink(file.output_url[1])}
                      alt={file.input_text + ' ' + process.env.NEXT_PUBLIC_IMAGE_ALT_ADDITION_TEXT}
                      width={400}
                      height={400}
                      className={"rounded-lg"}
                    />
                  </Link>
                  <Link
                    href={`https://pinterest.com/pin/create/button/?url=${getShareToPinterest(locale, 'sticker/' + file.uid, detailText.h1Text)}`}
                    target={"_blank"}
                    className={"absolute top-1 left-1"}>
                    {pinterestSvg}
                  </Link>
                </div>
                <div className={"flex justify-center items-center"}>
                  <p
                    className="pointer-events-none mt-2 block text-sm font-medium text-white w-[90%] line-clamp-2">{getResultStrAddSticker(file.input_text, commonText.keyword)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer
        locale={locale}
        page={pagePath}
      />
    </>
  )
}

export default PageComponent
