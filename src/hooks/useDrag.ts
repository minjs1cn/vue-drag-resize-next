import { reactive, Ref } from 'vue';
import { isMouseEvent, isTouchEvent } from '../utils';

export function useDrag(vdfRef: Ref<HTMLDivElement|undefined>) {
  const lastPos = {
    x: 0,
    y: 0,
  };
  const delta = reactive({
    x: 0,
    y: 0,
  });

  function dragging(ev: Event) {
    console.log(ev);
    if (isMouseEvent(ev)) {
      delta.x = ev.pageX - lastPos.x;
      delta.y = ev.pageY - lastPos.y;
    } else if (isTouchEvent(ev)) {
      delta.x = ev.touches[0].pageX - lastPos.x;
      delta.y = ev.touches[0].pageY - lastPos.y;
    }
    if (vdfRef.value) {
      vdfRef.value.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
    }
  }

  function dragend(ev: Event) {
    console.log('bodyUp', ev);
    lastPos.x = 0;
    lastPos.y = 0;
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', dragend);
  }

  function dragstart(ev: Event) {
    if (isMouseEvent(ev)) {
      const pointerX = ev.pageX;
      const pointerY = ev.pageY;
      lastPos.x = pointerX;
      lastPos.y = pointerY;
      console.log(pointerX, pointerY);
      document.addEventListener('mousemove', dragging);
      document.addEventListener('mouseup', dragend);
      return;
    }

    if (isTouchEvent(ev)) {
      const pointerX = ev.touches[0].pageX;
      const pointerY = ev.touches[0].pageY;
      console.log(pointerX, pointerY);
      document.addEventListener('touchmove', dragging);
      document.addEventListener('touchend', dragend);
    }
  }

  return {
    delta,
    dragstart,
  };
}
