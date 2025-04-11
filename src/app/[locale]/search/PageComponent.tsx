'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import TopBlurred from "~/components/TopBlurred";
import {useEffect, useRef, useState} from "react";
import {getCompressionImageLink, getLinkHref, getShareToPinterest} from "~/configs/buildLink";
import Link from "next/link";
import {useCommonContext} from "~/context/common-context";
import {getResultStrAddSticker} from "~/configs/buildStr";
import {useRouter} from "next/navigation";
import {useInterval} from "ahooks";
import {pinterestSvg} from "~/components/svg";

const PageComponent = ({
                         locale,
                         searchText,
                         resultInfoListInit,
                         sticker,
                       }) => {
  const router = useRouter();
  const [pagePath] = useState(sticker ? ('search?sticker=' + encodeURIComponent(sticker)) : 'search');
  const [resultInfoList, setResultInfoList] = useState(resultInfoListInit);
  const {
    setShowLoadingModal,
    userData,
    commonText
  } = useCommonContext();
  const [intervalCheckUser, setIntervalCheckUser] = useState(undefined);

  const [textStr, setTextStr] = useState(sticker);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!textStr) {
      window.location.reload();
      return;
    }
    setShowLoadingModal(true);
    const pageNew = `search?sticker=${textStr}`;
    const resultStr = getLinkHref(locale, pageNew);
    window.location.href = process.env.NEXT_PUBLIC_SITE_URL + '/' + resultStr;
    setShowLoadingModal(false);
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
    setIntervalCheckUser(500)
    return () => {
    }
  }, []);

  const updateWork = async (uid) => {
    setShowLoadingModal(true);
    const response = await fetch(`/api/works/updateWork`, {
      method: 'POST',
      body: JSON.stringify({uid: uid})
    });
    const result = await response.json();
    console.log('result->', result);
    setShowLoadingModal(false);
    window.location.reload();
  }

  return (
    <>
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={searchText.title}
        description={searchText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <div className={"my-auto mt-4 min-h-[90vh]"}>
        <TopBlurred/>

        <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-10 md:py-12 lg:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-6xl text-white">{searchText.h1Text}</h2>
            <h1 className="mx-auto mb-6 text-sm md:text-xl text-[#7c8aaa]">
              {searchText.h2Text}
            </h1>
            <div className="mx-auto mb-4 flex max-w-xl justify-center">
              <form onSubmit={handleSubmit} className="relative w-full max-w-[80%]">
                <input type="text"
                       className="rounded-lg h-9 w-full bg-white px-3 py-6 text-sm text-[#333333] custom-textarea"
                       placeholder={commonText.placeholderText}
                       value={textStr}
                       onChange={(e) => {
                         setTextStr(e.target.value);
                       }}
                       maxLength={100}
                />
                <input type="submit"
                       value={commonText.searchButtonText}
                       className="rounded-r-md rounded-l-md md:rounded-l-none relative top-[5px] md:top-0 md:h-full w-full cursor-pointer bg-[#f05011] px-6 py-2 text-center font-semibold text-white sm:absolute md:right-0 sm:w-auto"/>
              </form>
            </div>
          </div>
        </div>

        {
          resultInfoList.length <= 0 ?
            <div className={"px-6 py-4"}>
              <Link href={getLinkHref(locale, '')}
                    className={"flex justify-center items-center text-xl text-red-400 hover:text-blue-600"}>
                {commonText.generateNew} {'>>'}
              </Link>
            </div>
            :
            null
        }

        {
          resultInfoList.length > 0 ?
            <>
              <div className={"w-[90%] mx-auto mb-10"}>
                <div role="list"
                     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {resultInfoList.map((file, index) => (
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
                            alt={file.input_text}
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
              <div key={"more"} className={"px-4"}>
                <Link
                  href={getLinkHref(locale, 'stickers')}
                  onClick={() => setShowLoadingModal(true)}
                  className={"flex justify-center items-center text-xl text-red-400 hover:text-blue-600"}>
                {commonText.exploreMore} {'>>'}
                </Link>
              </div>
            </>
            :
            null
        }

      </div>
      <Footer
        locale={locale}
        page={pagePath}
      />
    </>
  )

}

export default PageComponent
