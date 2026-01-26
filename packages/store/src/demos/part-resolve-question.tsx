import { useModel } from '@chaomingd/store';
import { useDebounceFn } from 'ahooks';
import { useEffect } from 'react';

function searchApi(keyword: string, abortController?: AbortController): Promise<string> {
  let timer: any = 0;
  if (abortController) {
    abortController.signal.onabort = () => {
      clearTimeout(timer);
    }
  }
  return new Promise((resolve) => {
    timer = setTimeout(() => {
      resolve(`result for ${keyword}`);
    }, Math.random() > 0.5 ? 1000 : 3000);
  })
}


interface SearchState {
  keyword: string;
  result: string;
  loading: boolean;
}

interface SearchEffects {
  handleSearch: (keyword: string) => void;
}
export default function () {
  const model = useModel<SearchState, SearchEffects>({
    state: {
      keyword: '',
      result: '',
      loading: false,
    },
    effects: {
      handleSearch: async (keyword: string) => {
        model
          .asyncManager('fetchSearch', {
            loadingKey: 'loading',
          })
          .exec(async ({ lastAbortController, abortController }) => {
            if (lastAbortController) {
              // 取消上一次请求
              console.log('abort last request')
              lastAbortController.abort();
            }
            const res = await searchApi(keyword, abortController);
            return {
              result: res,
            };
          }).catch(() => {});
      },
    },
  });
  const { keyword, result, loading } = model.useGetState();

  const { run: handleSearch } = useDebounceFn(
    async (kw: string) => {
      return model.getEffect('handleSearch')(kw);
    },
    {
      wait: 300,
    },
  );

  useEffect(() => {
    if (keyword) {
      handleSearch(keyword);
    }
  }, [keyword]);

  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <input
        value={keyword}
        onChange={(e) =>
          model.setState({
            keyword: e.target.value,
          })
        }
      />
      <div>{loading ? 'loading...' : result}</div>
    </div>
  );
}
