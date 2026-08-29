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

  export interface RouteMeta {
    /**
     * Title of the route
     *
     * It can be used in document title
     */
    title: string;
    /**
     * I18n key of the route
     *
     * It's used in i18n, if it is set, the title will be ignored
     */
    i18nKey?: App.I18n.I18nKey | null;
    /**
     * Roles of the route
     *
     * Route can be accessed if the current user has at least one of the roles
     *
     * It only works when the route mode is "static", if the route mode is "dynamic", it will be ignored
     */
    roles?: string[];
    /** Whether to cache the route */
    keepAlive?: boolean | null;
    /**
     * Is constant route
     *
     * when it is set to true, there will be no login verification and no permission verification to access the route
     */
    constant?: boolean | null;
    /**
     * Iconify icon
     *
     * It can be used in the menu or breadcrumb
     */
    icon?: string;
    /**
     * Local icon
     *
     * In "src/assets/svg-icon", if it is set, the icon will be ignored
     */
    localIcon?: string;
    /** Icon size. width and height are the same. */
    iconFontSize?: number;
    /** Router order */
    order?: number | null;
    /** The outer link of the route */
    href?: string | null;
    /** Whether to hide the route in the menu */
    hideInMenu?: boolean | null;
    /**
     * The menu key will be activated when entering the route
     *
     * The route is not in the menu
     *
     * @example
     *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
     */
    activeMenu?: RouteKey | null;
    /**
     * By default, the same route path will use one tab, even with different query, if set true, the route with
     * different query will use different tabs
     */
    multiTab?: boolean | null;
    /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
    fixedIndexInTab?: number | null;
    /** if set query parameters, it will be automatically carried when entering the route */
    query?: { key: string; value: string }[] | null;
    /**
     * Whether the route is only available in the development environment
     *
     * When set to true, the route will only be loaded if `import.meta.env.DEV` is true, even if the route mode is
     * "dynamic"
     */
    isDev?: boolean;
  }

  /**
   * the basic route type, equivalent to the ElegantConstRoute from elegant-router
   */
  export type PageConstRoute = {
    name: string;
    path: string;
    component?: string;
    redirect?: string;
    props?: boolean | Record<string, unknown>;
    meta?: RouteMeta;
    // Partial<{
    //   // 路由标题
    //   title: string;
    //   // 路由的国际化键值，如果设置，将用于i18n，此时title将被忽略
    //   i18nKey: string;
    //   // 是否为常量路由，无需登录，并且该路由在前端定义
    //   constant: boolean;
    //   // 是否在菜单中隐藏该路由
    //   hideInMenu: boolean;
    //   // 是否开启路由缓存
    //   keepAlive: boolean;
    //   // 路由的排序，用于在菜单中显示顺序
    //   order: number;
    //   // Iconify 图标，可用于菜单或面包屑中
    //   icon: string;
    //   // 本地图标
    //   // 存在于 "src/assets/svg" 目录下，如果设置，将忽略icon属性
    //   localIcon: string;
    //   //
    //   iconFontSize: number;
    //   roles: string[];
    //   isDev: boolean;
    //   activeMenu: string;
    //   [key: string]: unknown;
    // }>;
    children?: PageConstRoute[];
  };
}
