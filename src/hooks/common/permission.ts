import { useAuthStore } from '@/store/modules/auth';

export function usePermission() {
  const authStore = useAuthStore();
  const { userInfo } = authStore;

  /**
   * 检查权限
   * @param accesses
   */
  function somePermissions(accesses: string[]) {
    return (
      userInfo.permissions?.some(item => {
        return accesses.includes(item);
      }) || false
    );
  }

  /**
   * 判断是否存在权限
   * 可用于 v-if 显示逻辑
   * */
  function hasPermission(accesses: string[]): boolean {
    if (!accesses || !accesses.length) return true;
    return somePermissions(accesses);
  }

  /**
   * 是否包含指定的所有权限
   * @param accesses
   */
  function hasEveryPermission(accesses: string[]): boolean {
    const permissionsList = userInfo.permissions || [];
    if (Array.isArray(accesses)) {
      return permissionsList.every((access: any) => accesses.includes(access));
    }
    throw new Error(`[hasEveryPermission]: ${accesses} should be a array !`);
  }

  /**
   * 是否包含其中某个权限
   * @param accesses
   * @param accessMap
   */
  function hasSomePermission(accesses: string[]): boolean {
    const permissionsList = userInfo.permissions || [];
    if (Array.isArray(accesses)) {
      return permissionsList.some((access: any) =>
        accesses.includes(access.value)
      );
    }
    throw new Error(`[hasSomePermission]: ${accesses} should be a array !`);
  }

  return { hasPermission, hasEveryPermission, hasSomePermission };
}
