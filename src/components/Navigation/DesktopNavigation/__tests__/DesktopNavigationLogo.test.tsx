import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DesktopNavigationLogo } from '@/components/Navigation/DesktopNavigation/DesktopNavigationLogo';
import type { DesktopNavigationLogoProps } from '@/components/Navigation/types';

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    logo: 'logo',
  },
}));

function createProps(
  overrides: Partial<DesktopNavigationLogoProps> = {}
): DesktopNavigationLogoProps {
  return {
    onResetNavigation: vi.fn<() => void>(),
    brandLabel: 'HOAM',
    homeHref: '/',
    ...overrides,
  };
}

describe('DesktopNavigationLogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a link to the home page', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the site title as the link text', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    expect(screen.getByText('HOAM')).toBeInTheDocument();
  });

  it('applies the logo class', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    expect(link).toHaveClass('logo');
  });

  it('marks the link as top-cyclable', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    expect(link).toHaveAttribute('data-top-cyclable');
  });

  it('calls onResetNavigation on focus', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    fireEvent.focus(link);

    expect(props.onResetNavigation).toHaveBeenCalledTimes(1);
  });

  it('calls onResetNavigation on pointer enter', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    fireEvent.pointerEnter(link);

    expect(props.onResetNavigation).toHaveBeenCalledTimes(1);
  });

  it('calls onResetNavigation for both focus and pointer enter when both happen', () => {
    const props = createProps();

    render(<DesktopNavigationLogo {...props} />);

    const link = screen.getByRole('link', { name: 'HOAM' });

    fireEvent.focus(link);
    fireEvent.pointerEnter(link);

    expect(props.onResetNavigation).toHaveBeenCalledTimes(2);
  });

});
