import { computed, Ref, ref, unref } from 'vue';

export interface UseFullScreenContext {
  wrapClassName: Ref<string | undefined>;
}

export function useFullScreen(context: UseFullScreenContext) {
  const fullScreenRef = ref(false);

  const getWrapClassName = computed(() => {
    const clsName = unref(context.wrapClassName) || '';
    return unref(fullScreenRef)
      ? `modal-fullscreen ${clsName} `
      : `basic-modal-wrap ${clsName}`;
  });

  function handleFullScreen(e: Event) {
    if (e) {
      e.stopPropagation();
    }
    fullScreenRef.value = !unref(fullScreenRef);
  }

  return { getWrapClassName, handleFullScreen, fullScreenRef };
}
