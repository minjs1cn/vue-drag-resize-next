<script setup lang="ts">
import { CSSProperties, computed, ref } from 'vue';
import { isMouseEvent, limitRotateAngle, createResizeRect, getPageEvent, setStyle, stickStyle, IRect, rect } from '../utils';

export type TStick = 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml';

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
const props = withDefaults(defineProps<IDragResizeProps>(), {
  x: 0,
  y: 0,
  z: 0,
  width: 100,
  height: 100,
  rotate: 0,
  sticks: () => [ 'tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml' ],
  stickSize: 10,
  parentScaleX: 1,
  parentScaleY: 1,
  rotatable: true,
  resizable: true,
  active: false,
  immediate: false,
});

interface IDragResizeEmits {
  (e: 'dragging', ev: IRect): void;
  (e: 'dragEnd', ev: IRect): void;
  (e: 'resizing', ev: IRect): void;
  (e: 'resizeEnd', ev: IRect): void;
  (e: 'rotating', ev: number): void;
  (e: 'rotateEnd', ev: number): void;
}
const emits = defineEmits<IDragResizeEmits>();
const resizeRect = createResizeRect(props.stickSize);
const vdrStyle = computed<CSSProperties>(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  zIndex: props.z,
}));

const bodyStyle = computed<CSSProperties>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  transform: `rotate(${props.rotate}deg)`,
}));
const rotatePointerStyle = computed<CSSProperties>(() => ({
  transform: `rotate(${props.rotate}deg)`,
}));

const vdrRef = ref<HTMLElement>();
const bodyRef = ref<HTMLElement>();
const rotatePointerRef = ref<HTMLElement>();

// 上次更新的位置
const lastPoint = {
  x: 0,
  y: 0,
};
// 记录更新的位置
let rectBox = rect(props.width, props.height);
// 记录操作的杆
let resizeStick = '';
// 记录旋转角度
let rotateAngle = 0;

function dragging(ev: MouseEvent | TouchEvent) {
  if (!vdrRef.value) {
    return;
  }

  const { pageX, pageY } = getPageEvent(ev);
  const deltaX = pageX - lastPoint.x;
  const deltaY = pageY - lastPoint.y;

  if (props.immediate) {
    lastPoint.x = pageX;
    lastPoint.y = pageY;
    rectBox.x = deltaX + rectBox.x;
    rectBox.y = deltaY + rectBox.y;
    emits('dragging', rectBox);
    return;
  }

  rectBox.x = deltaX + props.x;
  rectBox.y = deltaY + props.y;

  setStyle(vdrRef.value, {
    left: `${rectBox.x}px`,
    top: `${rectBox.y}px`,
  });
}

function dragend() {
  emits('dragEnd', rectBox);
  lastPoint.x = 0;
  lastPoint.y = 0;
  document.removeEventListener('mousemove', dragging);
  document.removeEventListener('mouseup', dragend);
  document.removeEventListener('touchmove', dragging);
  document.removeEventListener('touchend', dragend);
}

function dragstart(ev: MouseEvent | TouchEvent) {
  if (!props.active) {
    return;
  }

  rectBox.x = props.x;
  rectBox.y = props.y;

  const { pageX, pageY } = getPageEvent(ev);
  lastPoint.x = pageX;
  lastPoint.y = pageY;

  if (isMouseEvent(ev)) {
    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragend);
    return;
  }

  document.addEventListener('touchmove', dragging);
  document.addEventListener('touchend', dragend);
}

function resizing(ev: MouseEvent | TouchEvent) {
  if (!vdrRef.value || !bodyRef.value) {
    return;
  }

  const { pageX, pageY } = getPageEvent(ev);
  const deltaX = pageX - lastPoint.x;
  const deltaY = pageY - lastPoint.y;

  if (props.immediate) {
    lastPoint.x = pageX;
    lastPoint.y = pageY;
    rectBox = resizeRect(resizeStick, {
      x: deltaX,
      y: deltaY,
    }, rectBox);
    emits('resizing', rectBox);
    return;
  }

  rectBox = resizeRect(resizeStick, {
    x: deltaX,
    y: deltaY,
  }, props);

  setStyle(vdrRef.value, {
    left: `${rectBox.x}px`,
    top: `${rectBox.y}px`,
  });

  setStyle(bodyRef.value, {
    width: `${rectBox.width}px`,
    height: `${rectBox.height}px`,
  });
}

