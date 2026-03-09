import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './Select';

describe('Select', () => {
  it('renders a label and the current single value', () => {
    render(
      <Select
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
      </Select>
    );

    expect(screen.getByText('Colour')).toBeInTheDocument();
    expect(screen.getByText('black')).toBeInTheDocument();

    const select = screen.getByRole('combobox', { name: /colour/i });
    expect(select).toHaveValue('black');
  });

  it('calls onChange with the new string value for single select', () => {
    const onChange = vi.fn();

    render(
      <Select
        label="Colour"
        value="black"
        onChange={onChange}
      >
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: /colour/i });

    fireEvent.change(select, { target: { value: 'white' } });

    expect(onChange).toHaveBeenCalledTimes(1);

    const [value, event] = onChange.mock.calls[0] as [string, React.ChangeEvent<HTMLSelectElement>];

    expect(value).toBe('white');
    expect(event.target.value).toBe('white');
  });

  it('renders the joined value for multi-select', () => {
    render(
      <Select
        label="Colours"
        value={['black', 'white']}
        multiple
        onChange={vi.fn()}
      >
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
        <Select.Option value="red">Red</Select.Option>
      </Select>
    );

    expect(screen.getByText('Colours')).toBeInTheDocument();
    expect(screen.getByText('black, white')).toBeInTheDocument();

    const select = screen.getByRole('listbox', { name: /colours/i });
    expect(select).toBeInTheDocument();
  });

  it('calls onChange with an array of selected values for multi-select', () => {
    const onChange = vi.fn();

    render(
      <Select
        label="Colours"
        value={['black']}
        multiple
        onChange={onChange}
      >
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
        <Select.Option value="red">Red</Select.Option>
      </Select>
    );

    const select = screen.getByRole('listbox', { name: /colours/i });

    const options = screen.getAllByRole('option');
    const black = options.find((option) => option.textContent === 'Black');
    const white = options.find((option) => option.textContent === 'White');

    if (!(black instanceof HTMLOptionElement) || !(white instanceof HTMLOptionElement)) {
      throw new TypeError('Expected option elements for Black and White');
    }

    black.selected = true;
    white.selected = true;

    fireEvent.change(select, {
      target: {
        selectedOptions: [black, white],
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);

    const [value] = onChange.mock.calls[0] as [string[], React.ChangeEvent<HTMLSelectElement>];

    expect(value).toEqual(['black', 'white']);
  });

  it('renders placeholder text', () => {
    render(
      <Select
        label="Colour"
        value=""
        onChange={vi.fn()}
      >
        <Select.Placeholder>Choose a colour</Select.Placeholder>
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
      </Select>
    );

    expect(screen.getByText('Choose a colour')).toBeInTheDocument();
  });

  it('renders option groups and options', () => {
    render(
      <Select
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.OptGroup label="Dark">
          <Select.Option value="black">Black</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Light">
          <Select.Option value="white">White</Select.Option>
        </Select.OptGroup>
      </Select>
    );

    expect(screen.getByRole('group', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Black' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'White' })).toBeInTheDocument();
  });

  it('forwards the ref to the select element', () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select
        ref={ref}
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.Option value="black">Black</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: /colour/i });

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current).toBe(select);
  });

  it('passes through disabled and required props', () => {
    render(
      <Select
        label="Colour"
        value="black"
        onChange={vi.fn()}
        disabled
        required
      >
        <Select.Option value="black">Black</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: /colour/i });

    expect(select).toBeDisabled();
    expect(select).toBeRequired();
  });

  it('uses the provided id and associates the label', () => {
    render(
      <Select
        id="colour-select"
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.Option value="black">Black</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: /colour/i });

    expect(select).toHaveAttribute('id', 'colour-select');

    const label = screen.getByText('Colour').closest('label');
    expect(label).toHaveAttribute('for', 'colour-select');
  });

  it('renders option label when children are not provided', () => {
    render(
      <Select
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.Option
          value="black"
          label="Black label"
        />
      </Select>
    );

    expect(screen.getByRole('option', { name: 'Black label' })).toBeInTheDocument();
  });

  it('falls back to option value when neither children nor label are provided', () => {
    render(
      <Select
        label="Colour"
        value="black"
        onChange={vi.fn()}
      >
        <Select.Option value="black" />
      </Select>
    );

    expect(screen.getByRole('option', { name: 'black' })).toBeInTheDocument();
  });

  it('does not throw if onChange is omitted', () => {
    render(
      <Select
        label="Colour"
        value="black"
      >
        <Select.Option value="black">Black</Select.Option>
        <Select.Option value="white">White</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: /colour/i });

    expect(() => {
      fireEvent.change(select, { target: { value: 'white' } });
    }).not.toThrow();
  });
});
