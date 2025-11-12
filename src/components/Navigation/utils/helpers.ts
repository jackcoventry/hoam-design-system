export const isVisible = (el: Element) => {
  const e = el as HTMLElement;
  if (!e) return false;
  if (e.closest('[hidden]')) return false;
  const cs = getComputedStyle(e);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  if (e.tabIndex === -1) return false;
  return e.offsetWidth > 0 && e.offsetHeight > 0;
};

export const querySubItemVisibility = <T extends HTMLElement>(
  root: Element | Document,
  sel: string
) => Array.from(root.querySelectorAll<T>(sel)).filter(isVisible);

export const focusNextTick = (el?: HTMLElement | null) => {
  if (el) requestAnimationFrame(() => el.focus());
};

export const wrapIndex = (i: number, len: number) => (i + len) % len;

export const moveInList = (list: HTMLElement[], current: HTMLElement, delta: number) => {
  if (!list.length) return;
  const idx = Math.max(0, list.indexOf(current));
  const next = list[wrapIndex(idx + delta, list.length)];
  focusNextTick(next);
};
