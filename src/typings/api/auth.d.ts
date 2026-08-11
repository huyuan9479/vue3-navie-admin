declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      /** 角色 */
      roles?: string[];
      /** 权限 */
      permissions?: string[];
      /** 路由 */
      routes?: CommonType.Option[];
    }
  }
}
