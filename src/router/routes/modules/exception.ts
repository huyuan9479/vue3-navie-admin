const exceptionRoutes: AppRouteRecordRaw[] = [
  {
    name: '403',
    path: '/403',
    component: () => import('@/views/exception/403/index.vue'),
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/exception/404/index.vue'),
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: () => import('@/views/exception/500/index.vue'),
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true,
      hideInMenu: true
    }
  }
];

export default exceptionRoutes;
