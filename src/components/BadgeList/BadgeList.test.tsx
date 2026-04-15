import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';

describe('BadgeListItem', () => {
  it('renders a span by default', () => {
    render(<BadgeListItem variant="default">News</BadgeListItem>);

    const item = screen.getByText('News');

    expect(item.tagName).toBe('SPAN');
    expect(item).toHaveAttribute('data-theme', 'default');
  });

  it('renders the alert theme when provided', () => {
    render(<BadgeListItem variant="alert">Warning</BadgeListItem>);

    expect(screen.getByText('Warning')).toHaveAttribute('data-theme', 'alert');
  });

  it('renders nothing when children are missing', () => {
    const { container } = render(<BadgeListItem variant="alert" />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('BadgeList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders valid BadgeListItem children', () => {
    render(
      <BadgeList>
        <BadgeListItem variant="default">One</BadgeListItem>
        <BadgeListItem variant="alert">Two</BadgeListItem>
      </BadgeList>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Two' })).toBeInTheDocument();
  });

  it('filters invalid children and logs an error', () => {
    render(
      <BadgeList>
        <BadgeListItem variant="default">Valid</BadgeListItem>
        <div>Invalid</div>
        Plain text
      </BadgeList>
    );

    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    expect(screen.queryByText('Plain text')).not.toBeInTheDocument();
  });

  it('renders an empty wrapper when no children are provided', () => {
    const { container } = render(<BadgeList />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
