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
        order: 1
      }
    }
  ]
};

export default settingRoute;
