# vue-drag-resize-next

vue-drag-resize-next is a Vue.js component library for drag and resize.

## Usage

```vue
<script setup lang="ts">
import VueDragResize from 'vue-drag-resize-next';
</script>

<template>
  <VueDragResize>
    <div>11111</div>
  </VueDragResize>
</template>
```

## Props

```ts
export interface IDragResizeProps {
  x?: number;
  y?: number;
  z?: number;
  width?: number;
  height?: number;
  rotate?: number;

  /** 立即更新：由外部属性改变来更新视图，性能差一些 */
  immediate?: boolean;

  /** 容器缩放X */
  parentScaleX?: number;

  /** 容器缩放Y */
  parentScaleY?: number;

  /** 操作杆大小 */
  stickSize?: number;

  /** 操作杆方向 */
  sticks?: Array<TStick>;

  /** 可缩放 */
  resizable?: boolean;

  /** 可旋转 */
  rotatable?: boolean;

  /** 激活状态 */
  active?: boolean;
}
```

## Emits

```ts
interface IDragResizeEmits {
  (e: 'dragging', ev: IRect): void;
  (e: 'dragEnd', ev: IRect): void;
  (e: 'resizing', ev: IRect): void;
  (e: 'resizeEnd', ev: IRect): void;
  (e: 'rotating', ev: number): void;
  (e: 'rotateEnd', ev: number): void;
}
```
