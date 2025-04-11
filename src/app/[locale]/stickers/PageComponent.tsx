'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'
import {useCommonContext} from "~/context/common-context";
import {getCompressionImageLink, getLinkHref, getShareToPinterest} from "~/configs/buildLink";
import {getResultStrAddSticker} from "~/configs/buildStr";
import TopBlurred from "~/components/TopBlurred";
import {pinterestSvg} from "~/components/svg";

const PageComponent = ({
                         locale,
                         exploreText,
                         resultInfoData,
                         page = 1,
                         pageData = {
                           totalPage: 0,
                           pagination: []
                         },
                       }) => {
  const [pagePath] = useState('stickers');
  const [resultInfoList, setResultInfoList] = useState(resultInfoData);
  const {
    setShowLoadingModal,
    commonText
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

  const checkShowLoading = (toPage) => {
    if (page != toPage) {
      setShowLoadingModal(true);
    }
  }

  return (
    <>
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={exploreText.title}
        description={exploreText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <div className={"my-auto mt-4 min-h-[90vh]"}>
        <TopBlurred/>
        <div className={"mb-8"}>
          <h2
            className={"text-white pt-4 text-3xl md:text-4xl flex justify-center items-center"}>{exploreText.h1Text}</h2>
          <div className="mb-5 w-[80%] md:max-w-[628px] lg:mb-8 mx-auto mt-4">
            <h1 className="text-[#7c8aaa] text-md md:text-xl">{exploreText.h2Text}</h1>
          </div>
        </div>
        <div key={"more"} className={"px-6 py-4"}>
          <Link href={getLinkHref(locale, '')}
                className={"flex justify-center items-center text-xl text-red-400 hover:text-blue-600"}>
            {commonText.generateNew} {'>>'}
          </Link>
        </div>
        <div className={"w-[90%] mx-auto mb-20"}>
          <div role="list"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {resultInfoList?.map((file, index) => (
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
                    href={`https://pinterest.com/pin/create/button/?url=${getShareToPinterest(locale, 'sticker/' + file.uid, file.input_text)}`}
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
        <div className={"flex justify-center items-center"}>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {
              pageData?.pagination?.length > 0 ?
                page == 2 ?
                  <Link
                    key={2}
                    href={getLinkHref(locale, `stickers`)}
                    className="no-underline relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-gray-100 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => checkShowLoading(page)}
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                  </Link>
                  :
                  <Link
                    key={1}
                    href={getLinkHref(locale, `stickers`)}
                    className="no-underline relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-gray-100 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => checkShowLoading(page)}
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                  </Link>
                :
                null
            }
            {
              pageData?.pagination?.map((pa, index) => {
                let href;
                if (pa == 1) {
                  href = getLinkHref(locale, `stickers`);
                } else if (pa == '...') {
                  href = `#`;
                } else {
                  href = getLinkHref(locale, `stickers/${pa}`);
                }
                if (pa == page) {
                  return (
                    <Link
                      key={pa}
                      href={href}
                      aria-current="page"
                      className="no-underline relative z-10 inline-flex items-center bg-[#de5c2d] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => checkShowLoading(pa)}
                    >
                      {pa}
                    </Link>
                  )
                } else {
                  return (
                    <Link
                      key={pa}
                      href={href}
                      className="no-underline relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-100 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      onClick={() => checkShowLoading(pa)}
                    >
                      {pa}
                    </Link>
                  )
                }
              })
            }
            {
              pageData?.pagination?.length > 0 ?
                page == pageData?.totalPage ?
                  <Link
                    key={page}
                    href={getLinkHref(locale, `stickers/${page}`)}
                    className="no-underline relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-gray-100 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => checkShowLoading(page)}
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                  </Link>
                  :
                  <Link
                    key={2}
                    href={getLinkHref(locale, `stickers/${Number(page) + 1}`)}
                    className="no-underline relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-gray-100 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => checkShowLoading(Number(page) + 1)}
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                  </Link>
                :
                null
            }
          </nav>
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
