import { computed, Ref, ref, unref } from 'vue';

export interface UseFullScreenContext {
  wrapClassName: Ref<string | undefined>;
}

export function useFullScreen() {
  const fullScreenRef = ref(false);

  const getWrapClassName = computed(() => {
    return unref(fullScreenRef)
      ? `basic-modal-wrap modal-fullscreen`
      : `basic-modal-wrap not-modal-fullscreen`;
  });

  function handleFullScreen(e: Event) {
    if (e) {
      e.stopPropagation();
    }
    fullScreenRef.value = !unref(fullScreenRef);
  }

  return { getWrapClassName, handleFullScreen, fullScreenRef };
}
