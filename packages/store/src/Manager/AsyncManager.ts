import { EventEmitter2 } from '@chaomingd/utils';

export interface AsyncManagerOptions {
  retryCount?: number;
  retryInterval?: number;
}
const DEFAULT_TIMEOUT = 300;
export class AsyncManager<
  T,
  Fn extends (
    aborts: {
      lastAbortController: AbortController | null;
      abortController: AbortController;
    },
    tryCount: number,
  ) => Promise<T>,
> extends EventEmitter2<{
  loading: (() => void)[];
  success: ((result: any) => void)[];
  error: ((error: Error) => void)[];
  finish: ((error: Error | null, result: any) => void)[];
}> {
  execId = 0;
  options: AsyncManagerOptions = {};
  abortSignalMap: Record<number, AbortController> = {};
  constructor(options?: AsyncManagerOptions) {
    super();
    if (options) {
      this.options = options;
    }
  }
  getCurrentExecId() {
    return this.execId;
  }
  getAbortController(execId: number) {
    return this.abortSignalMap[execId];
  }
  exec(fn: Fn): Promise<T> {
    let tryCount = 0;
    const execId = ++this.execId;
    this.emit('loading');
    return new Promise((resolve, reject) => {
      const _exec = () => {
        const lastAbortController = this.abortSignalMap[execId - 1] || null;
        lastAbortController?.abort();
        const abortController = (this.abortSignalMap[execId] = new AbortController());
        fn(
          {
            lastAbortController,
            abortController,
          },
          tryCount,
        )
          .then((res) => {
            if (execId === this.execId) {
              this.emit('success', res);
              this.emit('finish', null, res);
            }
            resolve(res);
            delete this.abortSignalMap[execId];
            return res;
          })
          .catch((e) => {
            if (execId === this.execId) {
              if (tryCount < (this.options.retryCount || 0)) {
                setTimeout(() => {
                  // 已被新的 exec 取代时不再重试，避免幽灵请求
                  if (execId === this.execId) {
                    _exec();
                  } else {
                    delete this.abortSignalMap[execId];
                    reject(e);
                  }
                }, this.options.retryInterval || DEFAULT_TIMEOUT);
              } else {
                this.emit('error', e);
                reject(e);
                delete this.abortSignalMap[execId];
                this.emit('finish', e, null);
              }
            } else {
              delete this.abortSignalMap[execId];
              reject(e);
            }
            tryCount++;
          });
      };
      _exec();
    });
  }
}
