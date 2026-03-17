import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';

describe('BadgeListItem', () => {
  it('renders a span by default', () => {
    render(<BadgeListItem>News</BadgeListItem>);

    const item = screen.getByText('News');

    expect(item.tagName).toBe('SPAN');
    expect(item).toHaveAttribute('data-theme', 'default');
  });

  it('renders an anchor when href is provided', () => {
    render(<BadgeListItem href="/blog">Blog</BadgeListItem>);

    const item = screen.getByRole('link', { name: 'Blog' });

    expect(item).toHaveAttribute('href', '/blog');
    expect(item).toHaveAttribute('data-theme', 'default');
  });

  it('renders the alert theme when provided', () => {
    render(<BadgeListItem theme="alert">Warning</BadgeListItem>);

    expect(screen.getByText('Warning')).toHaveAttribute('data-theme', 'alert');
  });

  it('renders nothing when children are missing', () => {
    const { container } = render(<BadgeListItem />);

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
        <BadgeListItem>One</BadgeListItem>
        <BadgeListItem href="/two">Two</BadgeListItem>
      </BadgeList>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Two' })).toBeInTheDocument();
  });

  it('filters invalid children and logs an error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BadgeList>
        <BadgeListItem>Valid</BadgeListItem>
        <div>Invalid</div>
        Plain text
      </BadgeList>
    );

    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    expect(screen.queryByText('Plain text')).not.toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'BadgeList component only accepts children of type BadgeListItem'
    );
  });

  it('renders an empty wrapper when no children are provided', () => {
    const { container } = render(<BadgeList />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
