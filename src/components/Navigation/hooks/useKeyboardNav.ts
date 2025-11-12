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
      const isTopTrigger = (el: HTMLElement) => el.matches('[data-top-trigger]');
      const isTopCyclable = (el: HTMLElement) => el.matches('[data-top-cyclable]');
      const topItems = querySubItemVisibility<HTMLElement>(container, '[data-top-cyclable]');
      const isSubTrigger = target.matches('[data-sub-trigger]');
      const isThirdLink = target.matches('[data-sub-link]');

      // Top level navigation
      if (isTopCyclable(target)) {
        switch (logicalKey) {
          case 'ArrowRight':
            moveInList(topItems, target, +1);
            return;
          case 'ArrowLeft':
            moveInList(topItems, target, -1);
            return;
          case 'Home':
            focusNextTick(topItems[0]);
            return;
          case 'End':
            focusNextTick(topItems[topItems.length - 1]);
            return;
          case 'ArrowDown': {
            // ArrowDown only opens if we're on a real top trigger (not logo/user)
            if (logicalKey === 'ArrowDown' && isTopTrigger(target)) {
              const triggerId = target.id; // "trigger-<id>"
              if (triggerId?.startsWith('trigger-')) {
                const rawId = triggerId.replace(/^trigger-/, '');
                const itemIdx = items.findIndex((i) => i.id === rawId);
                if (itemIdx >= 0 && items[itemIdx]?.items?.length) {
                  setOpenIndex(itemIdx);
                  const firstId = items[itemIdx]?.items?.[0]?.id;
                  setOpenGroupId(firstId ?? null);
                  requestAnimationFrame(() => {
                    const panelRoot =
                      container.querySelector<HTMLElement>(`#panel-${rawId}`) ?? container;
                    const firstCat =
                      querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger]')[0] ??
                      querySubItemVisibility<HTMLElement>(
                        panelRoot,
                        '[data-sub-trigger], [data-sub-link]'
                      )[0];
                    firstCat?.focus();
                  });
                }
              }
              return;
            }
          }
        }
      }

      // Second level navigation
      if (isSubTrigger) {
        const panelEl = target.closest('[id^="panel-"]');
        if (!panelEl) return;
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
          case 'ArrowLeft': {
            const panelEl = target.closest('[id^="panel-"]');
            const labelledBy = panelEl?.getAttribute('aria-labelledby');
            const trigger = labelledBy
              ? container.querySelector<HTMLElement>(`#${labelledBy}`)
              : null;
            if (trigger) focusNextTick(trigger);
            return;
          }
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
      if (isThirdLink) {
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
