import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';
import { render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  // Ensure a clean DOM between tests
  document.body.innerHTML = '';

  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 1 as unknown as number;
  };
});

function mockContainerWidth(container: Element, px: number) {
  Object.defineProperty(container, 'clientWidth', {
    configurable: true,
    get: () => px,
  });
}

function mockRailScrollWidth(rail: Element, perSequenceWidth: number) {
  Object.defineProperty(rail, 'scrollWidth', {
    configurable: true,
    get: () => {
      // Count how many sequences are currently rendered inside the rail
      const sequences = (rail as HTMLElement).querySelectorAll(
        '.hoam-logo-carousel__sequence'
      ).length;
      return sequences * perSequenceWidth;
    },
  });
}

function forceAllImagesLoaded(root: HTMLElement) {
  const imgs = root.querySelectorAll('img');
  imgs.forEach((img) => {
    // Mark as complete for the component's logic
    Object.defineProperty(img, 'complete', { configurable: true, value: true });
    img.dispatchEvent(new Event('load'));
  });
}

const sampleItems = [
  { id: 1, src: '/a.svg', alt: 'A' },
  { id: 2, src: '/b.svg', alt: 'B' },
  { id: 3, src: '/c.svg', alt: 'C' },
];

describe('LogoCarousel', () => {
  it('renders the initial sequence of logos with accessible alts', () => {
    render(
      <LogoCarousel
        items={sampleItems}
        ariaLabel="Partners"
      />
    );
    const list = screen.getAllByRole('list')[0];
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(sampleItems.length);
    sampleItems.forEach(({ alt }) => {
      expect(screen.getAllByAltText(alt)[0]).toBeInTheDocument();
    });
  });

  it('applies pause attribute when pauseOnHover=true', () => {
    render(
      <LogoCarousel
        items={sampleItems}
        pauseOnHover
        ariaLabel="Partners"
      />
    );
    const container = screen.getByLabelText('Partners');
    expect(container).toHaveAttribute('data-pause', 'true');
  });

  it('starts with two sequences and clones are aria-hidden', () => {
    render(
      <LogoCarousel
        items={sampleItems}
        ariaLabel="Partners"
      />
    );
    const rail = document.querySelector('.hoam-logo-carousel__rail');
    const sequences = rail.querySelectorAll('.hoam-logo-carousel__sequence');
    expect(sequences.length).toBeGreaterThanOrEqual(2);
    // Only the first sequence is exposed to screen readers; clones are aria-hidden
    expect(sequences[0].getAttribute('aria-hidden')).toBeNull();
    for (let i = 1; i < sequences.length; i++) {
      expect(sequences[i].getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('duplicates sequences until the rail is at least 2x the container width', async () => {
    render(
      <LogoCarousel
        items={sampleItems}
        ariaLabel="Logos"
      />
    );
    const container = screen.getByLabelText('Logos');
    const rail = container.querySelector('.hoam-logo-carousel__rail');

    // Force a large container so two sequences are not enough
    mockContainerWidth(container, 1000); // container width = 1000px
    mockRailScrollWidth(rail, 300); // each sequence is around 300px

    // Simulate images loaded so effect runs its measurement logic
    forceAllImagesLoaded(container);

    await waitFor(() => {
      const sequences = rail.querySelectorAll('.hoam-logo-carousel__sequence').length;
      // Needs at least ceil((2*1000)/300) = 7 sequences to satisfy rail >= 2000px
      expect(sequences).toBeGreaterThanOrEqual(7);
    });
  });

  it('keeps minimal repeats when one sequence is already wide enough', async () => {
    render(
      <LogoCarousel
        items={sampleItems}
        ariaLabel="Wide Logos"
      />
    );
    const container = screen.getByLabelText('Wide Logos');
    const rail = container.querySelector('.hoam-logo-carousel__rail');

    mockContainerWidth(container, 800); // container width = 800px
    mockRailScrollWidth(rail, /* per-sequence */ 2000); // sequence already > 2× container

    forceAllImagesLoaded(container);

    await waitFor(() => {
      const sequences = rail.querySelectorAll('.hoam-logo-carousel__sequence').length;
      // Should remain the initial 2 rails, no need to add more
      expect(sequences).toBe(2);
    });
  });

  it('list items in clones are not announced', async () => {
    render(
      <LogoCarousel
        items={sampleItems}
        ariaLabel="Screen reader Check"
      />
    );
    const container = screen.getByLabelText('Screen reader Check');
    const rail = container.querySelector('.hoam-logo-carousel__rail');

    mockContainerWidth(container, 1000);
    mockRailScrollWidth(rail, 500);
    forceAllImagesLoaded(container);

    await waitFor(() => {
      const sequences = Array.from(rail.querySelectorAll('.hoam-logo-carousel__sequence'));
      expect(sequences.length).toBeGreaterThanOrEqual(2);
      // Verify aria-hidden on all but the first
      sequences.slice(1).forEach((seq) => {
        expect(seq).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  it('renders the title if specified', () => {
    render(
      <LogoCarousel
        items={sampleItems}
        title="As featured in"
      />
    );
    expect(screen.getByRole('heading', { level: 2, name: /As featured in/i })).toBeInTheDocument();
  });

  it('does not render the title if not specified', () => {
    render(<LogoCarousel items={sampleItems} />);
    expect(
      screen.getByRole('heading', { level: 2, name: /As featured in/i })
    ).not.toBeInTheDocument();
  });
});
