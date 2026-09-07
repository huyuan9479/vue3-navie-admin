const settingRoute: AppRouteRecordRaw = {
  name: 'setting',
  path: '/setting',
  component: () => import('@/layouts/base-layout/index.vue'),
  redirect: { name: 'setting_workbench' },
  meta: {
    title: 'setting.title',
    i18nKey: 'route.setting',
    hideInMenu: true
  },
  children: [
    {
      name: 'setting_account',
      path: '/setting/account',
      component: () => import('@/views/setting/account/index.vue'),
      meta: {
        title: 'setting_account',
        i18nKey: 'route.setting_account',
        order: 1,
        hideInMenu: true
      }
    },
    {
      name: 'setting_notice',
      path: '/setting/notice',
      component: () => import('@/views/setting/notice/index.vue'),
      meta: {
        title: 'setting_notice',
        i18nKey: 'route.setting_notice',
        order: 2,
        hideInMenu: true
      }
    }
  ]
};

export default settingRoute;
