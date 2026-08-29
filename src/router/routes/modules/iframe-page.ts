import type { RouteRecordRaw } from 'vue-router';

const iframePageRoute: RouteRecordRaw = {
  path: '/iframe-page/:url',
  component: () => import('@/layouts/base-layout/index.vue'),
  props: true,
  meta: {
    title: 'iframe-page',
    i18nKey: 'route.iframe-page',
    constant: true,
    hideInMenu: true,
    keepAlive: true
  },
  children: [
    {
      name: 'iframe-page',
      path: '',
      component: () => import('@/views/iframe-page/[url].vue'),
      meta: {
        title: 'iframe-page',
        i18nKey: 'route.iframe-page',
        constant: true,
        hideInMenu: true,
        keepAlive: true
      }
    }
  ]
};

export default iframePageRoute;
