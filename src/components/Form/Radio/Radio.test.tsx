import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Radio } from '@/components/Form/Radio';

function getRadio(name: string): HTMLInputElement {
  return screen.getByRole('radio', { name });
}

describe('Radio', () => {
  it('renders an accessible radio with its label', () => {
    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
      />
    );

    expect(getRadio('Email')).toBeInTheDocument();
  });

  it('uses only the label as the accessible name when a description is present', () => {
    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        description="Contact me by email."
      />
    );

    expect(getRadio('Email')).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', {
        name: 'Email Contact me by email.',
      })
    ).not.toBeInTheDocument();
  });

  it('renders description text and associates it with the radio', () => {
    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        description="Contact me by email."
      />
    );

    const radio = getRadio('Email');
    const description = screen.getByText('Contact me by email.');

    expect(description).toBeInTheDocument();
    expect(radio).toHaveAttribute('aria-describedby', description.id);
  });

  it('supports uncontrolled usage with defaultChecked', () => {
    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        defaultChecked
      />
    );

    expect(getRadio('Email')).toBeChecked();
  });

  it('supports controlled checked state', () => {
    const { rerender } = render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        checked={false}
        readOnly
      />
    );

    expect(getRadio('Email')).not.toBeChecked();

    rerender(
      <Radio
        name="contact"
        label="Email"
        value="email"
        checked
        readOnly
      />
    );

    expect(getRadio('Email')).toBeChecked();
  });

  it('calls onCheckedChange with true when selected', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        onCheckedChange={handleCheckedChange}
      />
    );

    await user.click(getRadio('Email'));

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls native onChange when changed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        onChange={handleChange}
      />
    );

    await user.click(getRadio('Email'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        disabled
      />
    );

    expect(getRadio('Email')).toBeDisabled();
  });

  it('forwards name and value attributes', () => {
    render(
      <Radio
        name="contactMethod"
        label="Email"
        value="email"
      />
    );

    const radio = getRadio('Email');

    expect(radio).toHaveAttribute('name', 'contactMethod');
    expect(radio).toHaveAttribute('value', 'email');
  });

  it('forwards refs to the native input', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(
      <Radio
        name="contact"
        label="Email"
        value="email"
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('radio');
  });
});
