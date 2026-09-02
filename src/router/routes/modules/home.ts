const homeRoute: AppRouteRecordRaw = {
  name: 'home',
  path: '/home',
  component: () => import('@/layouts/base-layout/index.vue'),
  redirect: { name: 'home_workbench' },
  meta: {
    title: 'home',
    i18nKey: 'route.home',
    icon: 'ant-design:home-outlined',
    order: 1,
    permissions: ['home:*']
  },
  children: [
    {
      name: 'home_workbench',
      path: '/home/workbench',
      component: () => import('@/views/home/workbench/index.vue'),
      meta: {
        title: 'home_workbench',
        i18nKey: 'route.home_workbench',
        order: 1,
        localIcon: 'workbench',
        permissions: ['home:workbench']
      }
    },
    {
      name: 'home_analytics',
      path: '/home/analytics',
      component: () => import('@/views/home/analysis/index.vue'),
      meta: {
        title: 'home_analytics',
        i18nKey: 'route.home_analytics',
        icon: 'ant-design:bar-chart-outlined',
        order: 1,
        permissions: ['home:analytics']
      }
    }
  ]
};

export default homeRoute;
