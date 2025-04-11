import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getTermsOfServiceText
} from "~/configs/languageText";

export default async function IndexPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const termsOfServiceText = await getTermsOfServiceText();


  return (
    <PageComponent
      locale={locale}
      termsOfServiceText={termsOfServiceText}
    />
  )


}
