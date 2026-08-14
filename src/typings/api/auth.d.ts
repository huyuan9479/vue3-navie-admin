declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
      scope: string;
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
