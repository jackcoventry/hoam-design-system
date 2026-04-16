import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavRoot, type NavRootProps } from '@/components/Navigation/MainNavigation/NavRoot';

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    root: 'root',
  },
}));

function createInnerRef(): React.RefObject<HTMLElement | null> {
  return { current: null };
}

function createProps(overrides: Partial<NavRootProps> = {}): NavRootProps {
  return {
    innerRef: createInnerRef(),
    onLeave: vi.fn<() => void>(),
    onEnter: vi.fn<() => void>(),
    onKeyDown: vi.fn<(e: React.KeyboardEvent<HTMLElement>) => void>(),
    children: <div data-testid="nav-root-children">Navigation content</div>,
    ...overrides,
  };
}

describe('NavRoot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a header with role none', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    const header = screen.getByRole('none');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('applies the root class', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    const header = screen.getByRole('none');
    expect(header).toHaveClass('root');
  });

  it('renders its children', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    expect(screen.getByTestId('nav-root-children')).toBeInTheDocument();
    expect(screen.getByText('Navigation content')).toBeInTheDocument();
  });

  it('calls onLeave on pointer leave', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    fireEvent.pointerLeave(screen.getByRole('none'));

    expect(props.onLeave).toHaveBeenCalledTimes(1);
  });

  it('calls onEnter on pointer enter', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    fireEvent.pointerEnter(screen.getByRole('none'));

    expect(props.onEnter).toHaveBeenCalledTimes(1);
  });

  it('calls onKeyDown when a key is pressed', () => {
    const props = createProps();

    render(<NavRoot {...props} />);

    fireEvent.keyDown(screen.getByRole('none'), { key: 'ArrowRight' });

    expect(props.onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('passes the keyboard event through to onKeyDown', () => {
    let receivedKey: string | null = null;

    const props = createProps({
      onKeyDown: vi.fn((e: React.KeyboardEvent<HTMLElement>) => {
        receivedKey = e.key;
      }),
    });

    render(<NavRoot {...props} />);

    fireEvent.keyDown(screen.getByRole('none'), { key: 'Escape' });

    expect(receivedKey).toBe('Escape');
  });

  it('assigns the header element to innerRef', () => {
    const innerRef = createInnerRef();
    const props = createProps({ innerRef });

    render(<NavRoot {...props} />);

    const header = screen.getByRole('none');
    expect(innerRef.current).toBe(header);
  });

  it('renders arbitrary React children', () => {
    const props = createProps({
      children: (
        <div>
          <span>One</span>
          <span>Two</span>
        </div>
      ),
    });

    render(<NavRoot {...props} />);

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
