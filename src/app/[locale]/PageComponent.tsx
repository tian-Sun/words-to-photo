'use client'
import HeadInfo from "~/components/HeadInfo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import {useCommonContext} from "~/context/common-context";
import {useEffect, useRef, useState} from "react";
import {useInterval} from "ahooks";
import PricingModal from "~/components/PricingModal";
import Link from "next/link";
import {Switch} from "@headlessui/react";
import Markdown from "react-markdown";
import {getCompressionImageLink, getLinkHref, getShareToPinterest} from "~/configs/buildLink";
import {useRouter} from "next/navigation";
import {getResultStrAddSticker} from "~/configs/buildStr";
import TopBlurred from "~/components/TopBlurred";
import {pinterestSvg} from '~/components/svg'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PageComponent = ({
                         locale,
                         indexText,
                         questionText,
                         resultInfoListInit,
                         searchParams,
                       }) => {
  const router = useRouter();
  const [pagePath] = useState("");

  const {
    setShowLoadingModal,
    setShowLoginModal,
    setShowPricingModal,
    setShowGeneratingModal,
    commonText,
    userData,
    pricingText,
    menuText
  } = useCommonContext();
  const [resultInfoList, setResultInfoList] = useState(resultInfoListInit);
  const [countRefresh, setCountRefresh] = useState(0);

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
    getLocalStorage()
    if (process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0' && process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0') {
      setIntervalAvailableTimes(1000);
    }
    setShowLoadingModal(false);
    // setIntervalLatest(10000);
    return () => {
    }
  }, []);

  const getLocalStorage = () => {
    const textStr = localStorage.getItem('textStr');
    if (textStr) {
      setTextStr(textStr);
      localStorage.removeItem('textStr');
      return;
    }
    if (searchParams?.prompt) {
      setTextStr(searchParams.prompt);
    }
  }

  const [textStr, setTextStr] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!textStr) {
      return;
    }
    if (!userData && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      setShowLoginModal(true);
      localStorage.setItem('textStr', textStr);
      return;
    }
    setShowGeneratingModal(true);
    const requestData = {
      textStr: textStr,
      user_id: userData?.user_id,
      is_public: isPublic
    }
    const responseData = await fetch(`/api/generate/handle`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    const result = await responseData.json();
    if (result.status == 601 && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      setShowLoginModal(true);
      localStorage.setItem('textStr', textStr);
      return;
    }
    if (result.status == 602 && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      setShowPricingModal(true);
      localStorage.setItem('textStr', textStr);
      return;
    }
    const currentUid = result.uid;
    setUid(currentUid);
    if (process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      setIntervalAvailableTimes(1000);
    }
    setIntervalResultInfo(6000);
  }

  const [availableTimes, setAvailableTimes] = useState({
    available_times: 0,
    subscribeStatus: '0'
  });
  const [resultInfo, setResultInfo] = useState({
    uid: '',
    status: 0,
    input_text: '',
    output_url: [],
    revised_text: '',
    origin_language: '',
    current_language: ''
  });
  const [intervalAvailableTimes, setIntervalAvailableTimes] = useState(undefined);
  const [uid, setUid] = useState('');
  const [intervalResultInfo, setIntervalResultInfo] = useState(undefined);

  const getResultInfo = async () => {
    if (!userData?.user_id && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
      return
    }
    const userId = userData?.user_id;
    const response = await fetch(`/api/works/getResultInfo?uid=${uid}&userId=${userId}`);
    const resultInfo = await response.json();
    if (resultInfo.status == 1) {
      setResultInfo(resultInfo);
      router.push(getLinkHref(locale, `sticker/${resultInfo.uid}`));
      setShowGeneratingModal(false);
      setIntervalResultInfo(undefined);
      setIntervalAvailableTimes(1000);
    }
  }
  useInterval(() => {
    getResultInfo();
  }, intervalResultInfo);

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

  const downloadResult = (url) => {
    window.location.href = url;
  }

  const [isPublic, setIsPublic] = useState(true);


  const checkSubscribe = () => {
    if (availableTimes.subscribeStatus == 'active') {
      setIsPublic(!isPublic);
    } else {
      setShowPricingModal(true);
    }
  }

  const [intervalLatest, setIntervalLatest] = useState(undefined);
  const getLatestList = async () => {
    if (countRefresh >= 9) {
      setIntervalLatest(undefined);
      return;
    }
    const requestData = {
      locale: locale
    }
    const response = await fetch(`/api/works/getLatestPublicResultList`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    const result = await response.json();
    setCountRefresh(countRefresh + 1);
    setResultInfoList(result);
  }
  useInterval(() => {
    getLatestList();
  }, intervalLatest);

  const hasAnyKey = (obj) => {
    return Object.keys(obj).length > 0;
  }

  return (
    <>
      {
        hasAnyKey(searchParams) ?
          <meta name="robots" content="noindex"/>
          :
          null
      }
      <HeadInfo
        locale={locale}
        page={pagePath}
        title={indexText.title}
        description={indexText.description}
      />
      <Header
        locale={locale}
        page={pagePath}
      />
      <PricingModal
        locale={locale}
        page={pagePath}
      />
      <div className="mt-4 my-auto">
        <TopBlurred/>
        <div className="block overflow-hidden text-white">
          <div className="mx-auto w-full px-5 mb-5">
            <div
              className="mx-auto flex max-w-4xl flex-col items-center text-center py-10">
              <h2 className="mb-4 text-4xl font-bold md:text-6xl">{indexText.h1Text}</h2>
              <div className="mb-5 max-w-[628px] lg:mb-8">
                <h1 className="text-[#7c8aaa] text-xl">{indexText.descriptionBelowH1Text}</h1>
              </div>
            </div>

            <div className={"max-w-7xl px-9 mx-auto"}>
              <div
                className={"mx-auto rounded-tl-[30px] rounded-tr-[30px] border-[12px] border-[#ffffff1f] object-fill"}>
                <form onSubmit={handleSubmit} className="relative shadow-lg">
                  <div
                    className="overflow-hidden rounded-tl-[20px] rounded-tr-[20px]">
                    <textarea
                      rows={5}
                      name="description"
                      id="description"
                      className="custom-textarea block w-full resize-none text-gray-900 placeholder:text-gray-400 text-lg p-4 pl-4"
                      placeholder={commonText.placeholderText}
                      value={textStr}
                      onChange={(e) => {
                        setTextStr(e.target.value);
                      }}
                      maxLength={400}
                    />
                  </div>
                  {
                    userData?.user_id ?
                      <div
                        className="flex flex-col justify-start items-center md:flex-row md:justify-center md:items-center bg-white text-black md:pb-2">
                        {
                          process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' && availableTimes.subscribeStatus == '' ?
                            <>
                              <p>{commonText.timesLeft} <span
                                className={"text-red-400"}>{availableTimes.available_times}</span> {commonText.timesRight}
                                <span className={"font-bold hidden md:inline-flex"}>&nbsp;|&nbsp;</span>
                              </p>
                            </>
                            :
                            process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' && availableTimes.subscribeStatus == 'active' ?
                              <>
                                <span className={"text-red-400"}>{pricingText.subscriptionIntro0}</span>
                                <span className={"font-bold hidden md:inline-flex"}>&nbsp;|&nbsp;</span>
                              </>
                              :
                              null
                        }
                        {
                          process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' ?
                            <div className={"inline-flex mb-2 md:mb-0"}>
                              <span className={"text-black mr-1"}>{commonText.displayPublic}</span>
                              <Switch
                                checked={isPublic}
                                onChange={checkSubscribe}
                                className={classNames(
                                  isPublic ? 'bg-[#f05011]' : 'bg-gray-200',
                                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
                                )}
                              >
                                <span className="sr-only">Use setting</span>
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    isPublic ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                  )}
                                />
                              </Switch>
                            </div>
                            :null
                        }

                      </div>
                      :
                      null
                  }
                  <div className="inset-x-px bottom-1 bg-white">
                    <div
                      className="flex justify-center items-center space-x-3 border-t border-gray-200 px-2 py-2">
                      <div className="pt-2 w-1/4">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center items-center rounded-md bg-[#ffa11b] px-3 py-2 text-xs md:text-lg font-semibold text-white shadow-sm hover:bg-[#f05011]"
                        >
                          {commonText.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className={"w-[90%] mx-auto mb-10 mt-8"}>
            <div className={"flex justify-center items-start"}>
              <h2 className="text-white text-3xl">{menuText.header2}</h2>
            </div>
            <div
              role="list"
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
          <div className="prose w-full max-w-2xl mx-auto mt-8 text-gray-300 div-markdown-color">
            <Markdown>
              {questionText.detailText}
            </Markdown>
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
