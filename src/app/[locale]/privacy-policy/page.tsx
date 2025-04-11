import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';

import {
  getPrivacyPolicyText
} from "~/configs/languageText";

export default async function IndexPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const privacyPolicyText = await getPrivacyPolicyText();


  return (
    <PageComponent
      locale={locale}
      privacyPolicyText={privacyPolicyText}
    />
  )


}
