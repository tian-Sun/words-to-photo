export const getLinkHref = (locale = 'en', page = '') => {
  if (page == '') {
    if (locale == 'en') {
      return '/';
    }
    return `/${locale}/`;
  }
  if (locale == 'en') {
    return `/${page}`;
  }
  return `/${locale}/${page}`;
}


export const getCompressionImageLink = (url) => {
  const beginUrl = process.env.NEXT_PUBLIC_STORAGE_URL + '/cdn-cgi/image/width=512,quality=85/';
  return beginUrl + url;
}


export const getArrayUrlResult = (origin) => {
  if (origin) {
    const jsonResult = JSON.parse(origin);
    if (jsonResult.length > 0) {
      return jsonResult;
    }
  }
  return []
}

export const getTotalLinkHref = (locale = 'en', page = '') => {
  if (page == '') {
    if (locale == 'en') {
      return process.env.NEXT_PUBLIC_SITE_URL + '/';
    }
    return process.env.NEXT_PUBLIC_SITE_URL + `/${locale}/`;
  }
  if (locale == 'en') {
    return process.env.NEXT_PUBLIC_SITE_URL + `/${page}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL + `/${locale}/${page}`;
}

export const getShareToPinterest = (locale = 'en', page = '', sticker:string) => {
  const pinterestUrl = 'https://pinterest.com/pin/create/button/';
  return pinterestUrl + `?description=${encodeURIComponent(sticker)}` + `&url=` + encodeURIComponent(getTotalLinkHref(locale, page));
}
