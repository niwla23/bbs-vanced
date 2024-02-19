import type { Action } from "svelte/action";

export const longpress: Action = (node: HTMLElement, threshold = 1100) => {
  const handle_mousedown = () => {
    const timeout = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'));
    }, threshold);

    const cancel = () => {
      clearTimeout(timeout);
      node.removeEventListener('mousemove', cancel);
      node.removeEventListener('mouseup', cancel);
      node.removeEventListener('touchend', cancel);
      node.removeEventListener('touchcancel', cancel);
    };

    node.addEventListener('mousemove', cancel);
    node.addEventListener('mouseup', cancel);
    node.addEventListener('touchend', cancel);
    node.addEventListener('touchcancel', cancel);
  };

  node.addEventListener('mousedown', handle_mousedown);
  node.addEventListener('touchstart', handle_mousedown)

  return {
    destroy() {
      node.removeEventListener('mousedown', handle_mousedown);
      node.removeEventListener('touchstart', handle_mousedown)
    }
  };
};
