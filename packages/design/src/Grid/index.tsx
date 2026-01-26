import classNames from 'classnames';
import React, { HTMLAttributes, createContext, forwardRef, useContext } from 'react';
import './index.less';
import { CSS_PREFIX } from '../styles/var';
import { pxtorem } from '@chaomingd/utils';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number | [number, number];
  col: number;
  pxTransform?: (n: number) => string;
}

const GridContext = createContext<GridProps>({} as GridProps);

function toMarginPadding(gap: number | [number, number] | undefined, type: 'padding' | 'margin', pxTransform: (n: number) => string | undefined) {
  if (!gap) return undefined;
  let gaps: [number, number];
  if (Array.isArray(gap)) {
    gaps = gap;
  } else {
    gaps = [gap, gap];
  }
  if (type === 'margin') {
    return `${pxTransform(-gaps[0] / 2)} ${pxTransform(-gaps[1] / 2)}`;
  }
  return `${pxTransform(gaps[0] / 2)} ${pxTransform(gaps[1] / 2)}`;
}

const Grid = forwardRef<HTMLDivElement | null, GridProps>((props, ref) => {
  const { className, children, gap, pxTransform, col } = props;
  if (!col) return null;
  return (
    <GridContext.Provider value={props}>
      <div ref={ref} className={classNames(className, `${CSS_PREFIX}-grid`)}>
        <div
          style={{
            margin: toMarginPadding(gap, 'margin', pxTransform || pxtorem)
          }}
          className={`${CSS_PREFIX}-grid-wrapper`}
        >
          {children}
        </div>
      </div>
    </GridContext.Provider>
  );
});

// export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {}

const GridItem = ({ className, children }: HTMLAttributes<HTMLDivElement>) => {
  const gridProps = useContext(GridContext);
  const { gap, col, pxTransform } = gridProps;
  return (
    <div
      style={{
        padding: toMarginPadding(gap, 'padding', pxTransform || pxtorem),
        width: `${100 / col}%`
      }}
      className={classNames(className, `${CSS_PREFIX}-grid-item`)}
    >
      {children}
    </div>
  );
};

type GridType = typeof Grid;

interface IGrid extends GridType {
  Item: typeof GridItem;
}

const GridCom = Grid as IGrid;

GridCom.Item = GridItem;
export default GridCom;
