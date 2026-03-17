import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InfoGrid, InfoGridItem } from '@/components/InfoGrid';

describe('InfoGrid', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title', () => {
    render(
      <InfoGrid title="Why choose us">
        <InfoGridItem
          title="Fast delivery"
          description="Quick shipping."
          icon="truck"
        />
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Why choose us' })).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <InfoGrid
        title="Why choose us"
        description="Three reasons customers love us."
      >
        <InfoGridItem
          title="Fast delivery"
          description="Quick shipping."
          icon="truck"
        />
      </InfoGrid>
    );

    expect(screen.getByText('Three reasons customers love us.')).toBeInTheDocument();
  });

  it('renders valid InfoGridItem children', () => {
    render(
      <InfoGrid title="Why choose us">
        <InfoGridItem
          title="Fast delivery"
          description="Quick shipping."
          icon="truck"
        />
        <InfoGridItem
          title="Secure checkout"
          description="Safe payments."
          icon="lock"
        />
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Fast delivery' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Secure checkout' })).toBeInTheDocument();
  });

  it('renders only the first three valid children', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <InfoGrid title="Why choose us">
        <InfoGridItem
          title="One"
          description="First"
          icon="one"
        />
        <InfoGridItem
          title="Two"
          description="Second"
          icon="two"
        />
        <InfoGridItem
          title="Three"
          description="Third"
          icon="three"
        />
        <InfoGridItem
          title="Four"
          description="Fourth"
          icon="four"
        />
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Two' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Three' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: 'Four' })).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('filters invalid children and logs an error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <InfoGrid title="Why choose us">
        <InfoGridItem
          title="Fast delivery"
          description="Quick shipping."
          icon="truck"
        />
        <div>Invalid child</div>
        Plain text
      </InfoGrid>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Fast delivery' })).toBeInTheDocument();
    expect(screen.queryByText('Invalid child')).not.toBeInTheDocument();
    expect(screen.queryByText('Plain text')).not.toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'InfoGrid component only accepts child of type InfoGridItem'
    );
  });

  it('logs an error for children beyond the maximum allowed', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <InfoGrid title="Why choose us">
        <InfoGridItem
          title="One"
          description="First"
          icon="one"
        />
        <InfoGridItem
          title="Two"
          description="Second"
          icon="two"
        />
        <InfoGridItem
          title="Three"
          description="Third"
          icon="three"
        />
        <InfoGridItem
          title="Four"
          description="Fourth"
          icon="four"
        />
      </InfoGrid>
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'InfoGrid component only accepts child of type InfoGridItem'
    );
  });
});
