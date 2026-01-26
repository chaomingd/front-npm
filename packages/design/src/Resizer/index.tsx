import { IConfig as IResizerConfig, useResizer } from '@chaomingd/hooks';
import classNames from 'classnames';
import { FC, HTMLAttributes, memo, MutableRefObject, useRef, useState } from 'react';
import './index.less';
import { CSS_PREFIX } from '../styles/var';

const preCls = `${CSS_PREFIX}-resizer`;

export interface ResizerProps extends HTMLAttributes<HTMLDivElement> {
  resizerConfig?: Omit<IResizerConfig, 'elRef'>;
  thumbClassName?: string;
  thumbStyle?: ResizerProps['style'];
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  manu?: boolean;
  thumbColor?: string;
  onResize?: (size: { width: number; height: number }) => void;
}

const Resizer: FC<ResizerProps> = ({
  children,
  resizerConfig,
  thumbClassName,
  style,
  thumbStyle,
  containerRef,
  className,
  manu,
  thumbColor,
  onResize,
  ...props
}) => {
  const thumbRef = useRef<any>();
  const elRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const direction = resizerConfig?.direction || 'left';
  useResizer({
    elRef: thumbRef,
    firstUpdate: true,
    ...(resizerConfig || {}),
    updator: (state) => {
      const el = elRef.current;
      if (!el) return;
      if (manu !== true) {
        if (direction === 'left' || direction === 'right') {
          el.style.width = state.deltaX + 'px';
        } else {
          el.style.height = state.deltaY + 'px';
        }
      }
      resizerConfig?.updator?.(state);
      onResize?.({
        width: state.deltaX,
        height: state.deltaY,
      });
    },
    resizingChange: setResizing,
  });

  return (
    <div
      {...props}
      ref={(el) => {
        elRef.current = el;
        if (containerRef) {
          containerRef.current = el;
        }
      }}
      style={{
        ...style,
        transition: resizing ? 'none' : undefined,
      }}
      className={classNames(preCls, className)}
    >
      <div
        ref={thumbRef}
        style={
          {
            ...(thumbStyle || {}),
            [`--${preCls}-thumb-color`]: thumbColor,
          } as React.CSSProperties
        }
        className={classNames(
          `${preCls}-thumb`,
          thumbClassName,
          resizing && `${preCls}-thumb-resizing`,
          `${preCls}-thumb-direction-${direction}`,
        )}
      ></div>
      {children}
    </div>
  );
};

export default memo(Resizer);
