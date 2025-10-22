import { Select } from '@/components/Form/Select/Select';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('<Select /> (single)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a label and wires aria-labelledby', () => {
    render(
      <Select
        label="Favourite colour"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Choose</Select.Placeholder>
        <Select.Option value="red">Red</Select.Option>
      </Select>
    );

    // Label is visible
    const label = screen.getByText('Favourite colour');
    expect(label.tagName.toLowerCase()).toBe('label');

    // The <select> is labelled by the label
    const select = screen.getByLabelText('Favourite colour');
    expect(select).toBeInTheDocument();
    // Sanity: has role combobox in single-select mode
    expect(select).toHaveAttribute('aria-labelledby');
  });

  it('shows placeholder only when value is an empty string', () => {
    const { rerender } = render(
      <Select
        label="Colour"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Choose a colour</Select.Placeholder>
        <Select.Option value="red">Red</Select.Option>
      </Select>
    );

    // The placeholder is present as the selected (hidden+disabled) option
    const placeholderOption = screen.getByRole('option', { name: 'Choose a colour' });
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveAttribute('disabled');
    expect(placeholderOption).toHaveAttribute('hidden');

    // When value is non-empty, placeholder should still exist in DOM only if kept in children,
    // but will no longer be selected. Here we keep children as-is, so we just ensure selection moves.
    rerender(
      <Select
        label="Colour"
        value="red"
        onChange={() => {}}
      >
        <Select.Placeholder>Choose a colour</Select.Placeholder>
        <Select.Option value="red">Red</Select.Option>
      </Select>
    );

    const select = screen.getByLabelText('Colour') as HTMLSelectElement;
    expect(select.value).toBe('red');
  });

  it('calls onChange with a single string in single-select mode', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Colour"
        value=""
        onChange={handleChange}
      >
        <Select.Placeholder>Choose a colour</Select.Placeholder>
        <Select.Option value="red">Red</Select.Option>
        <Select.Option value="green">Green</Select.Option>
      </Select>
    );

    const select = screen.getByLabelText('Colour');
    await user.selectOptions(select, 'green');

    expect(handleChange).toHaveBeenCalledTimes(1);
    const [valueArg, eventArg] = handleChange.mock.calls[0];
    expect(valueArg).toBe('green');
    expect(eventArg).toBeInstanceOf(Object);
  });

  it('supports composition: Option text fallback order (children > label > value)', () => {
    render(
      <Select
        label="X"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Pick one</Select.Placeholder>
        <Select.Option
          value="a"
          label="Alpha"
        />
        <Select.Option value="b">Bravo</Select.Option>
        <Select.Option value="c" />
      </Select>
    );

    // 'a' renders "Alpha" from label
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
    // 'b' renders children
    expect(screen.getByRole('option', { name: 'Bravo' })).toBeInTheDocument();
    // 'c' falls back to value "c"
    expect(screen.getByRole('option', { name: 'c' })).toBeInTheDocument();
  });

  it('forwards ref to the native <select>', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select
        label="Ref test"
        value=""
        onChange={() => {}}
        ref={ref}
      >
        <Select.Placeholder>—</Select.Placeholder>
        <Select.Option value="x">X</Select.Option>
      </Select>
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    // Can call .focus() via ref
    ref.current!.focus();
    expect(ref.current).toHaveFocus();
  });

  it('passes through standard select attributes (required, disabled, name, id)', () => {
    render(
      <Select
        id="custom-id"
        name="mySelect"
        required
        disabled
        label="Attrs"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>—</Select.Placeholder>
        <Select.Option value="x">X</Select.Option>
      </Select>
    );

    const select = screen.getByLabelText('Attrs');
    expect(select).toHaveAttribute('id', 'custom-id');
    expect(select).toHaveAttribute('name', 'mySelect');
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
  });

  it('renders optgroups correctly', () => {
    render(
      <Select
        label="Sizes"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Select size</Select.Placeholder>
        <Select.OptGroup label="Men">
          <Select.Option value="m-s">Small</Select.Option>
          <Select.Option value="m-m">Medium</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Women">
          <Select.Option value="w-s">Small</Select.Option>
          <Select.Option value="w-m">Medium</Select.Option>
        </Select.OptGroup>
      </Select>
    );

    // Two optgroups are present
    const groups = screen.getAllByRole('group');
    expect(groups.length).toBe(2);

    // Options are reachable
    expect(screen.getByRole('option', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
  });
});

describe('<Select /> (multiple)', () => {
  const user = userEvent.setup();

  it('calls onChange with string[] when multiple', async () => {
    const handleChange = vi.fn();

    render(
      <Select
        label="Sizes"
        multiple
        value={[]}
        onChange={handleChange}
        size={4}
      >
        <Select.Option value="S">Small</Select.Option>
        <Select.Option value="M">Medium</Select.Option>
        <Select.Option value="L">Large</Select.Option>
        <Select.Option value="XL">Extra Large</Select.Option>
      </Select>
    );

    const select = screen.getByLabelText('Sizes');

    // Select multiple values
    await user.selectOptions(select, ['M', 'XL']);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const [vals] = handleChange.mock.calls[0];
    expect(vals).toEqual(['M', 'XL']);
  });

  it('reflects controlled value array in the DOM', () => {
    const { rerender } = render(
      <Select
        label="Pick"
        multiple
        value={['S', 'L']}
        onChange={() => {}}
        size={4}
      >
        <Select.Option value="S">Small</Select.Option>
        <Select.Option value="M">Medium</Select.Option>
        <Select.Option value="L">Large</Select.Option>
      </Select>
    );

    const s = screen.getByRole('option', { name: 'Small' }) as HTMLOptionElement;
    const m = screen.getByRole('option', { name: 'Medium' }) as HTMLOptionElement;
    const l = screen.getByRole('option', { name: 'Large' }) as HTMLOptionElement;

    expect(s.selected).toBe(true);
    expect(m.selected).toBe(false);
    expect(l.selected).toBe(true);

    // Update selection via controlled props
    rerender(
      <Select
        label="Pick"
        multiple
        value={['M']}
        onChange={() => {}}
        size={4}
      >
        <Select.Option value="S">Small</Select.Option>
        <Select.Option value="M">Medium</Select.Option>
        <Select.Option value="L">Large</Select.Option>
      </Select>
    );

    expect(s.selected).toBe(false);
    expect(m.selected).toBe(true);
    expect(l.selected).toBe(false);
  });
});
