import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InfoGridItem } from '@/components/InfoGrid';

describe('InfoGridItem', () => {
  it('renders the title', () => {
    render(
      <InfoGridItem
        title="Fast delivery"
        description="Get your order quickly."
        icon="truck"
      />
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Fast delivery' })).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <InfoGridItem
        title="Fast delivery"
        description="Get your order quickly."
        icon="truck"
      />
    );

    expect(screen.getByText('Get your order quickly.')).toBeInTheDocument();
  });

  it('renders safely without a description', () => {
    render(
      <InfoGridItem
        title="Fast delivery"
        icon="truck"
      />
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Fast delivery' })).toBeInTheDocument();
  });
});
