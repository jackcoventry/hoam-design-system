import { VariantOption, VariantSelector } from '@/components/VariantSelector/VariantSelector';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function setup({
  value = null as string | number | null,
  options = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'red', label: 'Red' },
  ] as VariantOption[],
  label = 'Color',
  orientation = 'horizontal' as 'horizontal' | 'vertical',
  wrap = true,
  onChange = vi.fn(),
} = {}) {
  const user = userEvent.setup();
  render(
    <VariantSelector
      name="color"
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      orientation={orientation}
      wrap={wrap}
      required
    />
  );
  return { user, onChange, options };
}

describe('VariantSelector', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all provided options and links legend via aria-labelledby', () => {
    setup();
    // legend should render and be connected to the radiogroup via aria-labelledby
    const legend = screen.getByText('Color');
    const group = screen.getByRole('radiogroup');
    const labelledby = group.getAttribute('aria-labelledby');
    expect(legend).toBeInTheDocument();
    expect(labelledby).toBeTruthy();
    expect(legend.id).toBe(labelledby);

    // radios exist
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('is controlled: checked reflects value prop', () => {
    setup({ value: 'white' });

    const black = screen.getByRole('radio', { name: 'Black' });
    const white = screen.getByRole('radio', { name: 'White' });

    expect(black).not.toBeChecked();
    expect(white).toBeChecked();
  });

  it('clicking an option triggers onChange with that value', async () => {
    const { user, onChange } = setup({ value: 'black' });
    const red = screen.getByRole('radio', { name: 'Red' });
    await user.click(red);
    expect(onChange).toHaveBeenCalledWith('Red'.toLowerCase()); // value is "red"
  });

  it('radiogroup is focusable and delegates focus to selected radio', () => {
    setup({ value: 'white' });
    const group = screen.getByRole('radiogroup');
    // focus group
    group.focus();
    // it should immediately refocus to the selected radio
    const white = screen.getByRole('radio', { name: 'White' });
    expect(document.activeElement).toBe(white);
    // also confirm tabIndex=0 present
    expect(group).toHaveAttribute('tabIndex', '0');
  });

  it('when no selection, focusing the group moves focus to first enabled option', () => {
    setup({
      value: null,
      options: [
        { value: 'black', label: 'Black', disabled: true },
        { value: 'white', label: 'White' },
        { value: 'red', label: 'Red' },
      ],
    });
    const group = screen.getByRole('radiogroup');
    group.focus();
    const white = screen.getByRole('radio', { name: 'White' });
    expect(document.activeElement).toBe(white);
  });

  it('Left/Right arrows cycle selection with wrap (horizontal)', async () => {
    const { user, onChange, options } = setup({ value: 'black' });
    const group = screen.getByRole('radiogroup');

    // Focus group (delegates to selected "black")
    group.focus();
    const radios = screen.getAllByRole('radio');
    expect(document.activeElement).toBe(radios[0]);

    // Press ArrowLeft should wrap to last
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith(options[2]?.value);

    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(options[2]?.value);
  });

  it('Up/Down arrows work when orientation is vertical', async () => {
    const { user, onChange, options } = setup({
      value: 'black',
      orientation: 'vertical',
    });
    const group = screen.getByRole('radiogroup');
    group.focus();

    // ArrowDown moves forward
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(options[1]?.value);

    // ArrowUp moves back
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(options[0]?.value);
  });

  it('skips disabled options while navigating', async () => {
    const { user, onChange } = setup({
      value: 'black',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'white', label: 'White', disabled: true },
        { value: 'red', label: 'Red' },
      ],
    });
    const group = screen.getByRole('radiogroup');
    group.focus();

    // ArrowRight should skip disabled "white" and land on "red"
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('red');
  });

  it('when wrap is false, navigation stops at the edges', async () => {
    const { user, onChange } = setup({
      value: 'black',
      wrap: false,
    });
    const group = screen.getByRole('radiogroup');
    group.focus();

    // At the first item, ArrowLeft should do nothing
    await user.keyboard('{ArrowLeft}');
    expect(onChange).not.toHaveBeenCalled();

    // Move to last item via repeated Right
    await user.keyboard('{ArrowRight}{ArrowRight}');
    // Called twice: white then red
    expect(onChange).toHaveBeenNthCalledWith(1, 'white');
    expect(onChange).toHaveBeenNthCalledWith(2, 'red');

    onChange.mockClear();
    // At the last item, ArrowRight should do nothing (no wrap)
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards ref to the first radio input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <VariantSelector
        ref={ref}
        name="color"
        label="Color"
        value={null}
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
    );
    const firstRadio = screen.getByRole('radio', { name: 'A' });
    expect(ref.current).toBe(firstRadio);
  });

  it('radios are correctly labelled and grouped', () => {
    setup({ value: null });
    const group = screen.getByRole('radiogroup');
    const radios = within(group).getAllByRole('radio');
    for (const r of radios) {
      expect(r.getAttribute('name')).toBe('color');
      expect(r).toHaveAttribute('aria-label');
    }
  });

  it('supports shift+tab to move to the previous VariantPicker', async () => {
    const user = userEvent.setup();

    function Demo() {
      const [a, setA] = React.useState<string | null>('white');
      const [b, setB] = React.useState<string | null>('red');
      return (
        <>
          <VariantSelector
            name="a"
            label="A"
            value={a}
            onChange={(v) => setA(String(v))}
            options={[
              { value: 'black', label: 'Black' },
              { value: 'white', label: 'White' },
            ]}
          />
          <VariantSelector
            name="b"
            label="B"
            value={b}
            onChange={(v) => setB(String(v))}
            options={[
              { value: 'red', label: 'Red' },
              { value: 'green', label: 'Green' },
            ]}
          />
        </>
      );
    }

    render(<Demo />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'White' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('radio', { name: 'White' })).toHaveFocus();
  });
});
