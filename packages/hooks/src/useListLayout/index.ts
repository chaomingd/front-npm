import { useLatest, useUnmount } from 'ahooks';
import { useEffectWithTarget } from '../useEffectWithTarget';
import { MutableRefObject, useRef } from 'react';
import { listen, resizeObserver, px, getScrollBarSize, getScrollContainer } from '@chaomingd/utils';
import { useModel } from '@chaomingd/store';

let defaultTransform = px;
export function setDefaultTransform(transform: typeof px) {
  defaultTransform = transform;
}

export interface UseListLayoutConfig {
  containerRef?: MutableRefObject<HTMLElement | null>;
  baseWidth: number;
  baseHeight?: number;
  gap?: number | [number, number];
  onChange?: (state: IState) => any;
  removeScrollBarWidth?: boolean;
  pxTransform?: (base: number, width: number) => number;
}

function getCount(base: number, gap: number, length: number) {
  let count = Math.floor(length / base);
  while (count) {
    if (count * base + gap * (count - 1) <= length) break;
    count--;
  }
  return count;
}
interface IState {
  col: number;
  row: number;
  width: number;
  height: number;
}
const scrollBarSize = getScrollBarSize();
export function useListLayout(config: UseListLayoutConfig) {
  const configRef = useLatest(config);
  const timerRef = useRef<any>();
  const model = useModel<IState>({
    state: {
      col: 0,
      row: 0,
      width: 0,
      height: 0,
    },
  });
  const layoutState = model.useGetState();
  useEffectWithTarget(() => {
    let offResize: () => any;
    const pxTransform = (base: number, width: number) => {
      if (configRef.current?.pxTransform) {
        return configRef.current?.pxTransform(base, width);
      }
      return defaultTransform(base);
    };
    const onResize = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const { gap, baseHeight, baseWidth } = configRef.current || {};
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const config = configRef.current;
        let width: number;
        let height: number;
        if (config?.containerRef?.current) {
          const container = config.containerRef.current;
          const scrollContainer = getScrollContainer(config.containerRef.current);
          width = container.offsetWidth;
          height = container.offsetHeight;
          if (scrollContainer !== container && config.removeScrollBarWidth !== false) {
            width += scrollBarSize.width;
            height += scrollBarSize.height;
          }
        } else {
          width = window.innerWidth;
          height = window.innerHeight;
        }
        let colGap = 0;
        let rowGap = 0;
        if (gap) {
          if (Array.isArray(gap)) {
            colGap = pxTransform(gap[0], width);
            rowGap = pxTransform(gap[1], height);
          } else {
            colGap = rowGap = pxTransform(gap, width);
          }
        }
        const newState: Record<string, number> = {};
        const col =
          Math.abs(model.getState().width - width) === scrollBarSize.width
            ? model.getState().col
            : getCount(pxTransform(baseWidth || 0, width), colGap, width);
        newState.col = col;
        newState.row = 0;
        newState.width = width;
        newState.height = height;
        newState.windowWidth = window.innerWidth;
        newState.windowHeight = window.innerHeight;
        if (baseHeight) {
          const row =
            Math.abs(model.getState().height - height) === scrollBarSize.height
              ? model.getState().row
              : getCount(pxTransform(baseHeight, height), rowGap, height) + 1;
          newState.row = row;
        }
        const oldState = model.getState();
        if (newState.col === oldState.col && newState.row === oldState.row) return;
        model.setState(newState);
        configRef.current?.onChange?.(model.getState());
      }, 17);
    };
    onResize();
    if (config?.containerRef?.current) {
      offResize = resizeObserver({
        el: config.containerRef.current,
        onResize,
      });
    } else {
      offResize = listen(window, 'resize', onResize);
    }
    return () => {
      offResize();
    };
  }, config?.containerRef);
  useUnmount(() => {
    clearTimeout(timerRef.current);
  });
  return layoutState;
}
