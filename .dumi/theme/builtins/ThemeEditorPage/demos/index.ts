import {
  ComponentDemo,
  defaultAntdComponents,
} from 'antd-token-previewer-laf';

import * as button from './button';
export const components: typeof defaultAntdComponents = {
  ...button.components,
};

export const demos: Record<string, ComponentDemo[]> = {
  ...button.demos,
};
