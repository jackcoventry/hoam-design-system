import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InfoGrid, InfoGridItem } from '@/components/InfoGrid';
import { logger } from '@/utils/logger';

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
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});

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
    expect(warnSpy).toHaveBeenCalledWith(
      'InfoGrid component only accepts child of type InfoGridItem'
    );
  });

  it('filters invalid children and logs an error', () => {
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});

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
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it('logs an error for children beyond the maximum allowed', () => {
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});

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

    expect(warnSpy).toHaveBeenCalledWith(
      'InfoGrid component only accepts child of type InfoGridItem'
    );
  });
});
