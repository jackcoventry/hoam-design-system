import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  focusNextTick,
  getElementByDomId,
  moveInList,
  querySubItemVisibility,
} from '@/components/Navigation/helpers';
import { TOP_ARROW_FOCUS_ATTR, useKeyboardNav } from '@/hooks/useKeyboardNav';
import { KEYS } from '@/constants/keys';

vi.mock('@/components/Navigation/helpers', () => ({
  focusNextTick: vi.fn(),
  getElementByDomId: vi.fn(),
  moveInList: vi.fn(),
  querySubItemVisibility: vi.fn(),
}));

const mockedFocusNextTick = vi.mocked(focusNextTick);
const mockedGetElementByDomId = vi.mocked(getElementByDomId);
const mockedMoveInList = vi.mocked(moveInList);
const mockedQuerySubItemVisibility = vi.mocked(querySubItemVisibility);

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

type TestHarnessProps = {
  rootRef: React.MutableRefObject<HTMLElement | null>;
  items: NavItem[];
  setOpenIndex: (index: number | null) => void;
  setOpenGroupId: (id: string | null) => void;
  mapArrow: (key: string) => string;
  subSelectors: SubSelectors;
  onReady: (handler: ReturnType<typeof useKeyboardNav>) => void;
};

function TestHarness({
  rootRef,
  items,
  setOpenIndex,
  setOpenGroupId,
  mapArrow,
  subSelectors,
  onReady,
}: Readonly<TestHarnessProps>) {
  const handler = useKeyboardNav({
    rootRef,
    items,
    setOpenIndex,
    setOpenGroupId,
    mapArrow,
    subSelectors,
  });

  onReady(handler);

  return null;
}

function createKeyboardEvent(
  key: string,
  target: EventTarget | null
): {
  event: React.KeyboardEvent<HTMLElement>;
  preventDefault: ReturnType<typeof vi.fn>;
  stopPropagation: ReturnType<typeof vi.fn>;
} {
  const preventDefault = vi.fn();
  const stopPropagation = vi.fn();

  const event = {
    key,
    target,
    preventDefault,
    stopPropagation,
  } as unknown as React.KeyboardEvent<HTMLElement>;

  return { event, preventDefault, stopPropagation };
}

