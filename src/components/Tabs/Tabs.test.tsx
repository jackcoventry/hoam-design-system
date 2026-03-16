import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from '@/components/Tabs';

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
}));

import { useMediaQuery } from '@/hooks/useMediaQuery';

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

const items = [
  {
    id: 'one',
    label: 'Tab One',
    content: <div>Panel One</div>,
  },
  {
    id: 'two',
    label: 'Tab Two',
    content: <div>Panel Two</div>,
  },
];

describe('Tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders accordion on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(true);

    render(
      <Tabs
        title="Example tabs"
        items={items}
      />
    );

    expect(screen.getByRole('button', { name: /tab one/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tab two/i })).toBeInTheDocument();

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('renders desktop tabs on desktop', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(
      <Tabs
        title="Example tabs"
        items={items}
      />
    );

    expect(screen.getByRole('tablist', { name: /example tabs/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab one/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab two/i })).toBeInTheDocument();
  });

  it('renders mobile accordion content structure', () => {
    mockedUseMediaQuery.mockReturnValue(true);

    render(
      <Tabs
        title="Example tabs"
        items={items}
      />
    );

    expect(screen.getByText('Panel One')).toBeInTheDocument();
    expect(screen.getByText('Panel Two')).toBeInTheDocument();
  });
});
