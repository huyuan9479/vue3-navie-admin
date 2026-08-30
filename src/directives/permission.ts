import { ObjectDirective } from 'vue';
import { usePermission } from '@/hooks/common/permission';

export const permission: ObjectDirective<HTMLElement, string[] | string> = {
  mounted(el, binding) {
    const value = binding.value;
    if (value === undefined || value === null) return;

    // Convert string or string[] into standard array
    const action = Array.isArray(value) ? value : [value];

    // binding.arg controls the effect: e.g., v-perm:disabled -> binding.arg is 'disabled'
    // Defaults to 'hidden' (remove from DOM)
    const effect = binding.arg || 'hidden';

    const { hasPermission } = usePermission();
    if (!hasPermission(action)) {
      if (effect === 'disabled') {
        el.setAttribute('disabled', 'true');
        (el as any).disabled = true;
        el.classList.add('n-button--disabled');
      } else {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        } else {
          el.style.display = 'none';
        }
      }
    }
  }
};
