<script setup lang="ts">
import { reactive } from 'vue';
import VueDragResize, { IRect } from './index';
const vdr = reactive([
  {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    active: true,
    resizable: false,
    rotatable: false,
    rotate: 0,
    content: 'draggable',
  },
  {
    x: 400,
    y: 400,
    width: 300,
    height: 200,
    active: true,
    resizable: true,
    rotatable: true,
    rotate: 0,
    content: 'draggable resizable rotatable',
  },
  {
    x: 200,
    y: 100,
    width: 300,
    height: 255,
    active: true,
    resizable: true,
    rotatable: false,
    rotate: 0,
    content: 'draggable resizable',
  },
]);

function onDragEnd(ev: IRect, index: number) {
  console.log('onDragEnd', ev, index);
  vdr[index].x = ev.x;
  vdr[index].y = ev.y;
}

function onResizeEnd(ev: IRect, index: number) {
  console.log('onResizeEnd', ev, index);
  vdr[index].width = ev.width;
  vdr[index].height = ev.height;
  vdr[index].x = ev.x;
  vdr[index].y = ev.y;
}

function onResizing(ev: IRect, index: number) {
  console.log('onResizing', ev, index);
  vdr[index].width = ev.width;
  vdr[index].height = ev.height;
  vdr[index].x = ev.x;
  vdr[index].y = ev.y;
}

function onDragging(ev: IRect, index: number) {
  console.log('onDragging', ev, index);
  vdr[index].width = ev.width;
  vdr[index].height = ev.height;
  vdr[index].x = ev.x;
  vdr[index].y = ev.y;
}

function onActive(index: number) {
  vdr.forEach((v, i) => {
    v.active = i === index;
  });
}
function onRotating(ev: number, index: number) {
  console.log('onRotating', ev, index);
  vdr[index].rotate = ev;
}
function onRotateEnd(ev: number, index: number) {
  console.log('onRotateEnd', ev, index);
  vdr[index].rotate = ev;
}
</script>

<template>
  <div class="container">
    <div>
      <VueDragResize
        v-for="(item, index) in vdr"
        :key="index"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
        :rotate="item.rotate"
        :active="item.active"
        :resizable="item.resizable"
        :rotatable="item.rotatable"
        :immediate="false"
        @click="onActive(index)"
        @drag-end="(ev) => onDragEnd(ev, index)"
        @dragging="(ev) => onDragging(ev, index)"
        @resize-end="(ev) => onResizeEnd(ev, index)"
        @resizing="(ev) => onResizing(ev, index)"
        @rotating="(ev) => onRotating(ev, index)"
        @rotate-end="(ev) => onRotateEnd(ev, index)"
      >
        <div class="item">
          {{ item.content }}
        </div>
      </VueDragResize>
    </div>
    <div class="scale">
      <VueDragResize
        v-for="(item, index) in vdr"
        :key="index"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
        :rotate="item.rotate"
        :active="item.active"
        :resizable="item.resizable"
        :rotatable="item.rotatable"
        :immediate="false"
        :parent-scale-x="0.5"
        :parent-scale-y="0.5"
        @click="onActive(index)"
        @drag-end="(ev) => onDragEnd(ev, index)"
        @dragging="(ev) => onDragging(ev, index)"
        @resize-end="(ev) => onResizeEnd(ev, index)"
        @resizing="(ev) => onResizing(ev, index)"
        @rotating="(ev) => onRotating(ev, index)"
        @rotate-end="(ev) => onRotateEnd(ev, index)"
      >
        <div class="item">
          {{ item.content }}
        </div>
      </VueDragResize>
    </div>
  </div>
</template>

<style>
html,
body {
  height: 100%;
}

body {
  margin: 0;
}

#app {
  height: 100%;
}

.container {
  display: flex;
  height: 100%;
}

.container > div {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  border: 1px solid #ccc;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #333;
  background-color: #eee;
}

.scale {
  transform: scale(0.5);
}
</style>
