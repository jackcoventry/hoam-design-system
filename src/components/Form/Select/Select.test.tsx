import { type ChangeEvent, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from '@/components/Form/Select/Select';

describe('Select', () => {
  it('renders a label when provided', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('does not render a label row when label is not provided', () => {
    render(
      <Select
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(screen.queryByText('Country')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the display value from option children', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="fr">France</Select.Option>
      </Select>
    );

    expect(screen.getByText('United Kingdom', { selector: 'span' })).toBeInTheDocument();
  });

  it('renders the display value from option label prop when children are absent', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option
          value="uk"
          label="United Kingdom"
        />
      </Select>
    );

    expect(screen.getByText('United Kingdom', { selector: 'span' })).toBeInTheDocument();
  });

  it('falls back to the raw value when no option match exists', () => {
    render(
      <Select
        label="Country"
        value="unknown"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(screen.getByText('unknown', { selector: 'span' })).toBeInTheDocument();
  });

  it('renders display value from placeholder text when selected', () => {
    render(
      <Select
        label="Country"
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Select a country</Select.Placeholder>
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(screen.getByText('Select a country', { selector: 'span' })).toBeInTheDocument();
  });

  it('renders a placeholder option with disabled and hidden attributes', () => {
    const { container } = render(
      <Select
        value=""
        onChange={() => {}}
      >
        <Select.Placeholder>Select a country</Select.Placeholder>
      </Select>
    );

    const option = container.querySelector('option');

    expect(option).toBeInTheDocument();
    expect(option).toHaveAttribute('value', '');
    expect(option).toBeDisabled();
    expect(option).toHaveAttribute('hidden');
    expect(option).toHaveTextContent('Select a country');
  });

  it('renders placeholder value text fallback when placeholder has non-empty value and no text', () => {
    render(
      <Select
        label="Example"
        value="placeholder"
        onChange={() => {}}
      >
        <Select.Placeholder value="placeholder">{''}</Select.Placeholder>
      </Select>
    );

    expect(screen.getByText('placeholder', { selector: 'span' })).toBeInTheDocument();
  });

  it('builds lookup values from options inside optgroups', () => {
    render(
      <Select
        label="Country"
        value="fr"
        onChange={() => {}}
      >
        <Select.OptGroup label="Europe">
          <Select.Option value="uk">United Kingdom</Select.Option>
          <Select.Option value="fr">France</Select.Option>
        </Select.OptGroup>
      </Select>
    );

    expect(screen.getByText('France', { selector: 'span' })).toBeInTheDocument();
  });

  it('extracts text from option children for display value', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">{['United', ' Kingdom']}</Select.Option>
      </Select>
    );

    expect(screen.getByText('United Kingdom', { selector: 'span' })).toBeInTheDocument();
  });

  it('calls onChange with a string value in single-select mode', () => {
    const onChange =
      vi.fn<(value: string | string[], event: ChangeEvent<HTMLSelectElement>) => void>();

    render(
      <Select
        value="uk"
        onChange={onChange}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="fr">France</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'fr' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toBe('fr');
    expect(onChange.mock.calls[0]?.[1]).toBeDefined();
  });

  it('calls onChange with selected values in multi-select mode', () => {
    const onChange =
      vi.fn<(value: string | string[], event: ChangeEvent<HTMLSelectElement>) => void>();

    render(
      <Select
        multiple
        value={['uk']}
        onChange={onChange}
        label="Countries"
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="fr">France</Select.Option>
        <Select.Option value="de">Germany</Select.Option>
      </Select>
    );

    const select = screen.getByRole('listbox');

    Object.defineProperty(select, 'selectedOptions', {
      configurable: true,
      value: [{ value: 'fr' }, { value: 'de' }],
    });

    fireEvent.change(select);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toEqual(['fr', 'de']);
    expect(onChange.mock.calls[0]?.[1]).toBeDefined();
  });

  it('renders joined display values in multi-select mode', () => {
    render(
      <Select
        multiple
        label="Countries"
        value={['uk', 'fr']}
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="fr">France</Select.Option>
        <Select.Option value="de">Germany</Select.Option>
      </Select>
    );

    expect(screen.getByText('United Kingdom, France', { selector: 'span' })).toBeInTheDocument();
  });

  it('falls back to raw values for unmatched values in multi-select mode', () => {
    render(
      <Select
        multiple
        label="Countries"
        value={['uk', 'unknown']}
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(screen.getByText('United Kingdom, unknown', { selector: 'span' })).toBeInTheDocument();
  });

  it('passes id and name through to the select element', () => {
    render(
      <Select
        id="country"
        name="country"
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveAttribute('id', 'country');
    expect(select).toHaveAttribute('name', 'country');
  });

  it('passes required and disabled props through to the select element', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
        required
        disabled
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
  });

  it('forwards refs to the select element', () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select
        ref={ref}
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current?.value).toBe('uk');
  });

  it('uses the provided option value as fallback option text when no label or children exist', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk" />
      </Select>
    );

    expect(screen.getAllByText('uk').length).toBeGreaterThan(0);
  });

  it('renders optgroup labels correctly', () => {
    render(
      <Select
        value="uk"
        onChange={() => {}}
      >
        <Select.OptGroup label="Europe">
          <Select.Option value="uk">United Kingdom</Select.Option>
        </Select.OptGroup>
      </Select>
    );

    expect(screen.getByRole('group')).toHaveAttribute('label', 'Europe');
  });

  it('uses an auto-generated id when one is not provided', () => {
    render(
      <Select
        label="Country"
        value="uk"
        onChange={() => {}}
      >
        <Select.Option value="uk">United Kingdom</Select.Option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveAttribute('id');
    expect(select.getAttribute('id')).toBeTruthy();
  });

  it('exports compound subcomponents', () => {
    expect(Select.Option).toBeDefined();
    expect(Select.OptGroup).toBeDefined();
    expect(Select.Placeholder).toBeDefined();
  });
});
