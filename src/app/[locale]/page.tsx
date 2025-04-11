import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getIndexPageText,
  getQuestionText
} from "~/configs/languageText";
import {getLatestPublicResultList} from "~/servers/works";

export const revalidate = 120;
export default async function IndexPage({params: {locale = ''}, searchParams: searchParams}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const indexText = await getIndexPageText();
  const questionText = await getQuestionText();

  const resultInfoListInit = await getLatestPublicResultList(locale, 1);

  return (
    <PageComponent
      locale={locale}
      indexText={indexText}
      questionText={questionText}
      resultInfoListInit={resultInfoListInit}
      searchParams={searchParams}
    />
  )


}
