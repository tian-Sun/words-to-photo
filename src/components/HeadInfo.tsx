import {languages} from "~/config";

const HeadInfo = ({
                    locale,
                    page,
                    title,
                    description,
                  }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description}/>
      {
        languages.map((item) => {
          const currentPage = page;
          let hrefLang = item.code;
          if (item.lang == 'en') {
            hrefLang = 'x-default';
          }
          let href: string;
          if (currentPage) {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}/${currentPage}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
            }
          } else {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
            }
          }
          return <link key={href} rel="alternate" hrefLang={hrefLang} href={href}/>
        })
      }
      {
        languages.map((item) => {
          const currentPage = page;
          let hrefLang = item.code;
          let href: string;
          if (currentPage) {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}/${currentPage}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
            }
          } else {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
            }
          }
          if (locale == item.lang) {
            return <link key={href + 'canonical'} rel="canonical" hrefLang={hrefLang} href={href}/>
          }
        })
      }
    </>
  )
}

export default HeadInfo
