import { act, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LogoCarousel } from '@/components/LogoCarousel/LogoCarousel';

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children }: { children: ReactNode; span?: number }) => (
    <div data-testid="grid-item">{children}</div>
  ),
  Section: ({
    children,
    className,
  }: {
    children: ReactNode;
    space?: string;
    className?: string;
  }) => (
    <section
      data-testid="section"
      className={className}
    >
      {children}
    </section>
  ),
  Stack: ({ children }: { children: ReactNode; gap?: string }) => (
    <div data-testid="stack">{children}</div>
  ),
}));

vi.mock('@/components/LogoCarousel/LogoCarousel.module.css', () => ({
  default: {
    root: 'root',
    wrapper: 'wrapper',
    content: 'content',
    title: 'title',
    rail: 'rail',
    sequence: 'sequence',
    sequenceClone: 'sequenceClone',
    item: 'item',
  },
}));

describe('LogoCarousel', () => {
  const items = [
    { id: 1, src: '/logos/a.svg', alt: 'Logo A' },
    { id: 2, src: '/logos/b.svg', alt: 'Logo B' },
    { id: 3, src: '/logos/c.svg', alt: 'Logo C' },
  ];

  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');
  const originalComplete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).classList.contains('wrapper')) {
          return 600;
        }

        return 0;
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).classList.contains('sequence')) {
          return 400;
        }

        return 0;
      },
    });

    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get() {
        return true;
      },
    });
  });

  afterEach(() => {
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    }

    if (originalScrollWidth) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
    }

    if (originalComplete) {
      Object.defineProperty(HTMLImageElement.prototype, 'complete', originalComplete);
    }

    vi.restoreAllMocks();
  });

  it('renders the title when provided', () => {
    render(
      <LogoCarousel
        title="Trusted by"
        items={items}
      />
    );

    expect(screen.getByRole('heading', { name: 'Trusted by' })).toBeInTheDocument();
  });

  it('does not render a heading when title is omitted', () => {
    render(<LogoCarousel items={items} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies the aria-label to the wrapper element when provided', () => {
    const { container } = render(
      <LogoCarousel
        items={items}
        aria-label="Partner logos"
      />
    );

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toHaveAttribute('aria-label', 'Partner logos');
  });

  it('does not set aria-label when it is omitted', () => {
    const { container } = render(<LogoCarousel items={items} />);

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).not.toHaveAttribute('aria-label');
  });

  it('sets data-pause to true by default', () => {
    const { container } = render(<LogoCarousel items={items} />);

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toHaveAttribute('data-pause', 'true');
  });

  it('sets data-pause to false when pauseOnHover is false', () => {
    const { container } = render(
      <LogoCarousel
        items={items}
        pauseOnHover={false}
      />
    );

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toHaveAttribute('data-pause', 'false');
  });

  it('renders at least two sequences initially', async () => {
    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('marks cloned sequences as aria-hidden', async () => {
    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = Array.from(container.querySelectorAll<HTMLUListElement>('.sequence'));
      expect(sequences.length).toBeGreaterThanOrEqual(2);

      expect(sequences[0]).not.toHaveAttribute('aria-hidden');

      for (const clone of sequences.slice(1)) {
        expect(clone).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });

  it('renders each logo image in each sequence', async () => {
    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences).toHaveLength(3);
    });

    const allImages = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    expect(allImages).toHaveLength(9);

    const logoAImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[alt="Logo A"]')
    );
    const logoBImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[alt="Logo B"]')
    );
    const logoCImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[alt="Logo C"]')
    );

    expect(logoAImages).toHaveLength(3);
    expect(logoBImages).toHaveLength(3);
    expect(logoCImages).toHaveLength(3);

    const firstImage = allImages[0];
    expect(firstImage).toHaveAttribute('src', '/logos/a.svg');
    expect(firstImage).toHaveAttribute('loading', 'eager');
    expect(firstImage).toHaveAttribute('decoding', 'async');
  });

  it('omits the alt attribute when alt is not provided', () => {
    const { container } = render(
      <LogoCarousel
        items={[
          { id: 1, src: '/logos/a.svg' },
          { id: 2, src: '/logos/b.svg' },
        ]}
      />
    );

    const images = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    expect(images.length).toBeGreaterThanOrEqual(2);

    expect(images[0]).not.toHaveAttribute('alt');
    expect(images[1]).not.toHaveAttribute('alt');
  });

  it('renders no images when items is empty', () => {
    const { container } = render(
      <LogoCarousel
        title="Trusted by"
        items={[]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Trusted by' })).toBeInTheDocument();
    expect(screen.queryAllByRole('img')).toHaveLength(0);

    const sequences = container.querySelectorAll('.sequence');
    expect(sequences).toHaveLength(2);
  });

  it('repeats enough times to cover twice the container width when all images are already complete', async () => {
    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences).toHaveLength(3);
    });
  });

  it('falls back to the minimum repeat count when container width is zero', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 0;
      },
    });

    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences).toHaveLength(2);
    });
  });

  it('falls back to the minimum repeat count when sequence width is zero', async () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 0;
      },
    });

    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences).toHaveLength(2);
    });
  });

  it('waits for the first-sequence images to load before recalculating repeat count', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get() {
        return false;
      },
    });

    const { container } = render(<LogoCarousel items={items} />);

    expect(container.querySelectorAll('.sequence')).toHaveLength(2);

    const images = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    expect(images).toHaveLength(6);

    act(() => {
      images.slice(0, 2).forEach((image) => {
        image.dispatchEvent(new Event('load'));
      });
    });

    expect(container.querySelectorAll('.sequence')).toHaveLength(2);

    act(() => {
      images[2]?.dispatchEvent(new Event('load'));
    });

    await waitFor(() => {
      expect(container.querySelectorAll('.sequence')).toHaveLength(3);
    });
  });

  it('treats image errors as ready events when recalculating repeat count', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get() {
        return false;
      },
    });

    const { container } = render(<LogoCarousel items={items} />);

    const images = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    expect(images).toHaveLength(6);

    act(() => {
      images.slice(0, 3).forEach((image) => {
        image.dispatchEvent(new Event('error'));
      });
    });

    await waitFor(() => {
      expect(container.querySelectorAll('.sequence')).toHaveLength(3);
    });
  });

  it('removes load and error listeners on unmount for incomplete images', () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get() {
        return false;
      },
    });

    const addEventListenerSpy = vi.spyOn(HTMLImageElement.prototype, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(HTMLImageElement.prototype, 'removeEventListener');

    const { unmount } = render(<LogoCarousel items={items} />);

    expect(addEventListenerSpy).toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();

    const loadRemovals = removeEventListenerSpy.mock.calls.filter(([type]) => type === 'load');
    const errorRemovals = removeEventListenerSpy.mock.calls.filter(([type]) => type === 'error');

    expect(loadRemovals.length).toBeGreaterThan(0);
    expect(errorRemovals.length).toBeGreaterThan(0);
  });

  it('reruns measurement when items change', async () => {
    const { container, rerender } = render(
      <LogoCarousel items={[{ id: 1, src: '/logos/a.svg', alt: 'Logo A' }]} />
    );

    await waitFor(() => {
      expect(container.querySelectorAll('.sequence')).toHaveLength(3);
    });

    rerender(
      <LogoCarousel
        items={[
          { id: 1, src: '/logos/a.svg', alt: 'Logo A' },
          { id: 2, src: '/logos/b.svg', alt: 'Logo B' },
        ]}
      />
    );

    await waitFor(() => {
      const sequences = container.querySelectorAll('.sequence');
      expect(sequences.length).toBeGreaterThanOrEqual(2);
    });
  });
});
