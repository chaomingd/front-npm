const httpReg =
  /^(https?):\/\/(?:(\w+(?:\.\w+)?):(\w+(?:\.\w+)?)@)?([^?#/]+)?(\/[^?#]+)?(\?[^#]+)?(#[\s\S]+)?/;

interface UrlParseValues {
  protocol: string;
  origin: string;
  hostname: string;
  host: string;
  pathname: string;
  search: string;
  searchObject: Record<string, any>;
  hash: string;
  user: string;
  password: string;
  port: number;
  fullpath: string;
}
const DefaultPort = {
  http: 80,
  https: 443,
};
export function parseUrl(url: string) {
  const res = httpReg.exec(url);
  const parseValues = {
    protocol: '',
    origin: '',
    hostname: '',
    host: '',
    pathname: '',
    search: '',
    searchObject: {},
    hash: '',
    user: '',
    password: '',
    port: 80,
  } as UrlParseValues;
  if (!res) {
    parseValues.fullpath = pathJoin(url);
    const v = parseValues.fullpath.split('?');
    parseValues.pathname = v[0];
    parseValues.search = v[1] ? '?' + v[1] : '';
    parseValues.searchObject = parseSearchParams(v[1]);
    return parseValues;
  }
  parseValues.protocol = res[1] || '';
  parseValues.user = decodeURIComponent(res[2] || '');
  parseValues.password = decodeURIComponent(res[3] || '');
  parseValues.host = res[4] || '';
  if (parseValues.host) {
    const hostArr = parseValues.host.split(':');
    parseValues.hostname = hostArr[0];
    parseValues.port =
      +hostArr[1] ||
      DefaultPort[parseValues.protocol as keyof typeof DefaultPort] ||
      80;
  }
  parseValues.origin = parseValues.protocol + '://' + parseValues.host;
  parseValues.pathname = decodeURIComponent(res[5] || '/');
  parseValues.search = res[6] || '';
  if (parseValues.search) {
    parseValues.searchObject = parseSearchParams(parseValues.search);
  }
  parseValues.hash = decodeURIComponent(res[7] || '');
  parseValues.fullpath = pathJoin(
    parseValues.pathname,
    parseValues.search,
    parseValues.hash,
  );
  return parseValues;
}

export function parseSearchParams(search: string) {
  if (!search) {
    return {};
  }
  let searchStr = search;
  if (search[0] === '?') {
    searchStr = search.slice(1);
  }
  const searchArr = searchStr.split('&');
  const searchParams: Record<string, any> = {};
  for (let i = 0; i < searchArr.length; i++) {
    const param = searchArr[i];
    if (param) {
      const paramArr = param.split('=');
      const name = decodeURIComponent(paramArr[0] || '');
      const value = decodeURIComponent(paramArr[1] || '');
      if (name in searchParams) {
        if (Array.isArray(searchParams[name])) {
          searchParams[name].push(value);
        } else {
          searchParams[name] = [searchParams[name], value];
        }
      } else {
        searchParams[name] = value;
      }
    }
  }
  return searchParams;
}

export function searchParamsToString(searchParams: Record<string, any>) {
  return Object.keys(searchParams)
    .map((key) => {
      return (
        encodeURIComponent(key) + '=' + encodeURIComponent(searchParams[key])
      );
    })
    .join('&');
}

export function pathJoin(...args: string[]) {
  const paths = [] as string[];
  // const paths = [];
  const argPaths = args.filter(Boolean);
  for (let i = 0; i < argPaths.length; i++) {
    let p = argPaths[i];
    if (p[0] === '/') {
      p = p.slice(1);
    }
    if (p[p.length - 1] === '/') {
      p = p.slice(0, p.length - 1);
    }
    paths.push(p);
  }
  return '/' + paths.join('/');
}
