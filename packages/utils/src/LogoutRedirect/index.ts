import { parseUrl, pathJoin, searchParamsToString } from '..';

export interface LogoutRedirectProps {
  loginPath: string;
  withToken?: boolean;
  replace?: boolean;
  history?: {
    push: (...args: any[]) => any;
    replace: (...args: any[]) => any;
  };
}
export function logoutRedirect(config: LogoutRedirectProps) {
  const { loginPath, withToken, replace } = config;

  const jump = (path: string) => {
    if (replace) {
      if (config.history) {
        return config.history.replace(path);
      }
      history.replaceState(null, '', path);
    } else {
      if (config.history) {
        return config.history.push(path);
      }
      history.pushState(null, '', path);
    }
  };
  const loginUrlParseValues = parseUrl(loginPath);
  if (
    // @ts-ignore
    window.location.pathname.startsWith(pathJoin(loginUrlParseValues.pathname))
  ) {
    return;
  }
  const searchParams: Record<string, any> = {
    ...loginUrlParseValues.searchObject,
  };
  searchParams.redirect = window.location.href;
  if (withToken) {
    searchParams.with_token = 'true';
  }
  if (
    !loginUrlParseValues.host ||
    loginUrlParseValues.host === window.location.host
  ) {
    const loginUrlValues = parseUrl(loginPath);
    const searchObject = loginUrlValues.searchObject;
    jump(
      pathJoin(loginUrlValues.pathname) +
        '?' +
        searchParamsToString({ ...searchParams, ...searchObject }),
    );
  } else {
    const href =
      pathJoin(loginUrlParseValues.origin, loginUrlParseValues.pathname) +
      '?' +
      searchParamsToString(searchParams);
    window.location.href = href.slice(1);
  }
}

const logoutRedirectWithOriginalHistory = logoutRedirect;
export default logoutRedirectWithOriginalHistory;
