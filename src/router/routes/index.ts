import type { RouteRecordRaw } from 'vue-router';

/**
 * custom routes (manually defined additional routes)
 */
const customRoutes: RouteRecordRaw[] = [];

/** Get constant routes (with meta.constant === true) */
function getConstantRoutes(routes: RouteRecordRaw[]) {
  return routes.filter(route => route.meta?.constant);
}

/** Get auth routes (without meta.constant) */
function getAuthRoutes(routes: RouteRecordRaw[]) {
  return routes.filter(route => !route.meta?.constant);
}

// Dynamically scan and import all route modules under the "modules" directory
const modules = import.meta.glob('./modules/*.ts', { eager: true });

const routeModules: RouteRecordRaw[] = [];

Object.keys(modules).forEach(key => {
  const module = (modules[key] as any).default;
  if (module) {
    if (Array.isArray(module)) {
      routeModules.push(...module);
    } else {
      routeModules.push(module);
    }
  }
});

/** create routes when the auth route mode is static */
export function createStaticRoutes() {
  const allRoutes = [...customRoutes, ...routeModules];

  const constantRoutes = getConstantRoutes(allRoutes);
  const authRoutes = getAuthRoutes(allRoutes);

  return {
    constantRoutes,
    authRoutes
  };
}

/**
 * Get auth vue routes
 *
 * @param routes RouteRecordRaw routes
 */
export function getAuthVueRoutes(routes: RouteRecordRaw[]) {
  return routes;
}
