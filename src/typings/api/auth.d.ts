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
      /** 菜单权限 */
      menus?: string[];
      /** 按钮权限 */
      buttons?: string[];
      /** 动态路由 */
      routes?: import('@page-router/types').PageConstRoute[];
    }
  }
}
