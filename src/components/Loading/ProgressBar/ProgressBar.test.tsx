import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProgressBar } from '@/components/Loading/ProgressBar';

vi.mock('@/hooks/useMessages', () => ({
  useMessages: () => ({
    loading: 'Loading',
    inProgress: 'In progress',
  }),
}));

describe('ProgressBar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a determinate progress bar with default label and rounded percentage', () => {
    render(<ProgressBar value={25} />);

    expect(screen.getByText('Loading', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('25%', { selector: 'span' })).toBeInTheDocument();

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).toHaveAttribute('value', '25');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('renders a custom label', () => {
    render(
      <ProgressBar
        value={40}
        label="Uploading files"
      />
    );

    expect(screen.getByText('Uploading files', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Uploading files' })).toBeInTheDocument();
  });

  it('renders an indeterminate progress bar when value is undefined', () => {
    render(<ProgressBar />);

    expect(screen.getByText('Loading', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('In progress', { selector: 'span' })).toBeInTheDocument();

    const progressbar = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progressbar.tagName).toBe('DIV');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuetext', 'In progress');
  });

  it('does not render value text when showValue is false', () => {
    render(
      <ProgressBar
        value={25}
        showValue={false}
      />
    );

    expect(screen.queryByText('25%', { selector: 'span' })).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
  });

  it('clamps the value to the minimum when value is below min', () => {
    render(
      <ProgressBar
        value={-10}
        min={0}
        max={100}
      />
    );

    expect(screen.getByText('0%', { selector: 'span' })).toBeInTheDocument();

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).toHaveAttribute('value', '0');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('clamps the value to the maximum when value is above max', () => {
    render(
      <ProgressBar
        value={250}
        min={0}
        max={100}
      />
    );

    expect(screen.getByText('100%', { selector: 'span' })).toBeInTheDocument();

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).toHaveAttribute('value', '100');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('uses a safe max when max is less than or equal to min', () => {
    render(
      <ProgressBar
        value={10}
        min={10}
        max={10}
      />
    );

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).toHaveAttribute('value', '10');
    expect(progress).toHaveAttribute('max', '11');

    expect(screen.getByText('0%', { selector: 'span' })).toBeInTheDocument();
  });

  it('passes clamped value and safe max to formatValueText', () => {
    const formatValueText = vi.fn((percentage: number, value: number, min: number, max: number) => {
      return `${percentage.toFixed(1)} | ${value} | ${min} | ${max}`;
    });

    render(
      <ProgressBar
        value={150}
        min={0}
        max={100}
        formatValueText={formatValueText}
      />
    );

    expect(formatValueText).toHaveBeenCalledTimes(1);
    expect(formatValueText).toHaveBeenCalledWith(100, 100, 0, 100);
    expect(screen.getByText('100.0 | 100 | 0 | 100', { selector: 'span' })).toBeInTheDocument();
  });

  it('passes safe max to formatValueText when max is invalid', () => {
    const formatValueText = vi.fn((percentage: number, value: number, min: number, max: number) => {
      return `${percentage.toFixed(0)}% (${value}/${max}, min:${min})`;
    });

    render(
      <ProgressBar
        value={5}
        min={5}
        max={5}
        formatValueText={formatValueText}
      />
    );

    expect(formatValueText).toHaveBeenCalledWith(0, 5, 5, 6);
    expect(screen.getByText('0% (5/6, min:5)', { selector: 'span' })).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <ProgressBar
        value={30}
        className="custom-root"
        labelClassName="custom-label"
        valueClassName="custom-value"
      />
    );

    expect(container.firstChild).toHaveClass('custom-root');
    expect(screen.getByText('Loading', { selector: 'span' })).toHaveClass('custom-label');
    expect(screen.getByText('30%', { selector: 'span' })).toHaveClass('custom-value');
  });

  it('rounds percentage text for non-integer percentages by default', () => {
    render(
      <ProgressBar
        value={1}
        min={0}
        max={3}
      />
    );

    expect(screen.getByText('33%', { selector: 'span' })).toBeInTheDocument();

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).toHaveAttribute('value', '1');
    expect(progress).toHaveAttribute('max', '3');
  });

  it('uses custom min and max in indeterminate mode', () => {
    render(
      <ProgressBar
        min={10}
        max={20}
        label="Processing"
      />
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Processing' });
    expect(progressbar).toHaveAttribute('aria-valuemin', '10');
    expect(progressbar).toHaveAttribute('aria-valuemax', '20');
    expect(progressbar).toHaveAttribute('aria-valuetext', 'In progress');
  });

  it('uses a safe max in indeterminate mode when max is less than or equal to min', () => {
    render(
      <ProgressBar
        min={7}
        max={7}
      />
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progressbar).toHaveAttribute('aria-valuemin', '7');
    expect(progressbar).toHaveAttribute('aria-valuemax', '8');
  });
});
