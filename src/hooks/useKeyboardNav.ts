import { useCallback } from 'react';

import { focusNextTick, moveInList, querySubItemVisibility } from '@/components/Navigation/helpers';

type NavChildItem = {
  id: string;
};

type NavItem = {
  id: string;
  items?: NavChildItem[];
};

type SubSelectors = {
  subTriggersOnly: (panelRoot: Element) => HTMLElement[];
  subInteractive: (panelRoot: Element) => HTMLElement[];
  thirdList: (container: Element, groupBtnDomId: string) => HTMLElement[];
};

type UseKeyboardNavOptions = {
  rootRef: React.RefObject<HTMLElement | null>;
  items: NavItem[];
  setOpenIndex: (index: number | null) => void;
  setOpenGroupId: (id: string | null) => void;
  mapArrow: (key: string) => string;
  subSelectors: SubSelectors;
};

const HANDLED_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

function getRawId(value: string, prefix: string): string | null {
  return value.startsWith(prefix) ? value.slice(prefix.length) : null;
}

function focusFirst(items: HTMLElement[]) {
  focusNextTick(items[0]);
}

function focusLast(items: HTMLElement[]) {
  focusNextTick(items.at(-1));
}

function getPanelElement(el: HTMLElement): HTMLElement | null {
  return el.closest<HTMLElement>('[id^="panel-"]');
}

function getPanelTrigger(container: HTMLElement, panelEl: HTMLElement): HTMLElement | null {
  const labelledBy = panelEl.getAttribute('aria-labelledby');
  return labelledBy ? container.querySelector<HTMLElement>(`#${labelledBy}`) : null;
}

export function useKeyboardNav({
  rootRef,
  items,
  setOpenIndex,
  setOpenGroupId,
  mapArrow,
  subSelectors,
}: UseKeyboardNavOptions) {
  return useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const container = rootRef.current;
      if (!container) return;

      const logicalKey = mapArrow(event.key);
      if (!HANDLED_KEYS.has(logicalKey)) return;

      if (!isHTMLElement(event.target)) return;
      const target = event.target;

      event.preventDefault();
      event.stopPropagation();

      const isTopTrigger = target.matches('[data-top-trigger]');
      const isTopCyclable = target.matches('[data-top-cyclable]');
      const isSubTrigger = target.matches('[data-sub-trigger]');
      const isThirdLink = target.matches('[data-sub-link]');

      if (isTopCyclable) {
        const topItems = querySubItemVisibility<HTMLElement>(container, '[data-top-cyclable]');

        switch (logicalKey) {
          case 'ArrowRight':
            moveInList(topItems, target, 1);
            return;

          case 'ArrowLeft':
            moveInList(topItems, target, -1);
            return;

          case 'Home':
            focusFirst(topItems);
            return;

          case 'End':
            focusLast(topItems);
            return;

          case 'ArrowDown': {
            if (!isTopTrigger) return;

            const rawId = getRawId(target.id, 'trigger-');
            if (!rawId) return;

            const itemIndex = items.findIndex((item) => item.id === rawId);
            const item = itemIndex >= 0 ? items[itemIndex] : undefined;

            if (!item?.items?.length) return;

            setOpenIndex(itemIndex);
            setOpenGroupId(item?.items[0]?.id ?? null);

            requestAnimationFrame(() => {
              const panelRoot =
                container.querySelector<HTMLElement>(`#panel-${rawId}`) ?? container;

              const firstFocusable =
                querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger]')[0] ??
                querySubItemVisibility<HTMLElement>(
                  panelRoot,
                  '[data-sub-trigger], [data-sub-link]'
                )[0];

              firstFocusable?.focus();
            });

            return;
          }

          default:
            return;
        }
      }

      if (isSubTrigger) {
        const panelEl = getPanelElement(target);
        if (!panelEl) return;

        const categories = subSelectors.subTriggersOnly(panelEl);

        switch (logicalKey) {
          case 'ArrowDown':
            moveInList(categories, target, 1);
            return;

          case 'ArrowUp':
            moveInList(categories, target, -1);
            return;

          case 'Home':
            focusFirst(categories);
            return;

          case 'End':
            focusLast(categories);
            return;

          case 'ArrowLeft': {
            const trigger = getPanelTrigger(container, panelEl);
            if (trigger) focusNextTick(trigger);
            return;
          }

          case 'ArrowRight': {
            const rawGroupId = getRawId(target.id, 'group-');
            if (!rawGroupId) return;

            setOpenGroupId(rawGroupId);

            requestAnimationFrame(() => {
              const firstThirdLevelItem = subSelectors.thirdList(container, target.id)[0];
              firstThirdLevelItem?.focus();
            });

            return;
          }

          default:
            return;
        }
      }

      if (isThirdLink) {
        const listContainer = target.closest<HTMLElement>('[id$="-panel"]');
        const groupId = listContainer?.id.replace(/-panel$/, '') ?? null;
        if (!groupId) return;

        const siblings = subSelectors.thirdList(container, groupId);

        switch (logicalKey) {
          case 'ArrowDown':
            moveInList(siblings, target, 1);
            return;

          case 'ArrowUp':
            moveInList(siblings, target, -1);
            return;

          case 'Home':
            focusFirst(siblings);
            return;

          case 'End':
            focusLast(siblings);
            return;

          case 'ArrowLeft':
            setOpenGroupId(null);
            focusNextTick(document.getElementById(groupId));
            return;

          default:
            return;
        }
      }
    },
    [rootRef, items, setOpenIndex, setOpenGroupId, mapArrow, subSelectors]
  );
}
