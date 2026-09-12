import type { RouteKey, RouteMap, RoutePath } from '@page-router/types';

/**
 * map of route name and route path
 */
const routeMap: RouteMap = {
  root: '/',
  'not-found': '/:pathMatch(.*)*',
  '403': '/403',
  '404': '/404',
  '500': '/500',
  home: '/home',
  'iframe-page': '/iframe-page/:url',
  login: '/login/:module(pwd-login|register|reset-pwd|express-login)?',
  home_workbench: '/home/workbench',
  home_analytics: '/home/analytics',
  setting: '/setting',
  setting_account: '/setting/account',
  setting_notice: '/setting/notice',
  system: '/system',
  system_menu: '/system/menu',
  system_role: '/system/role',
  system_user: '/system/user',
  'external-link': '/external-link',
  'external-link_github': '/external-link/github',
  'external-link_vue': '/external-link/vue',
  'multi-menu': '/multi-menu',
  'multi-menu_first': '/multi-menu/first',
  'multi-menu_first_one': '/multi-menu/first/one',
  'multi-menu_second': '/multi-menu/second',
  'multi-menu_second_one': '/multi-menu/second/one',
  'multi-menu_second_two': '/multi-menu/second/two'
};

/**
 * get route path by route name
 * @param name route name
 */
export function getRoutePath<T extends RouteKey>(name: T) {
  return routeMap[name];
}

/**
 * get route name by route path
 * @param path route path
 */
export function getRouteName(path: RoutePath) {
  const routeEntries = Object.entries(routeMap) as [RouteKey, RoutePath][];

  const routeName: RouteKey | null =
    routeEntries.find(([, routePath]) => routePath === path)?.[0] || null;

  return routeName;
}
