import type { RouteRecordRaw } from 'vue-router';
import { getRoutePath } from '../route-map';

const RootRoute: RouteRecordRaw = {
  name: 'root',
  path: '/',
  redirect: getRoutePath(import.meta.env.VITE_ROUTE_HOME) || '/home/workbench',
  meta: {
    title: 'root',
    constant: true
  }
};

const LoginRoute: RouteRecordRaw = {
  name: 'login',
  path: '/login/:module(pwd-login|register|reset-pwd|express-login)?',
  component: () => import('@/views/login/index.vue'),
  props: true,
  meta: {
    title: 'login',
    i18nKey: 'route.login',
    constant: true,
    hideInMenu: true
  }
};

const NotFoundRoute: RouteRecordRaw = {
  name: 'not-found',
  path: '/:pathMatch(.*)*',
  component: () => import('@/views/exception/404/index.vue'),
  meta: {
    title: 'not-found',
    constant: true
  }
};

/** builtin routes, it must be constant and setup in vue-router */
const constantRoutes: RouteRecordRaw[] = [RootRoute, LoginRoute, NotFoundRoute];

export { RootRoute };

/** create constant vue routes */
export function createConstantVueRoutes() {
  return constantRoutes;
}
