import { useSvgIconRender } from '@sa/hooks';
import SvgIcon from '@/components/custom/SvgIcon.vue';

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon);

  return {
    SvgIconVNode
  };
}
