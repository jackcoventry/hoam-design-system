import {
  focusNextTick,
  groupBtnId,
  groupPanelId,
  isVisible,
  moveInList,
  panelId,
  querySubItemVisibility,
  topTriggerId,
  wrapIndex,
} from '@/components/Navigation/helpers';

function createElement(tag = 'button'): HTMLElement {
  const el = document.createElement(tag);

  Object.defineProperty(el, 'offsetWidth', {
    configurable: true,
    get: () => 100,
  });

  Object.defineProperty(el, 'offsetHeight', {
    configurable: true,
    get: () => 20,
  });

  return el;
}

function makeVisible(el: HTMLElement) {
  Object.defineProperty(el, 'offsetWidth', {
    configurable: true,
    get: () => 100,
  });

  Object.defineProperty(el, 'offsetHeight', {
    configurable: true,
    get: () => 20,
  });
}

function createFocusableButton(id: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.textContent = id;
  return el;
}

describe('navigation helpers', () => {
  describe('isVisible', () => {
    it('returns true for a normal visible element', () => {
      const el = createElement();

      expect(isVisible(el)).toBe(true);
    });

    it('returns false when an ancestor is hidden', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('hidden', '');

      const el = createElement();
      wrapper.appendChild(el);
      document.body.appendChild(wrapper);

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when display is none', () => {
      const el = createElement();
      el.style.display = 'none';

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when visibility is hidden', () => {
      const el = createElement();
      el.style.visibility = 'hidden';

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when tabIndex is -1', () => {
      const el = createElement();
      el.tabIndex = -1;

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when offsetWidth is 0', () => {
      const el = createElement();

      Object.defineProperty(el, 'offsetWidth', {
        configurable: true,
        get: () => 0,
      });

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when offsetHeight is 0', () => {
      const el = createElement();

      Object.defineProperty(el, 'offsetHeight', {
        configurable: true,
        get: () => 0,
      });

      expect(isVisible(el)).toBe(false);
    });

    it('returns false when both offsetWidth and offsetHeight are 0', () => {
      const el = createElement();

      Object.defineProperty(el, 'offsetWidth', {
        configurable: true,
        get: () => 0,
      });

      Object.defineProperty(el, 'offsetHeight', {
        configurable: true,
        get: () => 0,
      });

      expect(isVisible(el)).toBe(false);
    });
  });

  describe('querySubItemVisibility', () => {
    it('returns only visible matching elements from an Element root', () => {
      const root = document.createElement('div');

      const visible = document.createElement('button');
      visible.dataset.subTrigger = '';
      makeVisible(visible);

      const hidden = document.createElement('button');
      hidden.dataset.subTrigger = '';
      hidden.tabIndex = -1;
      makeVisible(hidden);

      root.appendChild(visible);
      root.appendChild(hidden);

      const result = querySubItemVisibility<HTMLButtonElement>(root, '[data-sub-trigger]');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(visible);
    });

    it('returns only visible matching elements from a Document root', () => {
      const visible = document.createElement('a');
      visible.dataset.subLink = '';
      makeVisible(visible);

      const hidden = document.createElement('a');
      hidden.dataset.subLink = '';
      hidden.style.display = 'none';
      makeVisible(hidden);

      document.body.appendChild(visible);
      document.body.appendChild(hidden);

      const result = querySubItemVisibility<HTMLAnchorElement>(document, '[data-sub-link]');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(visible);
    });

    it('returns an empty array when nothing matches', () => {
      const root = document.createElement('div');

      const result = querySubItemVisibility<HTMLElement>(root, '[data-sub-trigger]');

      expect(result).toEqual([]);
    });
  });

  describe('focusNextTick', () => {
    it('does nothing when no element is provided', () => {
      const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');

      focusNextTick(undefined);
      focusNextTick(null);

      expect(rafSpy).not.toHaveBeenCalled();

      rafSpy.mockRestore();
    });

    it('focuses the element on the next animation frame', () => {
      const el = document.createElement('button');
      const focusSpy = vi.spyOn(el, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      focusNextTick(el);

      expect(rafSpy).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });
  });

  describe('wrapIndex', () => {
    it('wraps a positive overflow index', () => {
      expect(wrapIndex(5, 4)).toBe(1);
    });

    it('wraps a negative index', () => {
      expect(wrapIndex(-1, 4)).toBe(3);
    });

    it('returns the same index when already in range', () => {
      expect(wrapIndex(2, 4)).toBe(2);
    });

    it('wraps large negative values', () => {
      expect(wrapIndex(-5, 4)).toBe(3);
    });

    it('wraps large positive values', () => {
      expect(wrapIndex(10, 4)).toBe(2);
    });
  });

  describe('moveInList', () => {
    it('does nothing when the list is empty', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

      moveInList([], document.createElement('button'), 1);

      expect(rafSpy).not.toHaveBeenCalled();

      rafSpy.mockRestore();
    });

    it('moves focus to the next item', () => {
      const one = createFocusableButton('one');
      const two = createFocusableButton('two');
      const three = createFocusableButton('three');

      const focusSpy = vi.spyOn(two, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      moveInList([one, two, three], one, 1);

      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });

    it('moves focus to the previous item', () => {
      const one = createFocusableButton('one');
      const two = createFocusableButton('two');
      const three = createFocusableButton('three');

      const focusSpy = vi.spyOn(one, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      moveInList([one, two, three], two, -1);

      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });

    it('wraps to the start when moving forward from the end', () => {
      const one = createFocusableButton('one');
      const two = createFocusableButton('two');
      const three = createFocusableButton('three');

      const focusSpy = vi.spyOn(one, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      moveInList([one, two, three], three, 1);

      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });

    it('wraps to the end when moving backward from the start', () => {
      const one = createFocusableButton('one');
      const two = createFocusableButton('two');
      const three = createFocusableButton('three');

      const focusSpy = vi.spyOn(three, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      moveInList([one, two, three], one, -1);

      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });

    it('falls back to index 0 when current element is not in the list', () => {
      const one = createFocusableButton('one');
      const two = createFocusableButton('two');
      const outsider = createFocusableButton('outsider');

      const focusSpy = vi.spyOn(two, 'focus');
      const rafSpy = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 1;
        });

      moveInList([one, two], outsider, 1);

      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
      rafSpy.mockRestore();
    });
  });

  describe('id helpers', () => {
    it('builds top trigger ids', () => {
      expect(topTriggerId('shop')).toBe('trigger-shop');
    });

    it('builds panel ids', () => {
      expect(panelId('shop')).toBe('panel-shop');
    });

    it('builds group button ids', () => {
      expect(groupBtnId('featured')).toBe('group-featured');
    });

    it('builds group panel ids', () => {
      expect(groupPanelId('featured')).toBe('group-featured-panel');
    });
  });
});
