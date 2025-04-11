import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getExploreText,
} from "~/configs/languageText";
import {getPagination, getPublicResultList} from "~/servers/works";
import {notFound} from "next/navigation";
import {getCountSticker} from "~/servers/keyValue";

export const revalidate = 300;
export const dynamic = "force-static";

export default async function IndexPage({params: {locale = '', page = 2}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const countSticker = await getCountSticker();

  if (page == 0) {
    page = 1;
  }
  const exploreText = await getExploreText(countSticker, page);

  const resultInfoData = await getPublicResultList(locale, page);
  const pageData = await getPagination(locale, page);

  if (page > pageData.totalPage) {
    notFound();
  }

  return (
    <PageComponent
      locale={locale}
      exploreText={exploreText}
      resultInfoData={resultInfoData}
      page={page}
      pageData={pageData}
    />
  )


}
