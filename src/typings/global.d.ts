import type { ComputedRef, Ref, VNode } from "vue";

export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import("nprogress").NProgress;
    /** Loading bar instance */
    $loadingBar?: import("naive-ui").LoadingBarProviderInst;
    /** Dialog instance */
    $dialog?: import("naive-ui").DialogProviderInst;
    /** Message instance */
    $message?: import("naive-ui").MessageProviderInst;
    /** Notification instance */
    $notification?: import("naive-ui").NotificationProviderInst;
  }

  export type Recordable<T = any> = Record<string, T>;
  export type Nullable<T> = T | null;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;

    interface ElementAttributesProperty {
      $props: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }

  export type DynamicProps<T> = {
    [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
  };

  /** Build time of the project */
  export const BUILD_TIME: string;
}
