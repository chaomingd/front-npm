import {
  parseSearchParams,
  parseUrl,
  pathJoin,
  searchParamsToString,
} from '..';

export function loginRedirect(config: {
  homePath: string;
  access_token: string;
  token_type?: string;
  history: {
    push: (...args: any[]) => any;
    replace: (...args: any[]) => any;
  };
  replace?: boolean;
}) {
  const { homePath, access_token, token_type, history, replace } = config;
  const searchParams = parseSearchParams(window.location.search);
  const redirect = searchParams.redirect;
  const withToken = searchParams.with_token;
  const jump = (path: string) => {
    if (replace) {
      history.replace(path);
    } else {
      history.push(path);
    }
  };
  if (redirect) {
    const urlParseValues = parseUrl(redirect);
    if (
      !urlParseValues.host ||
      urlParseValues.host === window.location.host
    ) {
      jump(urlParseValues.fullpath);
    } else {
      const searchObject = urlParseValues.searchObject;
      if (withToken) {
        searchObject.access_token = access_token;
        searchObject.token_type = token_type;
      }
      const search =
        Object.keys(searchObject).length > 0
          ? '?' + searchParamsToString(searchObject)
          : '';
      const href =
        pathJoin(urlParseValues.origin, urlParseValues.pathname) + search;
      window.location.href = href.slice(1);
    }
  } else {
    jump(homePath);
  }
}
