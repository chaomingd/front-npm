import { ConfigProvider, message } from 'antd';
import { useTheme } from 'antd-style';
import {
  Previewer,
  parsePlainConfig,
  parseThemeConfig,
} from 'antd-token-previewer-laf';
import antdEnUS from 'antd/locale/en_US';
import antdZhCN from 'antd/locale/zh_CN';
import { useLocale } from 'dumi';
import React from 'react';

import { components, demos } from './demos';
import styles from './index.module.less';

const ANT_DESIGN_WEB3_CUSTOM_THEME = 'ant-design-web3-custom-theme';

const ThemeEditorPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const initialThemeConfigRef = React.useRef(
    parseThemeConfig(
      JSON.parse(localStorage.getItem(ANT_DESIGN_WEB3_CUSTOM_THEME) || '{}'),
    ),
  );
  const locale = useLocale();
  const token = useTheme();

  return (
    <React.StrictMode>
      {contextHolder}
      <div
        className={styles.container}
        style={{ height: `calc(100vh - ${token.headerHeight}px)` }}
      >
        <ConfigProvider
          locale={locale.id === 'zh-CN' ? antdZhCN : antdEnUS}
          theme={{ hashed: true }}
        >
          <Previewer
            showTheme
            initialThemeConfig={initialThemeConfigRef.current}
            components={components}
            demos={demos}
            onSave={(newConfig) => {
              localStorage.setItem(
                ANT_DESIGN_WEB3_CUSTOM_THEME,
                JSON.stringify(parsePlainConfig(newConfig)),
              );
              navigator.clipboard.writeText(JSON.stringify(newConfig, null, 2));
              messageApi.success('🎉 保存成功，可粘贴到项目中使用！');
            }}
          />
        </ConfigProvider>
      </div>
    </React.StrictMode>
  );
};

export default ThemeEditorPage;
