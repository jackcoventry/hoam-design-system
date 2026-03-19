import { render, screen } from '@testing-library/react';

import {
  calculatePasswordStrength,
  PasswordStrengthMeter,
} from '@/components/Form/PasswordStrengthMeter/PasswordStrengthMeter';

describe('calculatePasswordStrength', () => {
  it('returns 0 for an empty password', () => {
    expect(calculatePasswordStrength('')).toBe(0);
  });

  it('returns 0 for a short lowercase-only password', () => {
    expect(calculatePasswordStrength('abc')).toBe(0);
  });

  it('returns 1 for a password with at least 8 characters only', () => {
    expect(calculatePasswordStrength('abcdefgh')).toBe(1);
  });

  it('returns 2 for a password with at least 12 characters only', () => {
    expect(calculatePasswordStrength('abcdefghijkl')).toBe(2);
  });

  it('adds a point for uppercase letters', () => {
    expect(calculatePasswordStrength('abcdefghA')).toBe(2);
  });

  it('adds a point for numbers', () => {
    expect(calculatePasswordStrength('abcdefgh1')).toBe(2);
  });

  it('adds a point for special characters', () => {
    expect(calculatePasswordStrength('abcdefgh!')).toBe(2);
  });

  it('returns 3 for a password meeting three strength rules', () => {
    expect(calculatePasswordStrength('abcdefghA1')).toBe(3);
  });

  it('returns 4 for a very strong password', () => {
    expect(calculatePasswordStrength('Abcdefghijk1!')).toBe(4);
  });

  it('caps the score at 4', () => {
    expect(calculatePasswordStrength('Abcdefghijkl1!')).toBe(4);
  });
});

describe('PasswordStrengthMeter', () => {
  it('renders four strength segments', () => {
    const { container } = render(<PasswordStrengthMeter strength={0} />);

    const segments = container.querySelectorAll('[data-strength]');

    expect(segments).toHaveLength(4);
  });

  it('renders all segments as inactive when strength is 0', () => {
    const { container } = render(<PasswordStrengthMeter strength={0} />);

    const segments = container.querySelectorAll('[data-strength]');

    expect(segments).toHaveLength(4);
    expect(segments[0]).toHaveAttribute('data-active', 'false');
    expect(segments[1]).toHaveAttribute('data-active', 'false');
    expect(segments[2]).toHaveAttribute('data-active', 'false');
    expect(segments[3]).toHaveAttribute('data-active', 'false');
  });

  it('renders the correct number of active segments for strength 2', () => {
    const { container } = render(<PasswordStrengthMeter strength={2} />);

    const segments = container.querySelectorAll('[data-strength]');

    expect(segments).toHaveLength(4);
    expect(segments[0]).toHaveAttribute('data-active', 'true');
    expect(segments[1]).toHaveAttribute('data-active', 'true');
    expect(segments[2]).toHaveAttribute('data-active', 'false');
    expect(segments[3]).toHaveAttribute('data-active', 'false');
  });

  it('renders all segments as active when strength is 4', () => {
    const { container } = render(<PasswordStrengthMeter strength={4} />);

    const segments = container.querySelectorAll('[data-strength]');

    expect(segments).toHaveLength(4);
    expect(segments[0]).toHaveAttribute('data-active', 'true');
    expect(segments[1]).toHaveAttribute('data-active', 'true');
    expect(segments[2]).toHaveAttribute('data-active', 'true');
    expect(segments[3]).toHaveAttribute('data-active', 'true');
  });

  it('does not render the live region when strength is 0', () => {
    const { container } = render(<PasswordStrengthMeter strength={0} />);

    const liveRegion = container.querySelector('[aria-live="polite"]');

    expect(liveRegion).toBeNull();
  });

  it('renders the correct live text when strength is 1', () => {
    render(<PasswordStrengthMeter strength={1} />);

    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('renders the correct live text when strength is 2', () => {
    render(<PasswordStrengthMeter strength={2} />);

    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('renders the correct live text when strength is 3', () => {
    render(<PasswordStrengthMeter strength={3} />);

    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('renders the correct live text when strength is 4', () => {
    render(<PasswordStrengthMeter strength={4} />);

    expect(screen.getByText('Very strong')).toBeInTheDocument();
  });

  it('renders a polite live region when strength is above 0', () => {
    const { container } = render(<PasswordStrengthMeter strength={4} />);

    const liveRegion = container.querySelector('[aria-live="polite"]');

    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveTextContent('Very strong');
  });
});
