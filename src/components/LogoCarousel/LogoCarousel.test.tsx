import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LogoCarousel } from '@/components/LogoCarousel';

const items = [
  { id: 1, src: '/logos/one.svg', alt: 'Logo One' },
  { id: 2, src: '/logos/two.svg' },
];

describe('LogoCarousel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get() {
        return true;
      },
    });

    Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 400;
      },
    });

    Object.defineProperty(HTMLUListElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 100;
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title when provided', () => {
    render(
      <LogoCarousel
        title="Trusted by"
        items={items}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Trusted by' })).toBeInTheDocument();
  });

  it('does not render a title when one is not provided', () => {
    render(<LogoCarousel items={items} />);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('renders the root with the provided aria-label', () => {
    render(
      <LogoCarousel
        items={items}
        ariaLabel="Partner logos"
      />
    );

    expect(screen.getByLabelText('Partner logos')).toBeInTheDocument();
  });

  it('sets data-pause to true by default', () => {
    render(<LogoCarousel items={items} />);

    const root = screen.getByRole('img', { name: 'Logo One' }).closest('[data-pause]');

    expect(root).toHaveAttribute('data-pause', 'true');
  });

  it('sets data-pause to false when pauseOnHover is false', () => {
    render(
      <LogoCarousel
        items={items}
        pauseOnHover={false}
      />
    );

    const root = screen.getByRole('img', { name: 'Logo One' }).closest('[data-pause]');

    expect(root).toHaveAttribute('data-pause', 'false');
  });

  it('uses a fallback alt when alt is not provided', () => {
    render(<LogoCarousel items={items} />);

    expect(screen.getByRole('img', { name: 'Logo 2' })).toBeInTheDocument();
  });

  it('renders additional cloned sequences when more repeats are needed', async () => {
    const { container } = render(<LogoCarousel items={items} />);

    await waitFor(() => {
      const sequences = container.querySelectorAll('ul');
      expect(sequences.length).toBeGreaterThan(2);
    });

    const sequences = container.querySelectorAll('ul');
    const hiddenSequences = container.querySelectorAll('ul[aria-hidden="true"]');

    expect(sequences.length).toBe(8);
    expect(hiddenSequences.length).toBe(7);
  });
});
