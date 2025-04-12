import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en' as const;
export const localePrefix = 'always';

export const languages = [
  {
    code: "en-US",
    lang: "en",
    language: "English",
  },
  {
    code: "zh-CN",
    lang: "zh",
    language: "简体中文",
  },
]

export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/blog': '/blog',
  '/blog/[uid]': '/blog/[uid]',
  '/contact': '/contact',
  '/faq': '/faq',
  '/privacy': '/privacy',
  '/terms': '/terms',
  '/tattoo': '/tattoo',
  '/tattoo/[uid]': '/tattoo/[uid]',
  '/stickers': '/stickers',
  '/stickers/[uid]': '/stickers/[uid]'
} as const;

export type Pathnames = keyof typeof pathnames;

export const getLanguageByLang = (lang) => {
  for (let i = 0; i < languages.length; i++) {
    if (lang == languages[i].lang) {
      return languages[i];
    }
  }
}
