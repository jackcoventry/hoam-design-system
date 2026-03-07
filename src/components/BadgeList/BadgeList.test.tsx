import { render, screen } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BadgeList, { BadgeListItem } from './BadgeList';

describe('BadgeList / BadgeListItem', () => {
  const originalError = console.error;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders only BadgeListItem children and ignores others (logging an error)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BadgeList>
        <BadgeListItem>One</BadgeListItem>
        <div>Two</div>
        <BadgeListItem>Three</BadgeListItem>
      </BadgeList>
    );

    // Valid items render
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();

    // Invalid child should not render
    expect(screen.queryByText('Two')).not.toBeInTheDocument();

    // Error is logged for the invalid child
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'BadgeList component only accepts child of type BadgeListItem'
    );
  });

  it('BadgeListItem renders a <span> by default with data-theme="default"', () => {
    render(
      <BadgeList>
        <BadgeListItem>Default Item</BadgeListItem>
      </BadgeList>
    );

    const el = screen.getByText('Default Item');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('hoam-badge-list__item');
    expect(el).toHaveAttribute('data-theme', 'default');
  });

  it('BadgeListItem renders an <a> when href is provided', () => {
    render(
      <BadgeList>
        <BadgeListItem href="https://example.com">Link Item</BadgeListItem>
      </BadgeList>
    );

    const link = screen.getByRole('link', { name: 'Link Item' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('hoam-badge-list__item');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('data-theme', 'default');
  });

  it('BadgeListItem supports theme="alert"', () => {
    render(
      <BadgeList>
        <BadgeListItem theme="alert">Alert Badge</BadgeListItem>
      </BadgeList>
    );

    const el = screen.getByText('Alert Badge');
    expect(el).toHaveAttribute('data-theme', 'alert');
  });

  it('BadgeListItem returns nothing when children are falsy', () => {
    render(
      <BadgeList>
        <BadgeListItem>{null}</BadgeListItem>
        <BadgeListItem>{''}</BadgeListItem>
      </BadgeList>
    );

    // Neither should render any visible node
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });

  it('does not log errors when all children are valid BadgeListItem', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BadgeList>
        <BadgeListItem>One</BadgeListItem>
        <BadgeListItem href="/two">Two</BadgeListItem>
      </BadgeList>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Two' })).toBeInTheDocument();

    expect(errorSpy).not.toHaveBeenCalled();
  });
});
