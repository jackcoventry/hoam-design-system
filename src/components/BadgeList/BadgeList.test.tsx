import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';

const warnMock = vi.fn();

vi.mock('@/utils/logger', () => ({
  logger: {
    warn: (...args: unknown[]) => {
      warnMock(...args);
    },
  },
}));

describe('BadgeListItem', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders its children', () => {
    render(<BadgeListItem variant="default">New</BadgeListItem>);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies the default variant', () => {
    render(<BadgeListItem variant="default">New</BadgeListItem>);

    expect(screen.getByText('New')).toHaveAttribute('data-variant', 'default');
  });

  it('applies the alert variant', () => {
    render(<BadgeListItem variant="alert">Warning</BadgeListItem>);

    expect(screen.getByText('Warning')).toHaveAttribute('data-variant', 'alert');
  });

  it('applies the highlight variant', () => {
    render(<BadgeListItem variant="highlight">Featured</BadgeListItem>);

    expect(screen.getByText('Featured')).toHaveAttribute('data-variant', 'highlight');
  });

  it('applies a custom className to the badge item', () => {
    render(
      <BadgeListItem
        variant="default"
        className="custom-badge"
      >
        New
      </BadgeListItem>
    );

    expect(screen.getByText('New')).toHaveClass('custom-badge');
  });

  it('returns null when children is empty', () => {
    const { container } = render(<BadgeListItem variant="default">{null}</BadgeListItem>);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when children is falsey text input', () => {
    const { container } = render(<BadgeListItem variant="default">{''}</BadgeListItem>);

    expect(container.firstChild).toBeNull();
  });
});

describe('BadgeList', () => {
  beforeEach(() => {
    warnMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders valid BadgeListItem children', () => {
    const { container } = render(
      <BadgeList>
        <BadgeListItem variant="default">One</BadgeListItem>
        <BadgeListItem variant="alert">Two</BadgeListItem>
      </BadgeList>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('applies a custom className to the badge list root', () => {
    const { container } = render(
      <BadgeList className="custom-badge-list">
        <BadgeListItem variant="default">One</BadgeListItem>
      </BadgeList>
    );

    expect(container.firstChild).toHaveClass('custom-badge-list');
  });

  it('renders only BadgeListItem children when mixed with invalid children', () => {
    render(
      <BadgeList>
        <BadgeListItem variant="default">Valid</BadgeListItem>
        <span>Invalid span</span>
        Plain text
        <BadgeListItem variant="highlight">Also valid</BadgeListItem>
      </BadgeList>
    );

    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.getByText('Also valid')).toBeInTheDocument();
    expect(screen.queryByText('Invalid span')).not.toBeInTheDocument();
    expect(screen.queryByText('Plain text')).not.toBeInTheDocument();
    expect(warnMock).toHaveBeenCalledTimes(2);
    expect(warnMock).toHaveBeenCalledWith(
      'BadgeList component only accepts children of type BadgeListItem'
    );
  });

  it('warns and omits invalid element children', () => {
    render(
      <BadgeList>
        <div>Not allowed</div>
      </BadgeList>
    );

    expect(screen.queryByText('Not allowed')).not.toBeInTheDocument();
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock).toHaveBeenCalledWith(
      'BadgeList component only accepts children of type BadgeListItem'
    );
  });

  it('warns and omits non-element children', () => {
    render(<BadgeList>{'Just text'}</BadgeList>);

    expect(screen.queryByText('Just text')).not.toBeInTheDocument();
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock).toHaveBeenCalledWith(
      'BadgeList component only accepts children of type BadgeListItem'
    );
  });

  it('renders an empty root when there are no children', () => {
    const { container } = render(<BadgeList />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('renders an empty root when all children are invalid', () => {
    const { container } = render(
      <BadgeList>
        <div>Wrong</div>
        {'Nope'}
      </BadgeList>
    );

    expect(screen.queryByText('Wrong')).not.toBeInTheDocument();
    expect(screen.queryByText('Nope')).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(warnMock).toHaveBeenCalledTimes(2);
  });

  it('preserves item variants through BadgeList rendering', () => {
    render(
      <BadgeList>
        <BadgeListItem variant="default">Default badge</BadgeListItem>
        <BadgeListItem variant="alert">Alert badge</BadgeListItem>
        <BadgeListItem variant="highlight">Highlight badge</BadgeListItem>
      </BadgeList>
    );

    expect(screen.getByText('Default badge')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Alert badge')).toHaveAttribute('data-variant', 'alert');
    expect(screen.getByText('Highlight badge')).toHaveAttribute('data-variant', 'highlight');
  });
});
