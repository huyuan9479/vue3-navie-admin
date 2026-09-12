const multiMenuRoutes: AppRouteRecordRaw = {
  name: 'multi-menu',
  path: '/multi-menu',
  component: () => import('@/layouts/base-layout/index.vue'),
  meta: {
    title: 'multi-menu',
    i18nKey: 'route.multi-menu',
    icon: 'ant-design:menu-outlined',
    order: 3
  },
  children: [
    {
      name: 'multi-menu_first',
      path: '/multi-menu/first',
      meta: {
        title: 'multi-menu_first',
        i18nKey: 'route.multi-menu_first',
        order: 1
      },
      children: [
        {
          name: 'multi-menu_first_one',
          path: '/multi-menu/first',
          component: () => import('@/views/multi-menu/first/one/index.vue'),
          meta: {
            title: 'multi-menu_first_one',
            i18nKey: 'route.multi-menu_first_one'
          }
        }
      ]
    },
    {
      name: 'multi-menu_second',
      path: '/multi-menu/second',
      meta: {
        title: 'multi-menu_second',
        i18nKey: 'route.multi-menu_second',
        order: 2
      },
      children: [
        {
          name: 'multi-menu_second_one',
          path: '/multi-menu/second/one',
          component: () => import('@/views/multi-menu/second/one/index.vue'),
          meta: {
            title: 'multi-menu_second_one',
            i18nKey: 'route.multi-menu_second_one'
          }
        },
        {
          name: 'multi-menu_second_two',
          path: '/multi-menu/second/two',
          component: () => import('@/views/multi-menu/second/two/index.vue'),
          meta: {
            title: 'multi-menu_second_two',
            i18nKey: 'route.multi-menu_second_two'
          }
        }
      ]
    }
  ]
};

export default multiMenuRoutes;
