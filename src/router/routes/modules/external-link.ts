const externalLinkRoute: AppRouteRecordRaw = {
  name: 'external-link',
  path: '/external-link',
  component: () => import('@/layouts/base-layout/index.vue'),
  redirect: { name: 'iframe_page' },
  meta: {
    title: 'external-link',
    i18nKey: 'route.external-link',
    icon: 'ant-design:link-outlined',
    order: 2,
    permissions: ['external-link:*']
  },
  children: [
    {
      name: 'external-link_github',
      path: '/external-link/github',
      // 👇 关键 1：使用内置 iframe 骨架组件作为占位
      component: () => import('@/views/iframe-page/[url].vue'),
      meta: {
        title: 'external-link_github',
        i18nKey: 'route.external-link_github',
        // 👇 关键 2：将完整的外部网址塞入 meta.href 属性
        href: 'https://github.com',
        icon: 'ant-design:github-outlined',
        // 👇 关键 3：独立配置该外链的菜单查看权限
        permissions: ['external-link:github']
      }
    },
    {
      name: 'external-link_vue',
      path: '/external-link/vue',
      // 👇 关键 1：使用内置 iframe 骨架组件作为占位
      component: () => import('@/views/iframe-page/[url].vue'),
      props: {
        url: 'https://www.baidu.com'
      },
      meta: {
        title: 'external-link_vue',
        i18nKey: 'route.external-link_vue',
        icon: 'ant-design:file-done-outlined',
        permissions: ['external-link:vue']
      }
    }
  ]
};

export default externalLinkRoute;
