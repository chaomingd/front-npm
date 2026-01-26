import { useModel } from '@chaomingd/store';
import React from 'react';

function fetchApi(success: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve('success');
      } else {
        reject(new Error('fail'));
      }
    }, 1000);
  });
}

interface State {
  loading: boolean;
  result: string;
  error: Error | null;
}

interface Effects {
  fetch: () => void;
}
export default () => {
  const [tryCount, setTryCount] = React.useState(0);
  const model = useModel<State, Effects>({
    state: {
      loading: false,
      result: '',
      error: null,
    },
    effects: {
      fetch: async () => {
        model
          .asyncManager('fetch', {
            loadingKey: 'loading',
            errorKey: 'error',
            config: {
              retryCount: 3,
            },
          })
          .exec(async (abortController, tryCountData) => {
            setTryCount(tryCountData);
            const res = await fetchApi(tryCountData == 3);
            return {
              result: res,
            };
          });
      },
    },
  });
  const { loading, result } = model.useGetState();
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <button onClick={() => model.getEffect('fetch')()}>fetch</button>
      <div>loading: {loading ? 'loading' : 'loaded'}</div>
      <div>result: {result}</div>
      <div>tryCount: {tryCount}</div>
    </div>
  );
};
