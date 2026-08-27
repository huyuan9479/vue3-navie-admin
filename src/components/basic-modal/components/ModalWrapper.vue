<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import { createModalContext } from '../hooks/modal-context';
import { useWindowSizeFn } from '@/hooks/common/window-size';

defineOptions({ name: 'ModalWrapper', inheritAttrs: false });

interface Props {
  minHeight?: number;
  open?: boolean;
  fullScreen?: boolean;
  showAction?: boolean;
}

type ScrollbarInstance = {
  $el: HTMLElement;
  scrollTo: (options: {
    top?: number;
    left?: number;
    behavior?: ScrollBehavior;
  }) => void;
};

const props = withDefaults(defineProps<Props>(), {
  minHeight: 60,
  open: false,
  fullScreen: false,
  showAction: false
});

const wrapperRef = ref<ScrollbarInstance | null>(null);
const realHeight = ref(props.minHeight);

const scrollbarStyle = computed<CSSProperties>(() => ({
  maxHeight: `${realHeight.value}px`,
  minHeight: `${props.minHeight}px`
}));

useWindowSizeFn(() => setModalHeight() as never);

createModalContext({
  redoModalHeight: setModalHeight
});

watch(
  () => [props.open, props.fullScreen, props.showAction, props.minHeight],
  (newVal, oldVal) => {
    const [newOpen] = newVal;
    const oldOpen = oldVal?.[0];
    // 只要是 open 从 false→true 的切换，都交由 NModal 的 @after-enter 处理（动画结束后 DOM 最稳定，避免重复计算）
    if (newOpen && !oldOpen) {
      return;
    }
    setModalHeight();
  },
  { immediate: true, flush: 'post' }
);

function scrollTop() {
  nextTick(() => {
    wrapperRef.value?.scrollTo({ top: 0 });
  });
}

function getVerticalSize(
  element: Element,
  topKey: 'marginTop' | 'paddingTop',
  bottomKey: 'marginBottom' | 'paddingBottom'
) {
  const style = getComputedStyle(element);
  return Math.ceil(
    Number.parseFloat(style[topKey]) + Number.parseFloat(style[bottomKey])
  );
}

function getModalVerticalMargin(modalDom: Element) {
  // 全屏时弹框占满视口，不需要扣除外边距
  return props.fullScreen
    ? 0
    : getVerticalSize(modalDom, 'marginTop', 'marginBottom');
}

function getElementHeight(element: Element | null) {
  return Math.ceil(element?.getBoundingClientRect().height ?? 0);
}

function setModalHeight() {
  if (!props.open) return;

  nextTick(() => {
    // NScrollbar 的父级是 modal body，body 的父级是整个 modal card
    const bodyDom = wrapperRef.value?.$el.parentElement;
    const modalDom = bodyDom?.parentElement;
    if (!bodyDom || !modalDom) return;

    const headerDom = modalDom.querySelector('.n-card-header');

    // 动态读取 header/footer 的完整 DOM 高度，getBoundingClientRect().height 已包含 padding 和 border
    const headerHeight = getElementHeight(headerDom);
    const footerHeight = props.showAction
      ? getElementHeight(modalDom.querySelector('.n-card__action'))
      : 0;
    const bodyVerticalPadding = getVerticalSize(
      bodyDom,
      'paddingTop',
      'paddingBottom'
    );

    // 可滚动区域高度 = 视口高度 - 弹框内外已占用高度
    const occupiedHeight =
      headerHeight +
      footerHeight +
      getModalVerticalMargin(modalDom) +
      bodyVerticalPadding;

    realHeight.value = Math.ceil(
      Math.max(props.minHeight, window.innerHeight - occupiedHeight - 1)
    );
  });
}

defineExpose({
  scrollTop,
  setModalHeight
});
</script>

<template>
  <NScrollbar ref="wrapperRef" class="modal-scrollbar__content" :style="scrollbarStyle">
    <div class="px-24px">
      <slot name="default"></slot>
    </div>
  </NScrollbar>
</template>

<style lang="scss">
.modal-scrollbar__content {
  >.n-scrollbar-container {
    min-height: inherit;
  }
}
</style>
