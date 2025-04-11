import Link from "next/link";
import {getLinkHref} from "~/configs/buildLink";
import {useCommonContext} from "~/context/common-context";
import {GoogleAnalytics} from "@next/third-parties/google";

export default function Footer({
                                 locale,
                                 page,
                               }) {
  const {
    userData,
    setShowLoadingModal,
    commonText,
    menuText,
  } = useCommonContext();

  const manageSubscribe = async () => {
    if (!userData?.user_id) {
      return
    }
    const user_id = userData?.user_id;
    const requestData = {
      user_id: user_id
    }
    setShowLoadingModal(true);
    const responseData = await fetch(`/api/stripe/create-portal-link`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    const result = await responseData.json();
    setShowLoadingModal(false);
    if (result.url) {
      window.location.href = result.url;
    }
  }

  const checkPageAndLoading = (toPage) => {
    if (page != toPage) {
      setShowLoadingModal(true);
    }
  }

  return (
    <footer aria-labelledby="footer-heading">
      <div id="footer-heading" className="sr-only">
        Footer
      </div>
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link
              href={getLinkHref(locale, '')}
            >
              <img
                className="h-10"
                src="/website.svg"
                alt={process.env.NEXT_PUBLIC_DOMAIN_NAME}
              />
            </Link>
            <p className="text-sm text-gray-300">
              {commonText.footerDescText}
            </p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <div className="text-sm font-semibold leading-6 text-white"></div>
                <ul role="list" className="mt-6 space-y-4">

                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <div className="text-sm font-semibold leading-6 text-white"></div>
                <ul role="list" className="mt-6 space-y-4">
                  <a
                    className="text-sm leading-6 footer-link text-white"
                    target={"_blank"}
                    href={"https://sticker.show/"}
                    title={"Free Online AI Sticker Maker & Generator!"}
                  >
                    Source by Sticker.Show
                  </a>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <div
                  className="text-sm font-semibold leading-6 text-white">
                  {process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME == '0' ? '' : menuText.footerSupport}
                </div>
                <ul role="list" className="mt-6 space-y-4">
                  {
                    process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' ?
                      <li>
                        <Link
                          href={getLinkHref(locale, 'pricing')}
                          className="text-sm leading-6 text-gray-300 hover:text-[#2d6ae0]"
                          onClick={()=>checkPageAndLoading('pricing')}
                        >
                          {menuText.footerSupport0}
                        </Link>
                      </li>
                      :
                      null
                  }
                  {
                    userData && process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' ?
                      <li>
                        <a
                          onClick={() => manageSubscribe()}
                          className="cursor-pointer text-sm leading-6 text-gray-300 hover:text-[#2d6ae0]">
                          {menuText.footerSupport1}
                        </a>
                      </li>
                      :
                      null
                  }
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <div className="text-sm font-semibold leading-6 text-white">{menuText.footerLegal}</div>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link
                      href={getLinkHref(locale, 'privacy-policy')}
                      className="text-sm leading-6 text-gray-300 hover:text-[#2d6ae0]"
                      onClick={()=>checkPageAndLoading('privacy-policy')}
                    >
                      {menuText.footerLegal0}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLinkHref(locale, 'terms-of-service')}
                      className="text-sm leading-6 text-gray-300 hover:text-[#2d6ae0]"
                      onClick={()=>checkPageAndLoading('terms-of-service')}
                    >
                      {menuText.footerLegal1}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {
          process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?
            <>
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}/>
            </>
            :
            null
        }
      </>
    </footer>
  )
}
