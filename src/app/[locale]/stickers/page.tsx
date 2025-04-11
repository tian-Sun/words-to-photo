import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getExploreText,
} from "~/configs/languageText";
import {getPagination, getPublicResultList} from "~/servers/works";
import {getCountSticker} from "~/servers/keyValue";

export const revalidate = 300;

export default async function IndexPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const countSticker = await getCountSticker();

  const exploreText = await getExploreText(countSticker, 1);

  const resultInfoData = await getPublicResultList(locale, 1);
  const pageData = await getPagination(locale, 1);


  return (
    <PageComponent
      locale={locale}
      exploreText={exploreText}
      resultInfoData={resultInfoData}
      page={1}
      pageData={pageData}
    />
  )


}
