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
  system: '/system',
  system_menu: '/system/menu',
  system_role: '/system/role',
  system_user: '/system/user'
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
