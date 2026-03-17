import { act, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { VariantSelector } from '@/components/VariantSelector';

const labelOptions = [
  { label: 'Small', value: 's' },
  { label: 'Medium', value: 'm' },
  { label: 'Large', value: 'l' },
];

describe('VariantSelector', () => {
  it('renders the label and selected value', () => {
    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
      />
    );

    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getAllByText('Medium')).toHaveLength(2);
  });

  it('renders a radiogroup labelled by the provided label', () => {
    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
      />
    );

    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
  });

  it('falls back to aria-label when no label is provided', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
      />
    );

    expect(screen.getByRole('radiogroup', { name: 'size' })).toBeInTheDocument();
  });

  it('checks the selected radio', () => {
    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
      />
    );

    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked();
  });

  it('calls onChange when a radio is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={onChange}
        options={labelOptions}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Large' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('l');
  });

  it('forwards the first input ref', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <VariantSelector
        ref={ref}
        name="size"
        label="Size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('value', 's');
  });

  it('moves selection to the next enabled option with ArrowRight', async () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={onChange}
        options={labelOptions}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Size' });

    fireEvent.keyDown(group, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith('l');

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('moves selection to the previous enabled option with ArrowLeft', async () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={onChange}
        options={labelOptions}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Size' });

    fireEvent.keyDown(group, { key: 'ArrowLeft' });

    expect(onChange).toHaveBeenCalledWith('s');

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('skips disabled options during keyboard navigation', async () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="s"
        onChange={onChange}
        options={[
          { label: 'Small', value: 's' },
          { label: 'Medium', value: 'm', disabled: true },
          { label: 'Large', value: 'l' },
        ]}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Size' });

    fireEvent.keyDown(group, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith('l');

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('does not wrap when wrap is false', () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="l"
        onChange={onChange}
        options={labelOptions}
        wrap={false}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Size' });

    fireEvent.keyDown(group, { key: 'ArrowRight' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses vertical arrow keys when orientation is vertical', async () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={onChange}
        options={labelOptions}
        orientation="vertical"
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Size' });

    await act(async () => {
      fireEvent.keyDown(group, { key: 'ArrowDown' });
      await Promise.resolve();
    });

    expect(onChange).toHaveBeenCalledWith('l');
  });

  it('sets required on radios when required is true', () => {
    render(
      <VariantSelector
        name="size"
        label="Size"
        value="m"
        onChange={vi.fn()}
        options={labelOptions}
        required
      />
    );

    const radios = screen.getAllByRole('radio');

    radios.forEach((radio) => {
      expect(radio).toBeRequired();
    });
  });

  it('renders image variant content', () => {
    render(
      <VariantSelector
        name="theme"
        label="Theme"
        value="one"
        onChange={vi.fn()}
        variant="image"
        options={[
          {
            label: 'Theme One',
            value: 'one',
            displayValue: '/theme-one.png',
          },
        ]}
      />
    );

    expect(screen.getByRole('img', { name: 'Theme One' })).toBeInTheDocument();
  });

  it('renders color variant without visible label text inside the indicator', () => {
    render(
      <VariantSelector
        name="color"
        label="Color"
        value="red"
        onChange={vi.fn()}
        variant="color"
        options={[
          {
            label: 'Red',
            value: 'red',
            displayValue: '#ff0000',
          },
        ]}
      />
    );

    expect(screen.getByRole('radio', { name: 'Red' })).toBeInTheDocument();
    expect(screen.queryByText('Red')).toBeInTheDocument();
  });
});
