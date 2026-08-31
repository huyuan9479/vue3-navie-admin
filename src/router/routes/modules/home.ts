const homeRoute: AppRouteRecordRaw = {
  name: 'home',
  path: '/home',
  component: () => import('@/layouts/base-layout/index.vue'),
  redirect: { name: 'home_workbench' },
  meta: {
    title: 'home',
    i18nKey: 'route.home',
    icon: 'mdi-light:home',
    order: 1,
    permissions: ['home:*']
  },
  children: [
    {
      name: 'home_workbench',
      path: '/home/workbench',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: 'home_workbench',
        i18nKey: 'route.home_workbench',
        icon: 'mdi:home-outline',
        order: 1,
        permissions: ['home:workbench']
      }
    },
    {
      name: 'home_analytics',
      path: '/home/analytics',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: 'home_analytics',
        i18nKey: 'route.home_analytics',
        icon: 'mdi:home-outline',
        order: 1,
        permissions: ['home:analytics']
      }
    }
  ]
};

export default homeRoute;
