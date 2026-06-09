import { createRef, type ReactNode, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  type VariantOption,
  VariantSelector,
  type VariantSelectorProps,
} from '@/components/VariantSelector/VariantSelector';

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

vi.mock('@/components/VariantSelector/VariantSelector.module.css', () => ({
  default: {
    root: 'root',
    label: 'label',
    legend: 'legend',
    selected: 'selected',
    items: 'items',
    item: 'item',
    radio: 'radio',
    visual: 'visual',
    indicator: 'indicator',
    image: 'image',
    indicatorText: 'indicatorText',
  },
}));

vi.mock('@/styles/Util.module.css', () => ({
  default: {
    focus: 'focus',
    srOnly: 'srOnly',
    focusTarget: 'focusTarget',
  },
}));

type TestWrapperProps = Omit<VariantSelectorProps, 'value' | 'onChange'> & {
  initialValue: VariantSelectorProps['value'];
  onValueChange?: (value: string | number) => void;
};

function TestWrapper({ initialValue, onValueChange, ...props }: Readonly<TestWrapperProps>) {
  const [value, setValue] = useState<VariantSelectorProps['value']>(initialValue);

  return (
    <VariantSelector
      {...props}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
    />
  );
}

function getDefaultOptions(): VariantOption[] {
  return [
    { label: 'Small', value: 's' },
    { label: 'Medium', value: 'm' },
    { label: 'Large', value: 'l' },
  ];
}

