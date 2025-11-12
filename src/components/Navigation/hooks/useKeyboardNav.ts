import { panelId } from '@/components/Navigation/Navigation.types';
import {
  focusNextTick,
  moveInList,
  querySubItemVisibility,
} from '@/components/Navigation/utils/helpers';
import { useCallback } from 'react';

export function useKeyboardNav(
  rootRef: React.RefObject<HTMLElement>,
  items: Array<{ id: string; items?: any[] }>,
  setOpenIndex: (n: number | null) => void,
  setOpenGroupId: (id: string | null) => void,
  mapArrow: (k: string) => string,
  subSelectors: {
    subTriggersOnly: (panelRoot: Element) => HTMLElement[];
    subInteractive: (panelRoot: Element) => HTMLElement[];
    thirdList: (container: Element, groupBtnDomId: string) => HTMLElement[];
  }
) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const container = rootRef?.current;
      const logicalKey = mapArrow(e.key);
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(logicalKey))
        return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const isTop = target.matches('[data-top-trigger]');
      const isSubTrigger = target.matches('[data-sub-trigger]');
      const isThird = target.matches('[data-sub-link]');

      const tops = querySubItemVisibility<HTMLElement>(container, '[data-top-trigger]');

      const panelRootFor = (topIdx: number) =>
        container.querySelector<HTMLElement>(`#${panelId(items[topIdx].id)}`) ?? container;

      // Top level navigation
      if (isTop) {
        const topIndex = tops.indexOf(target);
        switch (logicalKey) {
          case 'ArrowRight':
            moveInList(tops, target, +1);
            return;
          case 'ArrowLeft':
            moveInList(tops, target, -1);
            return;
          case 'Home':
            focusNextTick(tops[0]);
            return;
          case 'End':
            focusNextTick(tops[tops.length - 1]);
            return;
          case 'ArrowDown': {
            if (!items[topIndex]?.items?.length) return;
            setOpenIndex(topIndex);
            // pre-open first category visually
            const firstId = items[topIndex]?.items?.[0]?.id;
            setOpenGroupId(firstId ?? null);
            requestAnimationFrame(() => {
              const firstCat =
                subSelectors.subTriggersOnly(panelRootFor(topIndex))[0] ??
                subSelectors.subInteractive(panelRootFor(topIndex))[0];
              firstCat?.focus();
            });
            return;
          }
        }
      }

      // Second level navigation
      if (isSubTrigger) {
        const panelEl = target.closest('[id^="panel-"]');
        if (!panelEl) return;
        const topIdx = items.findIndex((t) => panelId(t.id) === panelEl.id);
        const categories = subSelectors.subTriggersOnly(panelEl);
        switch (logicalKey) {
          case 'ArrowDown':
            moveInList(categories, target, +1);
            return;
          case 'ArrowUp':
            moveInList(categories, target, -1);
            return;
          case 'Home':
            focusNextTick(categories[0]);
            return;
          case 'End':
            focusNextTick(categories[categories.length - 1]);
            return;
          case 'ArrowLeft':
            focusNextTick(tops[topIdx]);
            return;
          case 'ArrowRight': {
            const domId = target.id; // group-<id>
            const raw = domId.replace(/^group-/, '');
            setOpenGroupId(raw);
            requestAnimationFrame(() => {
              const firstThird = subSelectors.thirdList(container, domId)[0];
              firstThird?.focus();
            });
            return;
          }
        }
      }

      // Third and final navigation level
      if (isThird) {
        const listContainer = target.closest('[id$="-panel"]');
        const groupId = listContainer?.id?.replace(/-panel$/, '');
        const siblings = subSelectors.thirdList(container, groupId);
        switch (logicalKey) {
          case 'ArrowDown':
            moveInList(siblings, target, +1);
            return;
          case 'ArrowUp':
            moveInList(siblings, target, -1);
            return;
          case 'Home':
            focusNextTick(siblings[0]);
            return;
          case 'End':
            focusNextTick(siblings[siblings.length - 1]);
            return;
          case 'ArrowLeft':
            setOpenGroupId(null);
            focusNextTick(document.getElementById(groupId));
            return;
        }
      }
    },
    [rootRef, items, setOpenIndex, setOpenGroupId, mapArrow, subSelectors]
  );
}
