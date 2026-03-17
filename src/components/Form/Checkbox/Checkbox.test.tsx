import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox, CheckboxGroup } from '@/components/Form/Checkbox';

describe('Checkbox', () => {
  it('renders an accessible checkbox with its label', () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('renders description text and associates it with the checkbox', () => {
    render(
      <Checkbox
        label="Accept terms"
        description="You must accept before continuing."
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const description = screen.getByText('You must accept before continuing.');

    expect(description).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-describedby', description.getAttribute('id'));
  });

  it('supports uncontrolled usage with defaultChecked', () => {
    render(
      <Checkbox
        label="Accept terms"
        defaultChecked
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  });

  it('supports controlled checked state', () => {
    const { rerender } = render(
      <Checkbox
        label="Accept terms"
        checked={false}
        readOnly
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).not.toBeChecked();

    rerender(
      <Checkbox
        label="Accept terms"
        checked
        readOnly
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  });

  it('calls onCheckedChange with true when checked', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms"
        onCheckedChange={handleCheckedChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange with false when unchecked', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms"
        defaultChecked
        onCheckedChange={handleCheckedChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('calls native onChange when changed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms"
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(
      <Checkbox
        label="Accept terms"
        disabled
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms"
        disabled
        onCheckedChange={handleCheckedChange}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('supports required state', () => {
    render(
      <Checkbox
        label="Accept terms"
        required
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeRequired();
  });

  it('forwards name and value attributes', () => {
    render(
      <Checkbox
        label="Newsletter"
        name="preferences"
        value="newsletter"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Newsletter' });

    expect(checkbox).toHaveAttribute('name', 'preferences');
    expect(checkbox).toHaveAttribute('value', 'newsletter');
  });

  it('supports indeterminate state', () => {
    render(
      <Checkbox
        label="Select all"
        indeterminate
      />
    );

    const checkbox: HTMLInputElement = screen.getByRole('checkbox', {
      name: 'Select all',
    });

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).not.toBeChecked();
  });

  it('forwards refs to the native input', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(
      <Checkbox
        label="Accept terms"
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });
});

describe('CheckboxGroup', () => {
  it('renders a semantic group with legend', () => {
    render(
      <CheckboxGroup legend="Topics">
        <Checkbox label="Accessibility" />
        <Checkbox label="Performance" />
      </CheckboxGroup>
    );

    expect(screen.getByRole('group', { name: 'Topics' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Performance' })).toBeInTheDocument();
  });

  it('renders description and associates it with the fieldset', () => {
    render(
      <CheckboxGroup
        legend="Topics"
        description="Select all that apply."
      >
        <Checkbox label="Accessibility" />
      </CheckboxGroup>
    );

    const group = screen.getByRole('group', { name: 'Topics' });
    const description = screen.getByText('Select all that apply.');

    expect(description).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-describedby', description.getAttribute('id'));
  });

  it('renders error text and associates it with the fieldset', () => {
    render(
      <CheckboxGroup
        legend="Topics"
        error="Please select at least one option."
      >
        <Checkbox label="Accessibility" />
      </CheckboxGroup>
    );

    const group = screen.getByRole('group', { name: 'Topics' });
    const error = screen.getByText('Please select at least one option.');

    expect(error).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-describedby', error.getAttribute('id'));
  });

  it('associates both description and error with the fieldset when both are present', () => {
    render(
      <CheckboxGroup
        legend="Topics"
        description="Select all that apply."
        error="Please select at least one option."
      >
        <Checkbox label="Accessibility" />
      </CheckboxGroup>
    );

    const group = screen.getByRole('group', { name: 'Topics' });
    const description = screen.getByText('Select all that apply.');
    const error = screen.getByText('Please select at least one option.');

    expect(group).toHaveAttribute(
      'aria-describedby',
      `${description.getAttribute('id')} ${error.getAttribute('id')}`
    );
  });

  it('renders required indicator when required is true', () => {
    render(
      <CheckboxGroup
        legend="Topics"
        required
      >
        <Checkbox label="Accessibility" />
      </CheckboxGroup>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
