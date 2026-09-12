<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { NButton, NIcon, NTooltip } from 'naive-ui';
import type { Content } from '@tiptap/vue-3';

// 中文文档:https://tiptap.zhcndoc.com/
defineOptions({
  name: 'TiptapEditor'
});

interface Props {
  modelValue?: Content;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  disabled: false,
  maxHeight: '500px'
});

const emit = defineEmits<{
  'update:modelValue': [value: Content];
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] }
    }),
    Underline,
    Image.configure({
      allowBase64: true,
      inline: true
    }),
    Link.configure({
      openOnClick: true,
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' }
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: props.placeholder })
  ],
  editable: !props.disabled,
  editorProps: {
    attributes: {
      class: 'prose prose-sm focus:outline-none max-w-none'
    }
  },
  onUpdate: ({ editor: editorInstance }) => {
    emit('update:modelValue', editorInstance.getHTML());
  }
});

const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () =>
  editor.value?.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
const toggleCode = () => editor.value?.chain().focus().toggleCode().run();

const setHeading = (level: 1 | 2 | 3) =>
  editor.value?.chain().focus().toggleHeading({ level }).run();
const setParagraph = () => editor.value?.chain().focus().setParagraph().run();

const toggleBulletList = () =>
  editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () =>
  editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () =>
  editor.value?.chain().focus().toggleBlockquote().run();
const toggleCodeBlock = () =>
  editor.value?.chain().focus().toggleCodeBlock().run();
const setHorizontalRule = () =>
  editor.value?.chain().focus().setHorizontalRule().run();

const setTextAlign = (align: 'left' | 'center' | 'right' | 'justify') =>
  editor.value?.chain().focus().setTextAlign(align).run();

const addImage = () => {
  const url = window.prompt('请输入图片链接');
  if (url) editor.value?.chain().focus().setImage({ src: url }).run();
};

const addLink = () => {
  const url = window.prompt('请输入链接地址');
  if (url) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }
};

const undo = () => editor.value?.chain().focus().undo().run();
const redo = () => editor.value?.chain().focus().redo().run();

defineExpose({ editor });
</script>

<template>
  <div
    class="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
  >
    <!-- 工具栏 -->
    <div
      class="editor-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50"
    >
      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('bold') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleBold"
          >
            <template #icon>
              <NIcon><span class="font-bold text-sm">B</span></NIcon>
            </template>
          </NButton>
        </template>
        加粗
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('italic') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleItalic"
          >
            <template #icon>
              <NIcon><span class="italic text-sm">I</span></NIcon>
            </template>
          </NButton>
        </template>
        斜体
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('underline') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleUnderline"
          >
            <template #icon>
              <NIcon><span class="underline text-sm">U</span></NIcon>
            </template>
          </NButton>
        </template>
        下划线
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('strike') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleStrike"
          >
            <template #icon>
              <NIcon><span class="line-through text-sm">S</span></NIcon>
            </template>
          </NButton>
        </template>
        删除线
      </NTooltip>

      <div class="w-px h-5 bg-gray-300 mx-1" />

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('code') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleCode"
          >
            <template #icon>
              <NIcon><span class="text-sm">&lt;/&gt;</span></NIcon>
            </template>
          </NButton>
        </template>
        行内代码
      </NTooltip>

      <div class="w-px h-5 bg-gray-300 mx-1" />

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="
              editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'
            "
            size="small"
            quaternary
            @click="setHeading(1)"
          >
            <template #icon>
              <NIcon><span class="font-bold text-sm">H1</span></NIcon>
            </template>
          </NButton>
        </template>
        标题 1
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="
              editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'
            "
            size="small"
            quaternary
            @click="setHeading(2)"
          >
            <template #icon>
              <NIcon><span class="font-bold text-sm">H2</span></NIcon>
            </template>
          </NButton>
        </template>
        标题 2
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="
              editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'
            "
            size="small"
            quaternary
            @click="setHeading(3)"
          >
            <template #icon>
              <NIcon><span class="font-bold text-sm">H3</span></NIcon>
            </template>
          </NButton>
        </template>
        标题 3
      </NTooltip>

      <div class="w-px h-5 bg-gray-300 mx-1" />

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('bulletList') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleBulletList"
          >
            <template #icon>
              <NIcon><icon-mdi-format-list-bulleted class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        无序列表
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('orderedList') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleOrderedList"
          >
            <template #icon>
              <NIcon><icon-mdi-format-list-numbered class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        有序列表
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('blockquote') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleBlockquote"
          >
            <template #icon>
              <NIcon><icon-mdi-format-quote-close class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        引用
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton
            :type="editor.isActive('codeBlock') ? 'primary' : 'default'"
            size="small"
            quaternary
            @click="toggleCodeBlock"
          >
            <template #icon>
              <NIcon><icon-mdi-code-braces class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        代码块
      </NTooltip>

      <div class="w-px h-5 bg-gray-300 mx-1" />

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton size="small" quaternary @click="addImage">
            <template #icon>
              <NIcon><icon-mdi-image-outline class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        插入图片
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton size="small" quaternary @click="addLink">
            <template #icon>
              <NIcon><icon-mdi-link-variant class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        插入链接
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton size="small" quaternary @click="setHorizontalRule">
            <template #icon>
              <NIcon><icon-mdi-minus class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        分割线
      </NTooltip>

      <div class="w-px h-5 bg-gray-300 mx-1" />

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton size="small" quaternary @click="undo">
            <template #icon>
              <NIcon><icon-mdi-undo class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        撤销
      </NTooltip>

      <NTooltip v-if="editor">
        <template #trigger>
          <NButton size="small" quaternary @click="redo">
            <template #icon>
              <NIcon><icon-mdi-redo class="text-base" /></NIcon>
            </template>
          </NButton>
        </template>
        重做
      </NTooltip>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-body" :style="{ maxHeight }">
      <EditorContent :editor="editor" class="h-full" />
    </div>
  </div>
</template>

<style scoped>
.tiptap-editor-wrapper {
  transition: border-color 0.2s;
}
.tiptap-editor-wrapper:focus-within {
  border-color: var(--primary-color, #1890ff);
}
.editor-body {
  overflow-y: auto;
}
.editor-body :deep(.tiptap) {
  padding: 12px 16px;
  min-height: 200px;
  outline: none;
}
.editor-body :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #adb5bd;
  pointer-events: none;
  float: left;
  height: 0;
}
.editor-body :deep(.tiptap h1) {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.5em 0;
}
.editor-body :deep(.tiptap h2) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.4em 0;
}
.editor-body :deep(.tiptap h3) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.3em 0;
}
.editor-body :deep(.tiptap blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 1em;
  color: #6b7280;
  margin: 0.5em 0;
}
.editor-body :deep(.tiptap ul) {
  list-style: disc;
  padding-left: 1.5em;
}
.editor-body :deep(.tiptap ol) {
  list-style: decimal;
  padding-left: 1.5em;
}
.editor-body :deep(.tiptap code) {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}
.editor-body :deep(.tiptap pre) {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
}
.editor-body :deep(.tiptap pre code) {
  background: none;
  padding: 0;
  color: inherit;
}
.editor-body :deep(.tiptap img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 0.5em 0;
}
.editor-body :deep(.tiptap hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1em 0;
}
.editor-body :deep(.tiptap a) {
  color: var(--primary-color, #1890ff);
  text-decoration: underline;
}
</style>
