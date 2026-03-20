import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode, RefObject } from 'react';
import { vi } from 'vitest';

import { useKeyboardNav } from '@/hooks/useKeyboardNav';

const mockFocusNextTick = vi.fn<(element: HTMLElement | null | undefined) => void>();
const mockMoveInList =
  vi.fn<(items: HTMLElement[], current: HTMLElement, direction: number) => void>();
const mockQuerySubItemVisibility =
  vi.fn<<T extends HTMLElement>(container: Element, selector: string) => T[]>();

vi.mock('@/components/Navigation/helpers', () => ({
  focusNextTick: (element: HTMLElement | null | undefined) => mockFocusNextTick(element),
  moveInList: (items: HTMLElement[], current: HTMLElement, direction: number) =>
    mockMoveInList(items, current, direction),
  querySubItemVisibility: (container: Element, selector: string) =>
    mockQuerySubItemVisibility(container, selector),
}));

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

type HarnessProps = {
  items: NavItem[];
  setOpenIndex?: (index: number | null) => void;
  setOpenGroupId?: (id: string | null) => void;
  mapArrow?: (key: string) => string;
  subSelectors?: SubSelectors;
  rootRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

function KeyboardNavHarness({
  items,
  setOpenIndex = vi.fn(),
  setOpenGroupId = vi.fn(),
  mapArrow = (key) => key,
  subSelectors = {
    subTriggersOnly: () => [],
    subInteractive: () => [],
    thirdList: () => [],
  },
  rootRef: externalRef,
  children,
}: Readonly<HarnessProps>) {
  const internalRef = createRef<HTMLDivElement>();
  const rootRef = externalRef ?? internalRef;

  const onKeyDown = useKeyboardNav({
    rootRef,
    items,
    setOpenIndex,
    setOpenGroupId,
    mapArrow,
    subSelectors,
  });

  return (
    <div
      ref={rootRef}
      role="menu"
      tabIndex={-1}
      onKeyDown={(event) => onKeyDown(event as ReactKeyboardEvent<HTMLElement>)}
      data-testid="nav-root"
    >
      {children}
    </div>
  );
}

describe('useKeyboardNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing when rootRef.current is null', async () => {
    const user = userEvent.setup();
    const rootRef = { current: null };
    const setOpenIndex = vi.fn();
    const setOpenGroupId = vi.fn();

    render(
      <KeyboardNavHarness
        rootRef={rootRef}
        items={[]}
        setOpenIndex={setOpenIndex}
        setOpenGroupId={setOpenGroupId}
      >
        <button type="button">Test</button>
      </KeyboardNavHarness>
    );

    await user.keyboard('{ArrowRight}');

    expect(mockMoveInList).not.toHaveBeenCalled();
    expect(setOpenIndex).not.toHaveBeenCalled();
    expect(setOpenGroupId).not.toHaveBeenCalled();
  });

  it('ignores keys that are not handled', () => {
    render(
      <KeyboardNavHarness items={[]}>
        <button
          type="button"
          data-top-cyclable
        >
          Top item
        </button>
      </KeyboardNavHarness>
    );

    const button = screen.getByRole('button', { name: 'Top item' });

    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    );

    expect(mockMoveInList).not.toHaveBeenCalled();
  });

  it('moves focus right among top-level cyclable items', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');

    mockQuerySubItemVisibility.mockReturnValue([first, second]);

    render(
      <KeyboardNavHarness items={[]}>
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
          data-top-trigger
        >
          Products
        </button>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    );

    expect(mockMoveInList).toHaveBeenCalledWith([first, second], trigger, 1);
  });

  it('moves focus left among top-level cyclable items', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');

    mockQuerySubItemVisibility.mockReturnValue([first, second]);

    render(
      <KeyboardNavHarness items={[]}>
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
          data-top-trigger
        >
          Products
        </button>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
    );

    expect(mockMoveInList).toHaveBeenCalledWith([first, second], trigger, -1);
  });

  it('focuses the first top-level item on Home', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');

    mockQuerySubItemVisibility.mockReturnValue([first, second]);

    render(
      <KeyboardNavHarness items={[]}>
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
        >
          Products
        </button>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })
    );

    expect(mockFocusNextTick).toHaveBeenCalledWith(first);
  });

  it('focuses the last top-level item on End', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');

    mockQuerySubItemVisibility.mockReturnValue([first, second]);

    render(
      <KeyboardNavHarness items={[]}>
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
        >
          Products
        </button>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true })
    );

    expect(mockFocusNextTick).toHaveBeenCalledWith(second);
  });

  it('opens a top-level panel and group on ArrowDown', () => {
    const firstSubTrigger = document.createElement('button');
    const setOpenIndex = vi.fn();
    const setOpenGroupId = vi.fn();

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    mockQuerySubItemVisibility.mockImplementation((_container, selector) => {
      if (selector === '[data-top-cyclable]') return [];
      if (selector === '[data-sub-trigger]') return [firstSubTrigger];
      if (selector === '[data-sub-trigger], [data-sub-link]') return [firstSubTrigger];
      return [];
    });

    render(
      <KeyboardNavHarness
        items={[
          {
            id: 'products',
            items: [{ id: 'coffee' }],
          },
        ]}
        setOpenIndex={setOpenIndex}
        setOpenGroupId={setOpenGroupId}
      >
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
          data-top-trigger
        >
          Products
        </button>
        <div id="panel-products" />
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    const focusSpy = vi.spyOn(firstSubTrigger, 'focus');

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    );

    expect(setOpenIndex).toHaveBeenCalledWith(0);
    expect(setOpenGroupId).toHaveBeenCalledWith('coffee');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('moves within sub-trigger categories on ArrowDown and ArrowUp', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');
    const subSelectors = {
      subTriggersOnly: vi.fn(() => [first, second]),
      subInteractive: vi.fn(() => []),
      thirdList: vi.fn(() => []),
    };

    render(
      <KeyboardNavHarness
        items={[]}
        subSelectors={subSelectors}
      >
        <div
          id="panel-products"
          aria-labelledby="trigger-products"
        >
          <button
            id="group-coffee"
            type="button"
            data-sub-trigger
          >
            Coffee
          </button>
        </div>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Coffee' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    );
    expect(mockMoveInList).toHaveBeenCalledWith([first, second], trigger, 1);

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    );
    expect(mockMoveInList).toHaveBeenCalledWith([first, second], trigger, -1);
  });

  it('returns focus to the panel trigger on ArrowLeft from a sub-trigger', () => {
    render(
      <KeyboardNavHarness items={[]}>
        <button
          id="trigger-products"
          type="button"
        >
          Products
        </button>
        <div
          id="panel-products"
          aria-labelledby="trigger-products"
        >
          <button
            id="group-coffee"
            type="button"
            data-sub-trigger
          >
            Coffee
          </button>
        </div>
      </KeyboardNavHarness>
    );

    const subTrigger = screen.getByRole('button', { name: 'Coffee' });
    const topTrigger = screen.getByRole('button', { name: 'Products' });

    subTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
    );

    expect(mockFocusNextTick).toHaveBeenCalledWith(topTrigger);
  });

  it('opens a group and focuses the first third-level item on ArrowRight from a sub-trigger', () => {
    const thirdItem = document.createElement('a');
    const setOpenGroupId = vi.fn();
    const subSelectors = {
      subTriggersOnly: vi.fn(() => []),
      subInteractive: vi.fn(() => []),
      thirdList: vi.fn(() => [thirdItem]),
    };

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const focusSpy = vi.spyOn(thirdItem, 'focus');

    render(
      <KeyboardNavHarness
        items={[]}
        setOpenGroupId={setOpenGroupId}
        subSelectors={subSelectors}
      >
        <div id="panel-products">
          <button
            id="group-coffee"
            type="button"
            data-sub-trigger
          >
            Coffee
          </button>
        </div>
      </KeyboardNavHarness>
    );

    const subTrigger = screen.getByRole('button', { name: 'Coffee' });

    subTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    );

    expect(setOpenGroupId).toHaveBeenCalledWith('coffee');
    expect(subSelectors.thirdList).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('moves among third-level links on ArrowDown and ArrowUp', () => {
    const first = document.createElement('a');
    const second = document.createElement('a');
    const subSelectors = {
      subTriggersOnly: vi.fn(() => []),
      subInteractive: vi.fn(() => []),
      thirdList: vi.fn(() => [first, second]),
    };

    render(
      <KeyboardNavHarness
        items={[]}
        subSelectors={subSelectors}
      >
        <div id="group-coffee-panel">
          <a
            href="/coffee"
            data-sub-link
          >
            Arabica
          </a>
        </div>
      </KeyboardNavHarness>
    );

    const link = screen.getByRole('link', { name: 'Arabica' });

    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    );
    expect(mockMoveInList).toHaveBeenCalledWith([first, second], link, 1);

    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    );
    expect(mockMoveInList).toHaveBeenCalledWith([first, second], link, -1);
  });

  it('closes the third-level group and focuses the parent trigger on ArrowLeft from a third-level link', () => {
    const setOpenGroupId = vi.fn();

    render(
      <KeyboardNavHarness
        items={[]}
        setOpenGroupId={setOpenGroupId}
      >
        <button
          id="group-coffee"
          type="button"
        >
          Coffee
        </button>
        <div id="group-coffee-panel">
          <a
            href="/coffee"
            data-sub-link
          >
            Arabica
          </a>
        </div>
      </KeyboardNavHarness>
    );

    const link = screen.getByRole('link', { name: 'Arabica' });
    const parentTrigger = screen.getByRole('button', { name: 'Coffee' });

    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
    );

    expect(setOpenGroupId).toHaveBeenCalledWith(null);
    expect(mockFocusNextTick).toHaveBeenCalledWith(parentTrigger);
  });

  it('uses mapArrow to normalize keys', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');

    mockQuerySubItemVisibility.mockReturnValue([first, second]);

    const mapArrow = vi.fn((key: string) => (key === 'ArrowRight' ? 'ArrowRight' : key));

    render(
      <KeyboardNavHarness
        items={[]}
        mapArrow={mapArrow}
      >
        <button
          id="trigger-products"
          type="button"
          data-top-cyclable
        >
          Products
        </button>
      </KeyboardNavHarness>
    );

    const trigger = screen.getByRole('button', { name: 'Products' });

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    );

    expect(mapArrow).toHaveBeenCalledWith('ArrowRight');
    expect(mockMoveInList).toHaveBeenCalledWith([first, second], trigger, 1);
  });
});
