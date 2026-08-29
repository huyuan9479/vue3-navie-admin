import type { RouteRecordRaw } from 'vue-router';

const homeRoute: RouteRecordRaw = {
  path: '/home',
  component: () => import('@/layouts/base-layout/index.vue'),
  meta: {
    title: 'home',
    i18nKey: 'route.home',
    icon: 'ant-design:home-outlined',
    order: 1
  },
  children: [
    {
      name: 'home',
      path: '',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: 'home',
        i18nKey: 'route.home',
        icon: 'ant-design:history-outlined',
        order: 1
      }
    }
  ]
};

export default homeRoute;
