import { describe, expect, it, vi } from 'vitest';
import { Model } from '../src';
import { AsyncManager } from '../src/Manager/AsyncManager';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('AsyncManager 快速多次调用', () => {
  it('被取代的 exec 不再发起幽灵重试', async () => {
    const manager = new AsyncManager<any, any>({
      retryCount: 3,
      retryInterval: 20,
    });
    const fn1 = vi.fn(() => Promise.reject(new Error('fail')));
    manager.exec(fn1).catch(() => {});
    await manager.exec(() => Promise.resolve('ok')); // 取代 fn1
    await delay(60); // 重试定时器早已到期
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it('旧请求的结果不会覆盖新请求的状态', async () => {
    const model = new Model<{ loading: boolean; result: string }>({
      state: { loading: false, result: '' },
    });
    const run = (ms: number, result: string) =>
      model
        .asyncManager('search')
        .exec(async () => {
          await delay(ms);
          return { result };
        })
        .catch(() => {});
    await Promise.all([run(60, 'old'), run(10, 'new')]);
    expect(model.getState().result).toBe('new');
    expect(model.getState().loading).toBe(false);
  });

  it('重复调用 asyncManager 不清除外部注册的 finish 监听', async () => {
    const model = new Model<{ loading: boolean }>({ state: { loading: false } });
    model.asyncManager('fetch');
    const onFinish = vi.fn();
    model.asyncManagerMap.fetch.on('finish', onFinish);
    model.asyncManager('fetch'); // 模拟 effect 快速重复触发
    await model.asyncManager('fetch').exec(async () => 'res');
    expect(onFinish).toHaveBeenCalledWith(null, 'res');
  });

  it('后续调用传入的 config 会被应用', async () => {
    const model = new Model<{ loading: boolean }>({ state: { loading: false } });
    model.asyncManager('fetch'); // 首次不带 config
    model.asyncManager('fetch', {
      config: { retryCount: 2, retryInterval: 5 },
    });
    const fn = vi.fn(() => Promise.reject(new Error('fail')));
    await expect(model.asyncManager('fetch').exec(fn)).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(3); // 首次 + 2 次重试
  });
});
