// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Liangs Tech',
  tagline: '个人技术博客',
  favicon: 'img/favicon.ico',

  // 修改为您的网站URL
  url: 'https://your-domain.com',
  // 如果部署在GitHub Pages的项目下，需要修改为 '/<repository-name>/'
  baseUrl: '/',

  // 修改为您的GitHub用户名和仓库名
  organizationName: 'RCliang', 
  projectName: 'Personal-Blog',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // 如果是中文博客，建议修改语言配置
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/your-username/your-repo/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Liangs',
        logo: {
          alt: '网站Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            href: 'https://github.com/RCliang',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '开始',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社交媒体',
            items: [
              {
                label: '掘金',
                href: 'https://juejin.cn/user/2214844889312699',
              },
              {
                label: '知乎',
                href: 'https://www.zhihu.com/people/ricodong',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/RCliang',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Liang. 基于 Docusaurus 构建.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

