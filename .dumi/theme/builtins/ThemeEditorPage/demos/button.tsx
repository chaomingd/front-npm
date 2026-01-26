import type { ComponentDemo } from 'antd-token-previewer-laf';
import React from 'react';
import {Button} from 'antd'

export const components: Record<string, string[]> = {
  Address: ['Basic Address', 'Copyable', 'Custom Tooltip', 'Format'],
};

export const demos: Record<string, ComponentDemo[]> = {
  'Basic Button': [
    {
      demo: Button,
      tokens: [],
      key: 'Basic Button',
    },
  ],
};
