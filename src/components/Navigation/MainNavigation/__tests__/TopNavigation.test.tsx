// TopNavigation.test.tsx
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TopNavigation } from '@/components/Navigation/MainNavigation/TopNavigation';
import { useMessages } from '@/hooks/useMessages';

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    list: 'list',
  },
}));

function createChildren(): ReactNode {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}

describe('TopNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMessages).mockReturnValue({
      mainNavigation: 'Main navigation',
    });
  });

  it('calls useMessages with the navigation namespace', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    expect(useMessages).toHaveBeenCalledTimes(1);
    expect(useMessages).toHaveBeenCalledWith('navigation');
  });

  it('renders a nav with the translated aria-label', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(nav).toBeInTheDocument();
  });

  it('renders a list inside the nav', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe('UL');
  });

  it('applies the list class to the ul', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('list');
  });

  it('renders children inside the list', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders multiple list items correctly', () => {
    render(<TopNavigation>{createChildren()}</TopNavigation>);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('renders arbitrary React children', () => {
    render(
      <TopNavigation>
        <li>
          <span>Nested item</span>
        </li>
      </TopNavigation>
    );

    expect(screen.getByText('Nested item')).toBeInTheDocument();
  });

  it('renders safely with no children', () => {
    render(<TopNavigation>{null}</TopNavigation>);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.childElementCount).toBe(0);
  });

  it('updates aria-label when translations change', () => {
    vi.mocked(useMessages).mockReturnValue({
      mainNavigation: 'Primary navigation',
    });

    render(<TopNavigation>{createChildren()}</TopNavigation>);

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
  });
});
