/* eslint-disable */
declare module '@page-router/types' {
  /**
   * route layout
   */
  export type RouteLayout = 'base' | 'blank';

  /**
   * route map
   */
  export type RouteMap = {
    root: '/';
    'not-found': '/:pathMatch(.*)*';
    '403': '/403';
    '404': '/404';
    '500': '/500';
    home: '/home';
    'iframe-page': '/iframe-page/:url';
    login: '/login/:module(pwd-login|register|reset-pwd|express-login)?';
    system: '/system';
    system_menu: '/system/menu';
    system_role: '/system/role';
    system_user: '/system/user';
  };

  /**
   * route key
   */
  export type RouteKey = keyof RouteMap;

  /**
   * route path
   */
  export type RoutePath = RouteMap[RouteKey];

  /**
   * custom route key
   */
  export type CustomRouteKey = Extract<RouteKey, 'root' | 'not-found'>;

  /**
   * the generated route key
   */
  export type GeneratedRouteKey = Exclude<RouteKey, CustomRouteKey>;

  /**
   * the first level route key, which contain the layout of the route
   */
  export type FirstLevelRouteKey = Extract<
    RouteKey,
    '403' | '404' | '500' | 'home' | 'iframe-page' | 'login' | 'system'
  >;

  /**
   * the custom first level route key
   */
  export type CustomFirstLevelRouteKey = Extract<
    CustomRouteKey,
    'root' | 'not-found'
  >;

  /**
   * the last level route key, which has the page file
   */
  export type LastLevelRouteKey = Extract<
    RouteKey,
    | '403'
    | '404'
    | '500'
    | 'iframe-page'
    | 'login'
    | 'home'
    | 'system_menu'
    | 'system_role'
    | 'system_user'
  >;

  /**
   * the custom last level route key
   */
  export type CustomLastLevelRouteKey = Extract<
    CustomRouteKey,
    'root' | 'not-found'
  >;

  /**
   * the single level route key
   */
  export type SingleLevelRouteKey = FirstLevelRouteKey & LastLevelRouteKey;

  /**
   * the custom single level route key
   */
  export type CustomSingleLevelRouteKey = CustomFirstLevelRouteKey &
    CustomLastLevelRouteKey;

  /**
   * the first level route key, but not the single level
   */
  export type FirstLevelRouteNotSingleKey = Exclude<
    FirstLevelRouteKey,
    SingleLevelRouteKey
  >;

  /**
   * the custom first level route key, but not the single level
   */
  export type CustomFirstLevelRouteNotSingleKey = Exclude<
    CustomFirstLevelRouteKey,
    CustomSingleLevelRouteKey
  >;

  /**
   * the center level route key
   */
  export type CenterLevelRouteKey = Exclude<
    GeneratedRouteKey,
    FirstLevelRouteKey | LastLevelRouteKey
  >;

  /**
   * the custom center level route key
   */
  export type CustomCenterLevelRouteKey = Exclude<
    CustomRouteKey,
    CustomFirstLevelRouteKey | CustomLastLevelRouteKey
  >;

  /**
   * the basic route type, equivalent to the ElegantConstRoute from elegant-router
   */
  export type PageConstRoute = {
    name: string;
    path: string;
    component?: string;
    redirect?: string;
    props?: boolean | Record<string, unknown>;
    meta?: import('vue-router').RouteMeta;
    children?: PageConstRoute[];
  };
}
