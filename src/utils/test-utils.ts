import { expect } from 'vitest';

export function assertHTMLElement(el: Element | null): asserts el is HTMLElement {
  expect(el).not.toBeNull();
  expect(el).toBeInstanceOf(HTMLElement);
}
