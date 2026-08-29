import { h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { RouteKey } from '@page-router/types';
import SvgIcon from '@/components/custom/SvgIcon.vue';
import { $t } from '@/locales';

/**
 * Filter auth routes by roles
 * @param routes routes
 * @param roles roles
 */
export function filterAuthRoutesByRoles(
  routes: RouteRecordRaw[],
  roles: string[]
) {
  return routes.filter(route => {
    const routeRoles = route.meta?.roles;

    if (!routeRoles) return true;

    const intersection = routeRoles.filter(role => roles.includes(role));

    return intersection.length > 0;
  });
}

/**
 * Filter routes by dev environment
 * @param routes routes
 */
export function filterRoutesByDev(routes: RouteRecordRaw[]) {
  if (import.meta.env.DEV) return routes;

  return routes.filter(route => !route.meta?.isDev);
}

/**
 * Sort routes by order
 * @param routes routes
 */
export function sortRoutesByOrder(routes: RouteRecordRaw[]) {
  return routes.sort(
    (next, prev) => (next.meta?.order || 0) - (prev.meta?.order || 0)
  );
}

/**
 * Get global menus by auth routes
 * @param routes routes
 */
export function getGlobalMenusByAuthRoutes(routes: RouteRecordRaw[]) {
  return routes
    .map(route => getGlobalMenuByBaseRoute(route))
    .filter(Boolean) as App.Global.Menu[];
}

/**
 * Get global menu by base route
 * @param route route
 */
function getGlobalMenuByBaseRoute(
  route: RouteRecordRaw
): App.Global.Menu | null {
  const { meta, children, name } = route;

  if (!meta || meta.hideInMenu) return null;

  const isSingleLevel =
    children && children.length === 1 && children[0].path === '';
  const effectiveName = name || (isSingleLevel ? children[0].name : undefined);

  if (!effectiveName) return null;

  const menu: App.Global.Menu = {
    key: effectiveName as string,
    label: meta.i18nKey ? $t(meta.i18nKey) : meta.title,
    routeKey: effectiveName as RouteKey,
    routePath: route.path || '',
    i18nKey: meta.i18nKey
  };

  if (meta.icon || meta.localIcon) {
    const icon = meta.localIcon || meta.icon;
    const prop = meta.localIcon ? 'localIcon' : 'icon';

    menu.icon = () => h(SvgIcon, { [prop]: icon as string });
  } else if (import.meta.env.VITE_MENU_ICON) {
    menu.icon = () => h(SvgIcon, { icon: import.meta.env.VITE_MENU_ICON });
  }

  if (children && children.length > 0 && !isSingleLevel) {
    const childMenus = children
      .map(child => getGlobalMenuByBaseRoute(child))
      .filter(Boolean) as App.Global.Menu[];

    if (childMenus.length > 0) {
      menu.children = childMenus;
    }
  }

  return menu;
}

/**
 * Get cache route names
 * @param routes vue routes
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: RouteKey[] = [];

  function getCacheName(route: RouteRecordRaw) {
    const { meta, children, name } = route;

    const effectiveName =
      name ||
      (children && children.length === 1 && children[0].path === ''
        ? children[0].name
        : undefined);

    if (meta?.keepAlive && effectiveName) {
      cacheNames.push(effectiveName as RouteKey);
    }

    if (children) {
      children.forEach(child => getCacheName(child));
    }
  }

  routes.forEach(route => getCacheName(route));

  return cacheNames;
}

/**
 * Get breadcrumbs by route
 * @param route current route
 * @param menus global menus
 */
export function getBreadcrumbsByRoute(
  route: {
    name?: string | symbol | null;
    path: string;
    meta?: Record<string, unknown>;
  },
  menus: App.Global.Menu[]
) {
  const breadcrumbs: App.Global.Menu[] = [];

  const routeName = route.name as string | undefined;

  if (!routeName) return breadcrumbs;

  const menuKey =
    typeof route.meta?.activeMenu === 'string'
      ? route.meta.activeMenu
      : routeName;

  function findMenu(menusList: App.Global.Menu[], parent?: App.Global.Menu) {
    for (const menu of menusList) {
      if (menu.routeKey === menuKey) {
        if (parent) {
          breadcrumbs.push(parent);
        }
        breadcrumbs.push(menu);
        return true;
      }

      if (menu.children && menu.children.length > 0) {
        const found = findMenu(menu.children, menu);
        if (found) return true;
      }
    }

    return false;
  }

  findMenu(menus);

  return breadcrumbs;
}

/**
 * Get selected menu key path by key
 * @param selectedKey selected menu key
 * @param menus global menus
 */
export function getSelectedMenuKeyPathByKey(
  selectedKey: string,
  menus: App.Global.Menu[]
) {
  const keyPath: string[] = [];

  function findKeyPath(menuList: App.Global.Menu[], key: string) {
    for (const menu of menuList) {
      if (menu.routeKey === key) {
        keyPath.push(menu.key);
        return true;
      }

      if (menu.children && menu.children.length > 0) {
        const found = findKeyPath(menu.children, key);
        if (found) {
          keyPath.unshift(menu.key);
          return true;
        }
      }
    }

    return false;
  }

  findKeyPath(menus, selectedKey);

  return keyPath;
}

/**
 * Is route exist by route name
 * @param routeName route name
 * @param routes routes
 */
export function isRouteExistByRouteName(
  routeName: RouteKey,
  routes: RouteRecordRaw[]
) {
  for (const route of routes) {
    if (route.name === routeName) return true;

    if (route.children && route.children.length > 0) {
      const exist = isRouteExistByRouteName(routeName, route.children);
      if (exist) return true;
    }
  }

  return false;
}

/**
 * Transform menu to search menus
 * @param menus global menus
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[]) {
  const searchMenus: App.Global.Menu[] = [];

  function flatten(menuList: App.Global.Menu[]) {
    menuList.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        flatten(menu.children);
      } else {
        if (menu.routeKey) {
          searchMenus.push(menu);
        }
      }
    });
  }

  flatten(menus);

  return searchMenus;
}

/**
 * Update locale of global menus
 * @param menus global menus
 */
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]) {
  return menus.map(menu => {
    const newMenu: App.Global.Menu = {
      ...menu,
      label: menu.i18nKey ? $t(menu.i18nKey) : menu.label
    };

    if (menu.children && menu.children.length > 0) {
      newMenu.children = updateLocaleOfGlobalMenus(menu.children);
    }

    return newMenu;
  });
}
