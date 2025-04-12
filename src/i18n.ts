import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';

export default getRequestConfig(async () => {
  const headersList = headers();
  const locale = headersList.get('x-next-locale') || 'en';
  
  return {
    locale,
    messages: (
      await (locale === 'en'
        ? // When using Turbopack, this will enable HMR for `default`
        import('../messages/en.json')
        : import(`../messages/${locale}.json`))
    ).default
  };
});
