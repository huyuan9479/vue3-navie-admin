import type { RouteRecordRaw } from 'vue-router';

const systemRoute: RouteRecordRaw = {
  name: 'system',
  path: '/system',
  component: () => import('@/layouts/base-layout/index.vue'),
  redirect: { name: 'system_user' },
  meta: {
    title: 'system',
    i18nKey: 'route.system',
    icon: 'ant-design:setting-outlined',
    order: 2
  },
  children: [
    {
      name: 'system_user',
      path: '/system/user',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: 'system_user',
        i18nKey: 'route.system_user',
        order: 1
      }
    },
    {
      name: 'system_role',
      path: '/system/role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: 'system_role',
        i18nKey: 'route.system_role',
        order: 2
      }
    },
    {
      name: 'system_menu',
      path: '/system/menu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        title: 'system_menu',
        i18nKey: 'route.system_menu',
        order: 3
      }
    }
  ]
};

export default systemRoute;
