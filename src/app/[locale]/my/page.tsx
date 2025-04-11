import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getWorksText
} from "~/configs/languageText";

export default async function IndexPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const worksText = await getWorksText();

  return (
    <PageComponent
      locale={locale}
      worksText={worksText}
    />
  )


}
