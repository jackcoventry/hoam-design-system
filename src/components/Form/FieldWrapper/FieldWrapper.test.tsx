import { render, screen } from '@testing-library/react';

import { FieldWrapper } from '@/components/Form/FieldWrapper/FieldWrapper';

describe('FieldWrapper', () => {
  it('renders children', () => {
    render(
      <FieldWrapper>
        <input type="text" />
      </FieldWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does not render an error message when error is not provided', () => {
    render(
      <FieldWrapper>
        <input type="text" />
      </FieldWrapper>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders an error message when error is provided', () => {
    render(
      <FieldWrapper error="This field is required">
        <input type="text" />
      </FieldWrapper>
    );

    const error = screen.getByRole('alert');

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('This field is required');
  });

  it('renders both children and error message together', () => {
    render(
      <FieldWrapper error="Invalid input">
        <input type="text" />
      </FieldWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid input');
  });

  it('does not render error when error is an empty string', () => {
    render(
      <FieldWrapper error="">
        <input type="text" />
      </FieldWrapper>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
