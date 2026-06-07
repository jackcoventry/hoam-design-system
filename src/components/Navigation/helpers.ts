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
) => Array.from(root?.querySelectorAll<T>(sel)).filter(isVisible);

export const focusNextTick = (el?: HTMLElement | null) => {
  if (el) requestAnimationFrame(() => el.focus());
};

export const wrapIndex = (i: number, len: number) => {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
};

export const moveInList = (
  list: HTMLElement[],
  current: HTMLElement,
  delta: number,
  beforeFocus?: (next: HTMLElement) => void
) => {
  if (!list.length) return;
  const idx = Math.max(0, list.indexOf(current));
  const next = list[wrapIndex(idx + delta, list.length)];
  if (!next) return;
  beforeFocus?.(next);
  focusNextTick(next);
};

export const topTriggerId = (id: string) => `trigger-${id}`;
export const panelId = (id: string) => `panel-${id}`;
export const groupBtnId = (id: string) => `group-${id}`;
export const groupPanelId = (id: string) => `group-${id}-panel`;