describe('VariantSelector', () => {
  it('renders a radiogroup labelled by the legend when a label is provided', () => {
    render(
      <VariantSelector
        name="size"
        label="Choose a size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    expect(group).toBeInTheDocument();

    const legend = screen.getByText('Choose a size');
    expect(legend.tagName.toLowerCase()).toBe('legend');

    const selected = legend.parentElement?.querySelector('.selected');
    expect(selected).toHaveTextContent('Medium');
  });

  it('renders a radiogroup labelled by name when no label is provided', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    expect(screen.getByRole('radiogroup', { name: 'size' })).toBeInTheDocument();
    expect(document.querySelector('legend')).not.toBeInTheDocument();
    expect(document.querySelector('.selected')).not.toBeInTheDocument();
  });

  it('renders all options as radios with the correct checked state', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    const small = screen.getByRole('radio', { name: 'Small' });
    const medium = screen.getByRole('radio', { name: 'Medium' });
    const large = screen.getByRole('radio', { name: 'Large' });

    expect(small).not.toBeChecked();
    expect(medium).toBeChecked();
    expect(large).not.toBeChecked();
  });

  it('calls onChange with the selected option value when a radio is changed', () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={onChange}
        options={getDefaultOptions()}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Large' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('l');
  });

  it('applies required to radios and aria-required to the fieldset when required is true', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
        required
      />
    );

    const radios = screen.getAllByRole('radio');
    const fieldset = document.querySelector('fieldset');

    expect(fieldset).toHaveAttribute('aria-required', 'true');

    for (const radio of radios) {
      expect(radio).toBeRequired();
    }
  });

  it('does not set aria-required when required is false or omitted', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    const fieldset = document.querySelector('fieldset');
    expect(fieldset).not.toHaveAttribute('aria-required');
  });

  it('forwards a ref to the first input', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <VariantSelector
        ref={ref}
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    expect(ref.current).toBe(screen.getByRole('radio', { name: 'Small' }));
  });

  it('displays the selected label text when a matching value exists', () => {
    render(
      <VariantSelector
        name="size"
        label="Choose a size"
        value="l"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    const legend = screen.getByText('Choose a size');
    const selected = legend.parentElement?.querySelector('.selected');

    expect(selected).toHaveTextContent('Large');
  });

  it('renders an empty selected value when the current value does not match an option', () => {
    render(
      <VariantSelector
        name="size"
        label="Choose a size"
        value="xl"
        onChange={vi.fn()}
        options={getDefaultOptions()}
      />
    );

    const legend = screen.getByText('Choose a size');
    const selected = legend.parentElement?.querySelector('.selected');

    expect(selected).toBeTruthy();
    expect(selected).toHaveTextContent('');
  });

  it('renders disabled options as disabled radios', () => {
    render(
      <VariantSelector
        name="size"
        value={null}
        onChange={vi.fn()}
        options={[
          { label: 'Small', value: 's' },
          { label: 'Medium', value: 'm', disabled: true },
          { label: 'Large', value: 'l' },
        ]}
      />
    );

    const small = screen.getByRole('radio', { name: 'Small' });
    const medium = screen.getByRole('radio', { name: 'Medium' });
    const large = screen.getByRole('radio', { name: 'Large' });

    expect(medium).toBeDisabled();
    expect(medium.closest('label')).toHaveAttribute('data-disabled', 'true');
    expect(small).not.toBeDisabled();
    expect(small.closest('label')).not.toHaveAttribute('data-disabled');
    expect(large).not.toBeDisabled();
    expect(large.closest('label')).not.toHaveAttribute('data-disabled');
  });

  it('focuses the selected input when the radiogroup itself receives focus', async () => {
    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="m"
        options={getDefaultOptions()}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });

    act(() => {
      fireEvent.focus(group);
    });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Medium' })).toHaveFocus();
    });
  });

  it('focuses the first enabled input when the radiogroup receives focus and no value is selected', async () => {
    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue={null}
        options={[
          { label: 'Small', value: 's', disabled: true },
          { label: 'Medium', value: 'm' },
          { label: 'Large', value: 'l' },
        ]}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });

    act(() => {
      fireEvent.focus(group);
    });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Medium' })).toHaveFocus();
    });
  });

  it('moves selection to the next enabled option with ArrowRight', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="s"
        options={getDefaultOptions()}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Medium' })).toHaveFocus();
    });

    expect(onValueChange).toHaveBeenCalledWith('m');
  });

  it('moves selection to the previous enabled option with ArrowLeft', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="m"
        options={getDefaultOptions()}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowLeft' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Small' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Small' })).toHaveFocus();
    });

    expect(onValueChange).toHaveBeenCalledWith('s');
  });

  it('skips disabled options during keyboard navigation', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="s"
        options={[
          { label: 'Small', value: 's' },
          { label: 'Medium', value: 'm', disabled: true },
          { label: 'Large', value: 'l' },
        ]}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Large' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Large' })).toHaveFocus();
    });

    expect(onValueChange).toHaveBeenCalledWith('l');
  });

  it('wraps to the first enabled option when moving right from the end and wrap is true', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="l"
        wrap
        options={getDefaultOptions()}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Small' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Small' })).toHaveFocus();
    });

    expect(onValueChange).toHaveBeenCalledWith('s');
  });

  it('does not wrap when wrap is false and moving right from the end', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue="l"
        wrap={false}
        options={getDefaultOptions()}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Large' })).toBeChecked();
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('starts from the first enabled option when navigating with no current selection', async () => {
    const onValueChange = vi.fn();

    render(
      <TestWrapper
        name="size"
        label="Choose a size"
        initialValue={null}
        options={[
          { label: 'Small', value: 's', disabled: true },
          { label: 'Medium', value: 'm' },
          { label: 'Large', value: 'l' },
        ]}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Medium' })).toHaveFocus();
    });

    expect(onValueChange).toHaveBeenCalledWith('m');
  });

  it('does nothing on keyboard navigation when all options are disabled', () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Choose a size"
        value={null}
        onChange={onChange}
        options={[
          { label: 'Small', value: 's', disabled: true },
          { label: 'Medium', value: 'm', disabled: true },
        ]}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores unrelated keys', () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="size"
        label="Choose a size"
        value="m"
        onChange={onChange}
        options={getDefaultOptions()}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Choose a size' });
    fireEvent.keyDown(group, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders text labels for the label variant', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        options={getDefaultOptions()}
        variant="label"
      />
    );

    expect(screen.getAllByText('Small').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Large').length).toBeGreaterThan(0);
  });

  it('renders image elements for the image variant', () => {
    render(
      <VariantSelector
        name="finish"
        value="oak"
        onChange={vi.fn()}
        variant="image"
        options={[
          {
            label: 'Oak',
            value: 'oak',
            displayValue: '/oak.jpg',
          },
          {
            label: 'Walnut',
            value: 'walnut',
            displayValue: '/walnut.jpg',
          },
        ]}
      />
    );

    const oakImage = screen.getByRole('img', { name: 'Oak' });
    const walnutImage = screen.getByRole('img', { name: 'Walnut' });

    expect(oakImage).toHaveAttribute('src', '/oak.jpg');
    expect(walnutImage).toHaveAttribute('src', '/walnut.jpg');
  });

  it('does not render images for non-image variants', () => {
    render(
      <VariantSelector
        name="size"
        value="m"
        onChange={vi.fn()}
        variant="label"
        options={getDefaultOptions()}
      />
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies inline background color styles for the color variant', () => {
    render(
      <VariantSelector
        name="colour"
        value="red"
        onChange={vi.fn()}
        variant="color"
        options={[
          {
            label: 'Red',
            value: 'red',
            displayValue: '#ff0000',
          },
          {
            label: 'Blue',
            value: 'blue',
            displayValue: '#0000ff',
          },
        ]}
      />
    );

    const redRadio = screen.getByRole('radio', { name: 'Red' });
    const blueRadio = screen.getByRole('radio', { name: 'Blue' });

    const redLabel = redRadio.closest('label');
    const blueLabel = blueRadio.closest('label');

    const redIndicator = redLabel?.querySelector('.indicator');
    const blueIndicator = blueLabel?.querySelector('.indicator');

    expect(redIndicator).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    expect(blueIndicator).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
  });

  it('renders radios with numeric values and calls onChange with a number', () => {
    const onChange = vi.fn();

    render(
      <VariantSelector
        name="quantity"
        value={2}
        onChange={onChange}
        options={[
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
          { label: 'Three', value: 3 },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Three' }));

    expect(onChange).toHaveBeenCalledWith(3);
  });
});
