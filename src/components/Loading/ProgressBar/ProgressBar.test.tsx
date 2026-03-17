import { render, screen } from '@testing-library/react';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders a native progress element with a label', () => {
    render(
      <ProgressBar
        label="Upload progress"
        value={35}
      />
    );

    const progress = screen.getByLabelText('Upload progress');
    expect(progress.tagName.toLowerCase()).toBe('progress');
    expect(progress).toHaveAttribute('value', '35');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('renders visible value text by default', () => {
    render(
      <ProgressBar
        label="Upload progress"
        value={35}
      />
    );

    expect(screen.getByText('35%', { selector: 'span' })).toBeInTheDocument();
  });

  it('supports indeterminate mode', () => {
    render(<ProgressBar label="Importing assets" />);

    const progress = screen.getByLabelText('Importing assets');
    expect(progress.tagName.toLowerCase()).toBe('progress');
    expect(progress).not.toHaveAttribute('value');
  });

  it('clamps values above the max', () => {
    render(
      <ProgressBar
        label="Upload progress"
        value={120}
        max={100}
      />
    );

    const progress = screen.getByLabelText('Upload progress');
    expect(progress).toHaveAttribute('value', '100');
  });
});