describe('useKeyboardNav', () => {
  const setOpenIndex = vi.fn();
  const setOpenGroupId = vi.fn();
  const mapArrow = vi.fn((key: string) => key);

  const subSelectors: SubSelectors = {
    subTriggersOnly: vi.fn(),
    subInteractive: vi.fn(),
    thirdList: vi.fn(),
  };

  const items: NavItem[] = [
    {
      id: 'shop',
      items: [{ id: 'group-a' }, { id: 'group-b' }],
    },
    {
      id: 'about',
    },
  ];

  let rootRef: React.MutableRefObject<HTMLElement | null>;
  let container: HTMLElement;
  let handler: ReturnType<typeof useKeyboardNav>;

  beforeEach(() => {
    vi.clearAllMocks();

    rootRef = { current: null };
    container = document.createElement('div');
    rootRef.current = container;

    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    render(
      <TestHarness
        rootRef={rootRef}
        items={items}
        setOpenIndex={setOpenIndex}
        setOpenGroupId={setOpenGroupId}
        mapArrow={mapArrow}
        subSelectors={subSelectors}
        onReady={(value) => {
          handler = value;
        }}
      />
    );
  });

  it('returns early when rootRef.current is null', () => {
    rootRef.current = null;

    const target = document.createElement('button');
    const { event, preventDefault, stopPropagation } = createKeyboardEvent(
      KEYS.ARROW_RIGHT,
      target
    );

    handler(event);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(stopPropagation).not.toHaveBeenCalled();
  });

  it('returns early when the mapped key is not handled', () => {
    const target = document.createElement('button');
    const { event, preventDefault, stopPropagation } = createKeyboardEvent('Tab', target);

    handler(event);

    expect(mapArrow).toHaveBeenCalledWith('Tab');
    expect(preventDefault).not.toHaveBeenCalled();
    expect(stopPropagation).not.toHaveBeenCalled();
  });

  it('returns early when the event target is not an HTMLElement', () => {
    const nonElementTarget = new EventTarget();
    const { event, preventDefault, stopPropagation } = createKeyboardEvent(
      KEYS.ARROW_RIGHT,
      nonElementTarget
    );

    handler(event);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(stopPropagation).not.toHaveBeenCalled();
  });

  it('prevents default and stops propagation for handled keys', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    mockedQuerySubItemVisibility.mockReturnValue([target]);

    const { event, preventDefault, stopPropagation } = createKeyboardEvent(KEYS.HOME, target);

    handler(event);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('moves right through top cyclable items', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    const topItems = [target, document.createElement('button')];
    mockedQuerySubItemVisibility.mockReturnValue(topItems);

    const { event } = createKeyboardEvent(KEYS.ARROW_RIGHT, target);

    handler(event);

    expect(mockedQuerySubItemVisibility).toHaveBeenCalledWith(container, '[data-top-cyclable]');
    expect(mockedMoveInList).toHaveBeenCalledWith(topItems, target, 1, expect.any(Function));
  });

  it('moves left through top cyclable items', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    const topItems = [document.createElement('button'), target];
    mockedQuerySubItemVisibility.mockReturnValue(topItems);

    const { event } = createKeyboardEvent(KEYS.ARROW_LEFT, target);

    handler(event);

    expect(mockedMoveInList).toHaveBeenCalledWith(topItems, target, -1, expect.any(Function));
  });

  it('marks top cyclable arrow destinations before moving focus', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    const next = document.createElement('button');
    const topItems = [target, next];
    mockedQuerySubItemVisibility.mockReturnValue(topItems);

    const { event } = createKeyboardEvent(KEYS.ARROW_RIGHT, target);

    handler(event);

    const markDestination = mockedMoveInList.mock.calls[0]?.[3];
    const setAttributeSpy = vi.spyOn(next, 'setAttribute');
    markDestination?.(next);

    expect(setAttributeSpy).toHaveBeenCalledWith(TOP_ARROW_FOCUS_ATTR, 'true');
  });

  it('focuses the first top cyclable item on HOME', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    const first = document.createElement('button');
    const second = document.createElement('button');
    mockedQuerySubItemVisibility.mockReturnValue([first, second]);

    const { event } = createKeyboardEvent(KEYS.HOME, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(first);
  });

  it('focuses the last top cyclable item on END', () => {
    const target = document.createElement('button');
    target.dataset.topCyclable = '';

    const first = document.createElement('button');
    const last = document.createElement('button');
    mockedQuerySubItemVisibility.mockReturnValue([first, last]);

    const { event } = createKeyboardEvent(KEYS.END, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(last);
  });

  it('opens a top trigger on ARROW_DOWN and focuses the first sub trigger', () => {
    const target = document.createElement('button');
    target.id = 'trigger-shop';
    target.dataset.topCyclable = '';
    target.dataset.topTrigger = '';

    const panel = document.createElement('div');
    panel.id = 'panel-shop';
    container.append(panel);

    const firstSubTrigger = document.createElement('button');
    mockedGetElementByDomId.mockReturnValue(panel);

    mockedQuerySubItemVisibility.mockImplementation((root, selector) => {
      if (root === container && selector === '[data-top-cyclable]') {
        return [target];
      }

      if (root === panel && selector === '[data-sub-trigger]') {
        return [firstSubTrigger];
      }

      return [];
    });

    const focusSpy = vi.spyOn(firstSubTrigger, 'focus').mockImplementation(() => {});

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    handler(event);

    expect(setOpenIndex).toHaveBeenCalledWith(0);
    expect(setOpenGroupId).toHaveBeenCalledWith('group-a');
    expect(mockedGetElementByDomId).toHaveBeenCalledWith(container, 'panel-shop');
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('opens a Shopify GID top trigger without using the id as a selector', () => {
    const shopifyId = 'gid://shopify/Metaobject/325111382387';
    let localHandler: ReturnType<typeof useKeyboardNav> | undefined;
    const localRootRef: React.MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    render(
      <TestHarness
        rootRef={localRootRef}
        items={[
          {
            id: shopifyId,
            items: [{ id: 'coffee-group' }],
          },
        ]}
        setOpenIndex={setOpenIndex}
        setOpenGroupId={setOpenGroupId}
        mapArrow={mapArrow}
        subSelectors={subSelectors}
        onReady={(value) => {
          localHandler = value;
        }}
      />
    );

    const target = document.createElement('button');
    target.id = `trigger-${shopifyId}`;
    target.dataset.topCyclable = '';
    target.dataset.topTrigger = '';

    const panel = document.createElement('div');
    panel.id = `panel-${shopifyId}`;
    localRootRef.current?.append(panel);

    const firstSubTrigger = document.createElement('button');
    const focusSpy = vi.spyOn(firstSubTrigger, 'focus').mockImplementation(() => {});

    mockedGetElementByDomId.mockReturnValue(panel);
    mockedQuerySubItemVisibility.mockImplementation((root, selector) => {
      if (root === localRootRef.current && selector === '[data-top-cyclable]') {
        return [target];
      }

      if (root === panel && selector === '[data-sub-trigger]') {
        return [firstSubTrigger];
      }

      return [];
    });

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    localHandler?.(event);

    expect(setOpenIndex).toHaveBeenCalledWith(0);
    expect(setOpenGroupId).toHaveBeenCalledWith('coffee-group');
    expect(mockedGetElementByDomId).toHaveBeenCalledWith(
      localRootRef.current,
      `panel-${shopifyId}`
    );
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does not open a top trigger on ARROW_DOWN when the item has no children', () => {
    const target = document.createElement('button');
    target.id = 'trigger-about';
    target.dataset.topCyclable = '';
    target.dataset.topTrigger = '';

    mockedQuerySubItemVisibility.mockReturnValue([target]);

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    handler(event);

    expect(setOpenIndex).not.toHaveBeenCalled();
    expect(setOpenGroupId).not.toHaveBeenCalled();
  });

  it('moves down through sub triggers', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';
    panel.append(target);

    const sibling = document.createElement('button');
    panel.append(sibling);

    container.append(panel);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([target, sibling]);
    vi.mocked(subSelectors.subInteractive).mockReturnValue([target, sibling]);

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    handler(event);

    expect(subSelectors.subInteractive).toHaveBeenCalledWith(panel);
    expect(mockedMoveInList).toHaveBeenCalledWith([target, sibling], target, 1);
  });

  it('moves up through sub triggers', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const previous = document.createElement('button');
    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';

    panel.append(previous, target);
    container.append(panel);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([previous, target]);
    vi.mocked(subSelectors.subInteractive).mockReturnValue([previous, target]);

    const { event } = createKeyboardEvent(KEYS.ARROW_UP, target);

    handler(event);

    expect(mockedMoveInList).toHaveBeenCalledWith([previous, target], target, -1);
  });

  it('focuses the first sub trigger on HOME', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';

    const first = document.createElement('button');

    panel.append(target);
    container.append(panel);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([first, target]);
    vi.mocked(subSelectors.subInteractive).mockReturnValue([first, target]);

    const { event } = createKeyboardEvent(KEYS.HOME, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(first);
  });

  it('focuses the last sub trigger on END', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';

    const last = document.createElement('button');

    panel.append(target);
    container.append(panel);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([target, last]);
    vi.mocked(subSelectors.subInteractive).mockReturnValue([target, last]);

    const { event } = createKeyboardEvent(KEYS.END, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(last);
  });

  it('moves from the last sub trigger to the panel promo on ARROW_DOWN', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';

    const promo = document.createElement('a');
    promo.dataset.panelPromo = '';

    panel.append(target, promo);
    container.append(panel);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([target]);
    vi.mocked(subSelectors.subInteractive).mockReturnValue([target, promo]);

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    handler(event);

    expect(mockedMoveInList).toHaveBeenCalledWith([target, promo], target, 1);
  });

  it('moves from the panel promo through panel interactive items', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const trigger = document.createElement('button');
    trigger.dataset.subTrigger = '';

    const target = document.createElement('a');
    target.dataset.panelPromo = '';

    panel.append(trigger, target);
    container.append(panel);

    vi.mocked(subSelectors.subInteractive).mockReturnValue([trigger, target]);

    const { event } = createKeyboardEvent(KEYS.ARROW_UP, target);

    handler(event);

    expect(mockedMoveInList).toHaveBeenCalledWith([trigger, target], target, -1);
  });

  it('focuses the parent panel trigger from a sub trigger on ARROW_LEFT', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';
    panel.setAttribute('aria-labelledby', 'trigger-shop');

    const trigger = document.createElement('button');
    trigger.id = 'trigger-shop';
    container.append(trigger, panel);

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';
    panel.append(target);

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([target]);
    mockedGetElementByDomId.mockReturnValue(trigger);

    const { event } = createKeyboardEvent(KEYS.ARROW_LEFT, target);

    handler(event);

    expect(mockedGetElementByDomId).toHaveBeenCalledWith(container, 'trigger-shop');
    expect(mockedFocusNextTick).toHaveBeenCalledWith(trigger);
  });

  it('opens a sub trigger on ARROW_RIGHT and focuses the first third-level item', () => {
    const panel = document.createElement('div');
    panel.id = 'panel-shop';

    const target = document.createElement('button');
    target.id = 'group-group-a';
    target.dataset.subTrigger = '';
    panel.append(target);

    container.append(panel);

    const thirdItem = document.createElement('a');
    const focusSpy = vi.spyOn(thirdItem, 'focus').mockImplementation(() => {});

    vi.mocked(subSelectors.subTriggersOnly).mockReturnValue([target]);
    vi.mocked(subSelectors.thirdList).mockReturnValue([thirdItem]);

    const { event } = createKeyboardEvent(KEYS.ARROW_RIGHT, target);

    handler(event);

    expect(setOpenGroupId).toHaveBeenCalledWith('group-a');
    expect(subSelectors.thirdList).toHaveBeenCalledWith(container, target.id);
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('moves down through third-level links', () => {
    const panel = document.createElement('div');
    panel.id = 'group-a-panel';

    const target = document.createElement('a');
    target.dataset.subLink = '';
    panel.append(target);

    container.append(panel);

    const sibling = document.createElement('a');
    vi.mocked(subSelectors.thirdList).mockReturnValue([target, sibling]);

    const { event } = createKeyboardEvent(KEYS.ARROW_DOWN, target);

    handler(event);

    expect(subSelectors.thirdList).toHaveBeenCalledWith(container, 'group-a');
    expect(mockedMoveInList).toHaveBeenCalledWith([target, sibling], target, 1);
  });

  it('moves up through third-level links', () => {
    const panel = document.createElement('div');
    panel.id = 'group-a-panel';

    const previous = document.createElement('a');
    const target = document.createElement('a');
    target.dataset.subLink = '';
    panel.append(target);

    container.append(panel);

    vi.mocked(subSelectors.thirdList).mockReturnValue([previous, target]);

    const { event } = createKeyboardEvent(KEYS.ARROW_UP, target);

    handler(event);

    expect(mockedMoveInList).toHaveBeenCalledWith([previous, target], target, -1);
  });

  it('focuses the first third-level link on HOME', () => {
    const panel = document.createElement('div');
    panel.id = 'group-a-panel';

    const first = document.createElement('a');
    const target = document.createElement('a');
    target.dataset.subLink = '';

    panel.append(target);
    container.append(panel);

    vi.mocked(subSelectors.thirdList).mockReturnValue([first, target]);

    const { event } = createKeyboardEvent(KEYS.HOME, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(first);
  });

  it('focuses the last third-level link on END', () => {
    const panel = document.createElement('div');
    panel.id = 'group-a-panel';

    const target = document.createElement('a');
    target.dataset.subLink = '';
    const last = document.createElement('a');

    panel.append(target);
    container.append(panel);

    vi.mocked(subSelectors.thirdList).mockReturnValue([target, last]);

    const { event } = createKeyboardEvent(KEYS.END, target);

    handler(event);

    expect(mockedFocusNextTick).toHaveBeenCalledWith(last);
  });

  it('closes the third-level panel and focuses the parent group trigger on ARROW_LEFT', () => {
    const panel = document.createElement('div');
    panel.id = 'group-a-panel';

    const target = document.createElement('a');
    target.dataset.subLink = '';
    panel.append(target);

    const groupTrigger = document.createElement('button');
    groupTrigger.id = 'group-a';
    document.body.append(groupTrigger);

    container.append(panel);

    const { event } = createKeyboardEvent(KEYS.ARROW_LEFT, target);

    handler(event);

    expect(setOpenGroupId).toHaveBeenCalledWith(null);
    expect(mockedFocusNextTick).toHaveBeenCalledWith(groupTrigger);

    groupTrigger.remove();
  });
});
