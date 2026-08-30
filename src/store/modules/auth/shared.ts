import { localStg } from '@/utils/storage';
import { useAuthStore } from './index';
import { $t } from '@/locales';

/** Get token */
export function getToken(): Api.Auth.LoginToken {
  return JSON.parse(localStg.get('token') || '{}');
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
}

export function noPermissionCheck(info: Api.Auth.UserInfo): boolean {
  const { VITE_AUTH_ROUTE_MODE } = import.meta.env;
  const authStore = useAuthStore();
  const { resetStore } = authStore;

  // 策略映射配置：将不同的路由模式映射到对应的数据存在性校验和错误提示
  const strategies: Record<
    string,
    { hasData: boolean; errorKey: App.I18n.I18nKey }
  > = {
    static_role: {
      hasData: !!info.roles?.length,
      errorKey: 'page.login.common.noRole'
    },
    static_perm: {
      hasData: !!info.menus?.length,
      errorKey: 'page.login.common.noPerm'
    },
    dynamic: {
      hasData: !!info.routes?.length,
      errorKey: 'page.login.common.noPerm'
    }
  };

  const check = strategies[VITE_AUTH_ROUTE_MODE];

  // 统一拦截处理：如果对应的模式没有配置或数据校验不通过，触发重置与提示
  if (check && !check.hasData) {
    window.$message?.error($t(check.errorKey));
    resetStore();
    return false;
  }

  return true;
}
