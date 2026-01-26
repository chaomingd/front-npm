import { listen } from '@chaomingd/utils';
import { pick } from '@chaomingd/utils';
import { requestAnimationFrameThrottle } from '@chaomingd/utils';
import { useCreation, useUpdate } from 'ahooks';
import { MutableRefObject, useRef } from 'react';
import { useEffectWithTarget } from '../useEffectWithTarget';

class ResizerStore {
  state: IResizeStoreState = {
    deltaX: 0,
    deltaY: 0,
    resizing: false,
  };
  constructor(public updator: (state: IResizeStoreState) => void, baseDelta?: IResizerStoreConfig) {
    if (baseDelta) {
      this.state.deltaX = baseDelta.baseDeltaX || 0;
      this.state.deltaY = baseDelta.baseDeltaY || 0;
    }
  }
  setState(state: Partial<IResizeStoreState>) {
    this.state = { ...this.state, ...state };
    this.updator(this.state);
  }
}

type TMinMaxDelta = Pick<IConfig, 'minDeltaX' | 'maxDeltaX' | 'minDeltaY' | 'maxDeltaY'>;
export interface IConfig {
  firstUpdate?: boolean;
  baseDeltaX?: number;
  baseDeltaY?: number;
  minDeltaX?: number;
  maxDeltaX?: number;
  minDeltaY?: number;
  maxDeltaY?: number;
  getMinMaxDelta?: (state: IResizeStoreState) => Partial<TMinMaxDelta>;
  direction?: 'left' | 'top' | 'right' | 'bottom';
  elRef: MutableRefObject<HTMLElement | null>;
  resizerStore?: ReturnType<typeof useResizerStore>;
  updator?: (state: IResizeStoreState) => any;
  resizingChange?: (resizing: boolean) => void;
}
interface IClientRect {
  clientX: number;
  clientY: number;
}
interface IDeltaRect {
  deltaX: number;
  deltaY: number;
}
function getMinOrMaxDelta(config: IConfig, state: IResizeStoreState) {
  const delta: Partial<TMinMaxDelta> = { ...config };
  if (config.getMinMaxDelta) {
    Object.assign(delta, config.getMinMaxDelta(state) || {});
  }
  return delta;
}
function strictDelta(delta: Partial<IDeltaRect>, minMaxDelta: Partial<TMinMaxDelta>) {
  if (minMaxDelta.maxDeltaX !== undefined) {
    if (delta.deltaX !== undefined) {
      delta.deltaX = Math.min(delta.deltaX, minMaxDelta.maxDeltaX);
    }
  }
  if (minMaxDelta.maxDeltaY !== undefined) {
    if (delta.deltaY !== undefined) {
      delta.deltaY = Math.min(delta.deltaY, minMaxDelta.maxDeltaY);
    }
  }
  if (minMaxDelta.minDeltaX !== undefined) {
    if (delta.deltaX !== undefined) {
      delta.deltaX = Math.max(delta.deltaX, minMaxDelta.minDeltaX);
    }
  }
  if (minMaxDelta.minDeltaY !== undefined) {
    if (delta.deltaY !== undefined) {
      delta.deltaY = Math.max(delta.deltaY, minMaxDelta.minDeltaY);
    }
  }
  return delta;
}
export function useResizer(config: IConfig) {
  const { baseDeltaX = 0, baseDeltaY = 0, direction, resizerStore, elRef } = config;

  const updator = useUpdate();
  const innerResizerStore = useCreation(() => {
    return resizerStore || new ResizerStore(config.updator || updator, config);
  }, []);
  innerResizerStore.updator = config.updator || updator;
  const configRef = useRef(config);
  configRef.current = config;
  const mousedownClientRef = useRef<IClientRect>({
    clientX: 0,
    clientY: 0,
  });
  const deltaRef = useRef<IDeltaRect>({
    deltaX: baseDeltaX,
    deltaY: baseDeltaY,
  });
  useEffectWithTarget(
    () => {
      let offMouseDown: () => any;
      let cancelThrottleFunc: () => any | null;
      if (elRef.current) {
        offMouseDown = listen(elRef.current, 'mousedown', (e) => {
          cancelThrottleFunc = handlerResizerMouseDown({
            e,
            mousedownClientRef,
            store: innerResizerStore,
            deltaRef,
            configRef,
          });
        });
      }
      // 第一次调用
      if (configRef.current.firstUpdate) {
        innerResizerStore.setState({});
      }
      return () => {
        offMouseDown && offMouseDown();
        cancelThrottleFunc && cancelThrottleFunc();
      };
    },
    elRef,
    [baseDeltaX, baseDeltaY, innerResizerStore, direction, resizerStore],
    true,
  );
  return resizerStore || innerResizerStore;
}

function handlerResizerMouseDown({ e, configRef, mousedownClientRef, store, deltaRef }: any) {
  mousedownClientRef.current = pick(e, ['clientX', 'clientY']);
  const deltaX = store.state.deltaX;
  const deltaY = store.state.deltaY;
  const direction = configRef.current.direction || 'left';
  const isHorizantal = direction === 'left' || direction === 'right';
  const dir = ['left', 'top'].indexOf(direction) !== -1 ? -1 : 1;
  store.setState({
    resizing: true,
  });
  const minMaxDelta = getMinOrMaxDelta(configRef.current, store.state);

  configRef.current.resizingChange?.(store.state.resizing);
  const throttleMouseMoveRes = requestAnimationFrameThrottle({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    service: (e: MouseEvent) => {
      e.preventDefault();
      if (isHorizantal) {
        deltaRef.current.deltaX = e.clientX - mousedownClientRef.current.clientX;
      } else {
        deltaRef.current.deltaY = e.clientY - mousedownClientRef.current.clientY;
      }
      const newDelta = strictDelta(
        isHorizantal
          ? {
              deltaX: deltaX + deltaRef.current.deltaX * dir,
            }
          : {
              deltaY: deltaY + deltaRef.current.deltaY * dir,
            },
        minMaxDelta,
      );
      store.setState(newDelta);
    },
  });
  const cancelThrottleFunc = throttleMouseMoveRes.cancel;
  const offMouseMove = listen(document, 'mousemove', throttleMouseMoveRes.run);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const offMouseUp = listen(document, 'mouseup', (e) => {
    e.preventDefault();
    offMouseMove();
    offMouseUp();
    store.setState({
      resizing: false,
    });
    configRef.current.resizingChange?.(store.state.resizing);
  });
  return cancelThrottleFunc;
}

export interface IResizeStoreState extends IDeltaRect {
  resizing: boolean;
}

export interface IResizerStoreConfig {
  baseDeltaX?: number;
  baseDeltaY?: number;
}
export function useResizerStore(baseDelta: IResizerStoreConfig) {
  const updator = useUpdate();
  const resizerStore = useCreation(() => {
    return new ResizerStore(updator, baseDelta);
  }, []);
  return resizerStore;
}
