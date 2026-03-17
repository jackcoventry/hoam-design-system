import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from '@/components/Form/Select/Select';

describe('Select', () => {
  it('renders a label and selected value', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={vi.fn()}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
        <Select.Option
          value="de"
          label="Germany"
        />
      </Select>
    );

    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('uk')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('associates the label with the select', () => {
    render(
      <Select
        id="country"
        label="Country"
        value="uk"
        onChange={vi.fn()}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
      </Select>
    );

    const select = screen.getByLabelText('Country');

    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'country');
  });

  it('calls onChange with a string value for single select', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        label="Country"
        value="uk"
        onChange={onChange}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
        <Select.Option
          value="de"
          label="Germany"
        />
      </Select>
    );

    await user.selectOptions(screen.getByRole('combobox'), 'de');

    expect(onChange).toHaveBeenCalledTimes(1);

    const [value, event] = onChange.mock.calls[0] as [string, Event];
    expect(value).toBe('de');
    expect(event).toBeTruthy();
  });

  it('calls onChange with an array of values for multi-select', () => {
    const onChange = vi.fn();

    render(
      <Select
        multiple
        label="Countries"
        value={[]}
        onChange={onChange}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
        <Select.Option
          value="de"
          label="Germany"
        />
        <Select.Option
          value="fr"
          label="France"
        />
      </Select>
    );

    const selectElement = screen.getByRole('listbox');

    if (!(selectElement instanceof HTMLSelectElement)) {
      throw new TypeError('Expected a select element');
    }

    const secondOption = selectElement.options.item(1);
    const thirdOption = selectElement.options.item(2);

    if (!(secondOption instanceof HTMLOptionElement)) {
      throw new TypeError('Expected second option to exist');
    }

    if (!(thirdOption instanceof HTMLOptionElement)) {
      throw new TypeError('Expected third option to exist');
    }

    secondOption.selected = true;
    thirdOption.selected = true;

    fireEvent.change(selectElement);

    expect(onChange).toHaveBeenCalledTimes(1);

    const firstCall = onChange.mock.calls[0];

    if (!firstCall) {
      throw new TypeError('Expected onChange to be called');
    }

    expect(firstCall[0]).toEqual(['de', 'fr']);
    expect(firstCall[1]).toBeTruthy();
  });

  it('renders placeholder option', () => {
    const { container } = render(
      <Select
        label="Country"
        value=""
        onChange={vi.fn()}
      >
        <Select.Placeholder>Select a country</Select.Placeholder>
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
      </Select>
    );

    const placeholder = container.querySelector('option[value=""]');

    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Select a country');
    expect(placeholder).toHaveAttribute('disabled');
    expect(placeholder).toHaveAttribute('hidden');
  });

  it('renders option groups and options', () => {
    render(
      <Select
        label="Country"
        value="de"
        onChange={vi.fn()}
      >
        <Select.OptGroup label="Europe">
          <Select.Option
            value="de"
            label="Germany"
          />
          <Select.Option
            value="fr"
            label="France"
          />
        </Select.OptGroup>
      </Select>
    );

    expect(screen.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'France' })).toBeInTheDocument();
  });

  it('forwards disabled and required attributes', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={vi.fn()}
        disabled
        required
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
      </Select>
    );

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
    expect(select).toBeRequired();
  });

  it('forwards a ref to the select element', () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select
        ref={ref}
        label="Country"
        value="uk"
        onChange={vi.fn()}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('renders joined values for multi-select display', () => {
    render(
      <Select
        multiple
        label="Countries"
        value={['uk', 'de']}
        onChange={vi.fn()}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
        <Select.Option
          value="de"
          label="Germany"
        />
      </Select>
    );

    expect(screen.getByText('uk, de')).toBeInTheDocument();
  });
});
