'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import {useEffect, useRef, useState} from "react";
import {useCommonContext} from "~/context/common-context";
import {useInterval} from "ahooks";
import Link from "next/link";
import {getCompressionImageLink, getLinkHref, getShareToPinterest} from "~/configs/buildLink";
import {getResultStrAddSticker} from "~/configs/buildStr";
import TopBlurred from "~/components/TopBlurred";
import {pinterestSvg} from "~/components/svg";


const PageComponent = ({
                         locale,
                         worksText
                       }) => {
  const [pagePath] = useState('my');

  const [resultInfoList, setResultInfoList] = useState([]);
  const {
    setShowLoadingModal,
    userData,
    commonText,
  } = useCommonContext();
  const [intervalWorkList, setIntervalWorkList] = useState(1000);

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
    setShowLoadingModal(true);
    return () => {
    }
  }, []);

  const getCurrentWorkList = async (newPage) => {
    if (!userData) {

    } else {
      setCurrentPage(newPage);
      setIntervalWorkList(undefined);
      const requestData = {
        user_id: userData.user_id,
        current_page: newPage
      }
      // setShowLoadingModal(true);
      const response = await fetch(`/api/works/getWorkList`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      setShowLoadingModal(false);
      if (result.length == 0) {
        setAlreadyLoadAll(true);
      } else {
        setResultInfoList([...resultInfoList, ...result]);
      }
      // setResultInfoList(result);
    }
  }
  useInterval(() => {
    getCurrentWorkList(currentPage)
  }, intervalWorkList);

  const [currentPage, setCurrentPage] = useState(1);
  const [alreadyLoadAll, setAlreadyLoadAll] = useState(false);

  const myRef = useRef(null);
  const handleScroll = async () => {
    const {scrollHeight, clientHeight, scrollTop} = myRef.current;
    if (scrollHeight - clientHeight <= scrollTop + 1) {
      console.log('Reached bottom');
      if (!alreadyLoadAll) {
        await getCurrentWorkList(currentPage + 1);
      }
    }
  };

  return (
    <>
      <meta name="robots" content="noindex"/>
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={worksText.title}
        description={worksText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <div className={"my-auto h-screen overflow-y-auto"} ref={myRef} onScroll={handleScroll}>
        <TopBlurred/>
        <div className="block overflow-hidden text-white">
          <div className="mx-auto w-full px-5 mb-5">
            <div
              className="mx-auto flex max-w-4xl flex-col items-center text-center py-6">
              <h1 className="text-4xl font-bold md:text-6xl">{worksText.h1Text}</h1>
            </div>
            <div key={"more"} className={"px-6"}>
              <Link
                href={getLinkHref(locale, '')}
                onClick={() => setShowLoadingModal(true)}
                className={"flex justify-center items-center text-xl text-red-400 hover:text-blue-600"}>
                {commonText.generateNew} {'>>'}
              </Link>
            </div>
            <div className={"w-[90%] mx-auto mb-20"}>
              <div role="list"
                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {resultInfoList?.map((file, index) => (
                  <div key={file.input_text + index}>
                    <div
                      className="rounded-xl flex justify-center items-start mt-6 checkerboard relative">
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
