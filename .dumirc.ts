import { defineConfig } from 'dumi';
import { readdirSync } from 'fs';
import { join } from 'path';
// utils must build before core
// runtime must build before renderer-react
const pkgList = readdirSync(join(__dirname, 'packages')).map((pkg) => {
  const packageJson = require(join(__dirname, 'packages', pkg, 'package.json'));

  return {
    name: packageJson.name,
    exports: packageJson.exports,
    path: join(__dirname, 'packages', pkg, 'src'),
  };
});
const alias = pkgList.reduce((pre, pkg) => {
  pre[pkg.name] = pkg.path;

  // has multiple entries
  if (pkg.exports?.['.']) {
    Object.keys(pkg.exports).forEach((key) => {
      pre[`${pkg.name}/${key}`] = join(pkg.path, key);
    });
  }

  return pre;
}, {} as Record<string, string>);
const isDev = process.env.NODE_ENV === 'development';

const publicPath = isDev ? '/' : '/front-npm/';
export default defineConfig({
  title: 'Ant Design Laf - A React components collection for Laf!',
  mfsu: false,
  base: publicPath,
  outputPath: 'docs-dist',
  publicPath,
  alias,
  resolve: {
    codeBlockMode: 'passive',
    atomDirs: [
      { type: 'component', dir: 'packages/design/src' },
      { type: 'hooks', dir: 'packages/hooks/src' },
      { type: 'store', dir: 'packages/store/src' },
      { type: 'utils', dir: 'packages/utils/src' },
    ],
  },
  themeConfig: {
    name: 'Ant Design Laf',
    nprogress: true,
    sidebarGroupModePath: [
      '/guide',
      '/components',
      '/hooks',
      '/charts',
      '/stores',
      '/utils',
      '/uis',
    ],
    localesEnhance: [
      { id: 'en-US', switchPrefix: '中' },
      { id: 'zh-CN', switchPrefix: 'en' },
    ],
    nav: {
      'en-US': [
        { title: 'Guide', link: '/guide/ant-design-laf' },
        { title: 'Components', link: '/components/ka-te-x-renderer' },
        { title: 'Hooks', link: '/hooks/use-latest-state' },
        { title: 'Editor', link: '/theme-editor-cn' },
        { title: 'Store', link: '/stores' },
        { title: 'Utils', link: '/utils/login-redirect' },
      ],
      'zh-CN': [
        { title: '指南', link: '/guide/ant-design-laf-cn' },
        { title: '业务组件', link: '/components/ka-te-x-renderer' },
        { title: 'Hooks', link: '/hooks/use-latest-state-cn' },
        { title: '主题编辑器', link: '/theme-editor-cn' },
        { title: 'Store', link: '/stores-cn' },
        { title: '工具', link: '/utils/login-redirect' },
      ],
    },
    footerLinks: {
      'en-US': [
        {
          title: 'Related Resources',
          items: [
            {
              title: 'Ant Design',
              description: 'Front-end component library',
              url: 'https://ant.design',
              openExternal: true,
            },
            {
              title: 'Umi',
              description: 'React framework',
              url: 'https://umijs.org',
              openExternal: true,
            },
            {
              title: 'Theme Editor',
              description: 'Customize theme',
              url: '/theme-editor',
              openExternal: true,
            },
          ],
        },
      ],
      'zh-CN': [
        {
          title: '相关资源',
          items: [
            {
              title: 'Ant Design',
              description: '前端组件库',
              url: 'https://ant.design',
              openExternal: true,
            },
            {
              title: 'Umi',
              description: 'React 应用开发框架',
              url: 'https://umijs.org',
              openExternal: true,
            },
            {
              title: '主题编辑器',
              description: '定制主题',
              url: '/theme-editor-cn',
              openExternal: true,
            },
          ],
        },
      ],
    },
  },
  // sidebarGroupModePath: ['/guide', '/components', '/hooks', '/charts'],
  locales: [
    {
      id: 'en-US',
      name: 'English',
      suffix: '',
    },
    {
      id: 'zh-CN',
      name: '中文',
      suffix: '-cn',
    },
  ],
});
