import { CSSProperties } from 'vue';

export function isMouseEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

export function isTouchEvent(event: Event): event is TouchEvent {
  return event instanceof TouchEvent;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export type IPosition = IPoint

export type IScale = IPoint

export function rect(width: number, height: number): IRect {
  return {
    x: 0,
    y: 0,
    width,
    height,
  };
}

export function stickStyle(stick: string, stickSize: number, scale: IScale) {
  const ret: CSSProperties = {
    width: `${stickSize / scale.x}px`,
    height: `${stickSize / scale.y}px`,
  };

  switch (stick) {
  case 'tm':
  case 'bm':
    ret.marginLeft = `-${stickSize / scale.x / 2}px`;
    break;
  case 'ml':
  case 'mr':
    ret.marginTop = `-${stickSize / scale.x / 2}px`;
    break;
  default:
    break;
  }

  return ret;
}

export function getPageEvent(ev: MouseEvent | TouchEvent) {
  if (isMouseEvent(ev)) {
    return ev;
  }
  return ev.touches[0];
}

export function limitRotateAngle(angle: number) {
  if (angle < -90) {
    return -90;
  }

  if (angle > 90) {
    return 90;
  }

  return angle;
}

export function hasOwnProperty(obj: Record<string, any>, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  for (const key in styles) {
    if (hasOwnProperty(styles, key) && styles[key] !== undefined) {
      el.style[key] = styles[key]!;
    }
  }
}

export function createResizeRect(size: number) {
  const stickSize = size * 3;

  return (stick: string, delta: IPosition, base: IRect) => {
    const ret = rect(base.width, base.height);
    ret.x = base.x;
    ret.y = base.y;

    switch (stick) {
    case 'bl':
      ret.width = Math.max(-delta.x + base.width, stickSize);
      ret.height = delta.y + base.height;
      ret.x = base.width - ret.width + base.x;
      break;
    case 'bm':
      ret.height = Math.max(delta.y + base.height, stickSize);
      break;
    case 'br':
      ret.width = Math.max(delta.x + base.width, stickSize);
      ret.height = Math.max(delta.y + base.height, stickSize);
      break;
    case 'tl':
      ret.width = Math.max(-delta.x + base.width, stickSize);
      ret.height = Math.max(-delta.y + base.height, stickSize);
      ret.x = base.width - ret.width + base.x;
      ret.y = base.height - ret.height + base.y;
      break;
    case 'tm':
      ret.height = Math.max(-delta.y + base.height, stickSize);
      ret.y = base.height - ret.height + base.y;
      break;
    case 'tr':
      ret.width = Math.max(delta.x + base.width, stickSize);
      ret.height = Math.max(-delta.y + base.height, stickSize);
      ret.y = base.height - ret.height + base.y;
      break;
    case 'ml':
      ret.width = Math.max(-delta.x + base.width, stickSize);
      ret.x = base.width - ret.width + base.x;
      break;
    case 'mr':
      ret.width = Math.max(delta.x + base.width, stickSize);
      break;
    default:
      break;
    }
    return ret;
  };
}
