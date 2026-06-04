import { render, screen } from '@testing-library/react';

import { FieldLabel } from '@/components/Form/FieldLabel/FieldLabel';

describe('FieldLabel', () => {
  it('renders the label text', () => {
    render(<FieldLabel htmlFor="email">Email address</FieldLabel>);

    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('renders a label element associated to the provided htmlFor value', () => {
    const { container } = render(<FieldLabel htmlFor="email">Email address</FieldLabel>);

    const label = container.querySelector('label');

    expect(label).not.toBeNull();
    expect(label).toHaveAttribute('for', 'email');
    expect(label).toHaveTextContent('Email address');
  });

  it('applies a custom className to the label', () => {
    const { container } = render(
      <FieldLabel
        htmlFor="email"
        className="custom-field-label"
      >
        Email address
      </FieldLabel>
    );

    expect(container.querySelector('label')).toHaveClass('custom-field-label');
  });

  it('renders ReactNode children', () => {
    render(
      <FieldLabel htmlFor="password">
        <span>Password</span>
        <span> *</span>
      </FieldLabel>
    );

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
