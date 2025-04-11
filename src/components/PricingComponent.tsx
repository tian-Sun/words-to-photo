import {getStripe} from '~/libs/stripeClient';
import React, {useState} from 'react';
import {useCommonContext} from "~/context/common-context";
import LoadingDots from "./LoadingDots";
import {priceList} from "~/configs/stripeConfig";

export default function Pricing({
                                  redirectUrl,
                                  isPricing = false
                                }) {
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const {
    setShowLoginModal,
    userData,
    pricingText
  } = useCommonContext();

  const handleCheckout = async (price) => {
    setPriceIdLoading(price.id);
    if (!userData || !userData.user_id) {
      setShowLoginModal(true);
      return
    }
    const user_id = userData.user_id;
    try {
      const data = {
        price,
        redirectUrl,
        user_id
      }
      const url = `/api/stripe/create-checkout-session`;
      const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });
      const res = await response.json();
      const sessionId = res.sessionId;
      const stripe = await getStripe();
      stripe?.redirectToCheckout({sessionId});
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  }

  if (!priceList?.length)
    return (
      <div className={(isPricing ? "" : "background-div") + " flex flex-col items-center"}>
        <div className="max-w-screen-lg grid place-items-center bg-slate-100 text-slate-600 p-4 gap-4">
          <div id="introduction" className="bg-white shadow-md rounded border-slate-200 p-5">
            <div className="text-slate-800 space-y-2 mb-0">
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className={(isPricing ? "" : "background-div") + " bg-cover bg-center bg-no-repeat text-white"}>
      <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-6 md:py-8">
        <div className="flex flex-col items-center justify-start">
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center">
            <h2 className="text-5xl font-bold">{pricingText.h1Text}</h2>
          </div>
          <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-3 md:gap-4 lg:gap-8">
            <div className="mx-auto flex w-full max-w-[416px] flex-col">
              <div className="flex w-full flex-col items-start rounded-xl bg-[#2b306b] p-10">
                <div className="mb-4 rounded-lg bg-[#0a2836] px-4 py-1.5">
                  <p
                    className="text-sm font-bold text-white">{pricingText.free}</p>
                </div>
                <h2 className="mt-8 mb-6 text-3xl font-bold md:mb-8 md:text-5xl lg:mb-12">{pricingText.free0}</h2>
                <div
                  className="w-full bg-[#2b306b] px-6 py-4 text-center font-semibold text-[#2b306b] cursor-pointer inline-flex justify-center items-center text-sm leading-6 shadow-sm"
                >
                  {pricingText.buyText}
                </div>
              </div>
              <div className="mt-10 flex flex-col items-start gap-5">
                <div className="flex flex-row items-start text-white">
                  <div className="mr-2 flex text-[#2d6ae0]">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                        fill="currentColor"></path>
                    </svg>
                  </div>
                  <p className="text-[#7c8aaa]">
                    <span className="font-bold text-white">{pricingText.freeIntro0}</span>
                  </p>
                </div>
                <div className="flex flex-row items-start text-white">
                  <div className="mr-2 flex text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32" viewBox="0 0 32 32"
                         strokeWidth="1.5"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-[#7c8aaa]">
                    <span className="font-bold text-white">{pricingText.freeIntro1}</span>
                  </p>
                </div>
                <div className="flex flex-row items-start text-white">
                  <div className="mr-2 flex text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32" viewBox="0 0 32 32"
                         strokeWidth="1.5"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"
                            fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-[#7c8aaa]">
                    <span className="font-bold text-white">{pricingText.freeIntro2}</span>
                  </p>
                </div>
                <div className="flex flex-row items-start text-white">
                  <div className="mr-2 flex text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32" viewBox="0 0 32 32"
                         strokeWidth="1.5"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"
                            fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-[#7c8aaa]">
                    <span className="font-bold text-white">{pricingText.subscriptionIntro4}</span>
                  </p>
                </div>
              </div>
            </div>
            {
              priceList?.map((price, index) => {
                if (!price) return null;
                const priceString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency!,
                  minimumFractionDigits: 0
                }).format((price?.unit_amount || 0) / 100);


                const perDownloadPrice = (price?.unit_amount || 0) / 100 / 12;
                const pricePerString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency!,
                  minimumFractionDigits: 0
                }).format(perDownloadPrice);

                if (index != 0) {
                  return (
                    <div key={price.id} className="mx-auto flex w-full max-w-[416px] flex-col">
                      <div className="flex w-full flex-col items-start rounded-xl bg-[#2b306b] p-10">
                        <div className="mb-4 rounded-lg bg-[#0a1836] px-4 py-1.5">
                          <p
                            className="text-sm font-bold text-white">{pricingText.basic}</p>
                        </div>
                        <h2
                          className="mb-5 text-2xl font-bold md:mb-6 md:text-4xl lg:mb-8">{priceString}/{pricingText.monthText}</h2>
                        <h2
                          className="mb-2 text-lg font-bold md:mb-3 md:text-xl lg:mb-4">{priceString} {pricingText.monthlyText}</h2>
                        <a
                          type="button"
                          className="w-full rounded-full bg-[#f05011] px-6 py-4 text-center font-bold text-white cursor-pointer inline-flex justify-center items-center text-sm leading-6 shadow-sm"
                          onClick={() => handleCheckout(price)}
                        >
                          {pricingText.buyText}
                          {priceIdLoading && priceIdLoading == price.id && (
                            <i className="flex pl-2 m-0">
                              <LoadingDots/>
                            </i>
                          )}
                        </a>
                      </div>
                      <div className="mt-10 flex flex-col items-start gap-5">
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro0}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro1}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro2}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro4}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={pricePerString} className="mx-auto flex w-full max-w-[416px] flex-col">
                      <div
                        className="flex flex-col items-start rounded-xl bg-[#2d6ae0] bg-cover bg-center bg-no-repeat p-10 text-white"
                        style={{backgroundImage: 'https://assets.website-files.com/6502af467b2a8c4ee8159a5b/6502af467b2a8c4ee8159a8b_Mask%20group.svg'}}>
                        <div className="mb-4 flex flex-row flex-wrap gap-4">
                          <div className="flex items-center gap-1.5 rounded-lg bg-[#ffa11b] px-4 py-1.5 text-white">
                            <div className="flex">
                              <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M15.2528 4.59353C15.1098 4.47414 14.9361 4.39736 14.7515 4.37194C14.567 4.34652 14.379 4.37349 14.2091 4.44977L11.0466 5.85602L9.20905 2.54353C9.12123 2.38887 8.99398 2.26026 8.84028 2.17079C8.68657 2.08132 8.5119 2.03418 8.33405 2.03418C8.1562 2.03418 7.98153 2.08132 7.82783 2.17079C7.67412 2.26026 7.54688 2.38887 7.45905 2.54353L5.62155 5.85602L2.45905 4.44977C2.28874 4.37361 2.10052 4.3466 1.91567 4.37181C1.73081 4.39701 1.5567 4.47343 1.413 4.59242C1.2693 4.71141 1.16176 4.86822 1.10252 5.04513C1.04329 5.22205 1.03473 5.412 1.0778 5.59353L2.6653 12.3623C2.69566 12.4933 2.7523 12.6168 2.8318 12.7253C2.9113 12.8338 3.012 12.9251 3.1278 12.9935C3.28458 13.0874 3.46383 13.137 3.64655 13.1373C3.73537 13.1371 3.82373 13.1245 3.90905 13.0998C6.80269 12.2998 9.85916 12.2998 12.7528 13.0998C13.017 13.1692 13.298 13.131 13.5341 12.9935C13.6506 12.926 13.7518 12.835 13.8314 12.7263C13.911 12.6177 13.9672 12.4937 13.9966 12.3623L15.5903 5.59353C15.6329 5.41195 15.6239 5.22208 15.5642 5.04537C15.5046 4.86866 15.3967 4.71215 15.2528 4.59353V4.59353Z"
                                  fill="currentColor"></path>
                              </svg>
                            </div>
                            <p className="text-sm font-bold text-white">{pricingText.popularText}</p>
                          </div>
                        </div>
                        <h2
                          className="mb-2 text-2xl font-bold md:mb-3 md:text-4xl lg:mb-6">{pricePerString}/{pricingText.monthText}</h2>
                        <h2
                          className="mb-2 text-lg font-bold md:mb-3 md:text-xl lg:mb-6">{priceString} {pricingText.annuallyText} {pricingText.annuallySaveText}</h2>
                        <a
                          type="button"
                          className="w-full rounded-full bg-[#f05011] px-6 py-4 text-center font-bold text-white cursor-pointer inline-flex justify-center items-center text-sm leading-6 shadow-sm"
                          onClick={() => handleCheckout(price)}
                        >
                          {pricingText.buyText}
                          {priceIdLoading && priceIdLoading == price.id && (
                            <i className="flex pl-2 m-0">
                              <LoadingDots/>
                            </i>
                          )}
                        </a>
                      </div>
                      <div className="mt-10 flex flex-col items-start gap-5">
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro0}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro1}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro2}</span>
                          </p>
                        </div>
                        <div className="flex flex-row items-start text-white">
                          <div className="mr-2 flex text-[#2d6ae0]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"
                                fill="currentColor"></path>
                            </svg>
                          </div>
                          <p className="text-[#7c8aaa]">
                            <span className="font-bold text-white">{pricingText.subscriptionIntro4}</span>
                          </p>
                        </div>
                        {/*<div className="flex flex-row items-start text-white">*/}
                        {/*  <div className="mr-2 flex text-[#2d6ae0]">*/}
                        {/*    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg">*/}
                        {/*      <path*/}
                        {/*        d="M8.82291 15.198C8.47774 15.199 8.1399 15.3027 7.84846 15.4969C7.55703 15.6911 7.32392 15.968 7.1761 16.2955C7.02829 16.623 6.9718 16.9878 7.01319 17.3476C7.05457 17.7074 7.19213 18.0476 7.40995 18.3287L12.0534 24.3014C12.219 24.5172 12.4312 24.6885 12.6725 24.8009C12.9137 24.9134 13.177 24.9638 13.4406 24.9479C14.0042 24.9161 14.513 24.5995 14.8375 24.079L24.4831 7.76799C24.4847 7.76528 24.4863 7.76257 24.488 7.75991C24.5785 7.614 24.5492 7.32485 24.3624 7.1432C24.3111 7.09331 24.2506 7.05499 24.1846 7.03058C24.1186 7.00618 24.0486 6.99621 23.9789 7.00129C23.9091 7.00637 23.8411 7.02639 23.7789 7.06013C23.7168 7.09386 23.662 7.14059 23.6177 7.19743C23.6142 7.2019 23.6107 7.2063 23.607 7.21064L13.8792 18.7511C13.8422 18.795 13.7973 18.8308 13.747 18.8563C13.6967 18.8818 13.6421 18.8966 13.5863 18.8998C13.5305 18.9029 13.4747 18.8944 13.4221 18.8747C13.3695 18.8551 13.3211 18.8246 13.2798 18.7852L10.0513 15.7003C9.71603 15.3776 9.27778 15.1984 8.82291 15.198Z"*/}
                        {/*        fill="currentColor"></path>*/}
                        {/*    </svg>*/}
                        {/*  </div>*/}
                        {/*  <p className="text-[#7c8aaa]">*/}
                        {/*    <span className="font-bold text-white">{pricingText.subscriptionIntro3}</span>*/}
                        {/*  </p>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  )
                }
              })
            }
          </div>
        </div>
      </div>
    </section>
  );


}