function resizeEnd() {
  emits('resizeEnd', rectBox);
  lastPoint.x = 0;
  lastPoint.y = 0;
  document.removeEventListener('mousemove', resizing);
  document.removeEventListener('mouseup', resizeEnd);
  document.removeEventListener('touchmove', resizing);
  document.removeEventListener('touchend', resizeEnd);
}

function resizeStart(ev: MouseEvent | TouchEvent, stick: TStick) {
  resizeStick = stick;

  const { pageX, pageY } = getPageEvent(ev);
  lastPoint.x = pageX;
  lastPoint.y = pageY;

  if (isMouseEvent(ev)) {
    document.addEventListener('mousemove', resizing);
    document.addEventListener('mouseup', resizeEnd);
    return;
  }

  document.addEventListener('touchmove', resizing);
  document.addEventListener('touchend', resizeEnd);
}

function rotating(ev: MouseEvent | TouchEvent) {
  if (!bodyRef.value || !rotatePointerRef.value) {
    return;
  }

  const { pageX, pageY } = getPageEvent(ev);
  const deltaX = Math.min(Math.max(pageX - lastPoint.x, -50), 50);
  // const deltaY = Math.min(pageY - lastPoint.y, 50);
  const deltaAngle = Math.asin(deltaX / 50) * 180 / Math.PI;

  if (props.immediate) {
    lastPoint.x = pageX;
    lastPoint.y = pageY;
    rotateAngle = limitRotateAngle(rotateAngle + deltaAngle);
    emits('rotating', rotateAngle);
    return;
  }

  rotateAngle = limitRotateAngle(props.rotate + deltaAngle);
  setStyle(bodyRef.value, {
    transform: `rotate(${rotateAngle}deg)`,
  });
  setStyle(rotatePointerRef.value, {
    transform: `rotate(${rotateAngle}deg)`,
  });
}

function rotateEnd() {
  emits('rotateEnd', rotateAngle);
  lastPoint.x = 0;
  lastPoint.y = 0;
  document.removeEventListener('mousemove', rotating);
  document.removeEventListener('mouseup', rotateEnd);
  document.removeEventListener('touchmove', rotating);
  document.removeEventListener('touchend', rotateEnd);
}

function rotateStart(ev: MouseEvent | TouchEvent) {
  rotateAngle = props.rotate;

  const { pageX, pageY } = getPageEvent(ev);
  lastPoint.x = pageX;
  lastPoint.y = pageY;

  if (isMouseEvent(ev)) {
    document.addEventListener('mousemove', rotating);
    document.addEventListener('mouseup', rotateEnd);
    return;
  }

  document.addEventListener('touchmove', rotating);
  document.addEventListener('touchend', rotateEnd);
}

</script>

<template>
  <div
    ref="vdrRef"
    :style="vdrStyle"
    :class="['vdr']"
    @mousedown="dragstart"
    @touchstart="dragstart"
  >
    <div
      ref="bodyRef"
      :style="bodyStyle"
    >
      <slot />
    </div>
    <div :class="['vdr-drag', { active: props.active }]" />
    <div :class="['vdr-rotate', (props.active && props.rotatable) ? '' : 'not-ratable']">
      <div
        ref="rotatePointerRef"
        class="vdr-rotate-pointer"
        :style="rotatePointerStyle"
        @mousedown.stop.prevent="rotateStart($event)"
        @touchstart.stop.prevent="rotateStart($event)"
      />
    </div>
    <div
      v-for="stick in props.sticks"
      :key="stick"
      class="vdr-stick"
      :class="['vdr-stick-' + stick, (props.resizable && props.active) ? '' : 'not-resizable']"
      :style="stickStyle(stick, props.stickSize, {
        x: props.parentScaleX,
        y: props.parentScaleY
      })"
      @mousedown.stop.prevent="resizeStart($event, stick)"
      @touchstart.stop.prevent="resizeStart($event, stick)"
    />
  </div>
</template>
<style lang="less">
  @import "./vue-drag-resize.less";
</style>
