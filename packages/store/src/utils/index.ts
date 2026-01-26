import type { TComputed, TWatch } from '../type';

interface IComputedConfig<TState extends Record<string, any>> {
  prevState: TState;
  nextState: TState;
  computed?: TComputed<TState>;
}

export function calcDiffKeys(
  obj1: object,
  obj2: object,
  keys: (string | number | symbol)[],
) {
  const diffKeysMap: Record<string | number | symbol, boolean> = {};
  let diff = false;
  keys.forEach((key) => {
    // @ts-ignore
    if (!Object.is(obj1[key], obj2[key])) {
      diffKeysMap[key] = true;
      diff = true;
    }
  });
  return {
    diffKeysMap,
    diff,
  };
}

export function calcComputedState<TState extends Record<string, any>>({
  prevState,
  nextState,
  computed,
}: IComputedConfig<TState>) {
  if (computed) {
    computed.reduce((currentNextState, computedItem) => {
      let partialState;
      if (typeof computedItem === 'function') {
        partialState = computedItem(currentNextState, prevState);
      } else {
        const { diffKeysMap, diff } = calcDiffKeys(
          prevState,
          currentNextState,
          computedItem.keys,
        );
        if (diff) {
          partialState = computedItem.hander(currentNextState, diffKeysMap, prevState);
        }
      }
      if (partialState) {
        Object.assign(currentNextState, partialState);
      }
      return currentNextState;
    }, nextState);
  }
  return nextState;
}


interface IWatchConfig<TState extends Record<string, any>> {
  prevState: TState;
  nextState: TState;
  watch?: TWatch<TState>;
}
export function execWatchHandler<TState extends Record<string, any>>({
  prevState,
  nextState,
  watch,
}: IWatchConfig<TState>) {
  if (watch) {
    watch.forEach((watchItem) => {
      if (watchItem.keys) {
        const { diffKeysMap, diff } = calcDiffKeys(
          prevState,
          nextState,
          watchItem.keys,
        );
        if (diff) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          watchItem.hander && watchItem.hander(nextState, diffKeysMap, prevState);
        }
      }
    });
  }
}
