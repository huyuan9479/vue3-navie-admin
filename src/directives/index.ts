import { App } from 'vue';
import { permission } from './permission';
import debounce from './debounce';
import throttle from './throttle';
import clickOutside from './click-outside';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 权限控制指令（演示）
  app.directive('permission', permission);
  // 点击外部指令
  app.directive('click-outside', clickOutside);
  // 防抖指令
  app.directive('debounce', debounce);
  // 节流指令
  app.directive('throttle', throttle);
}
