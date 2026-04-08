import clsx from 'clsx';
import type { ChangeEvent, JSX } from 'react';

import type { CheckboxGroup, FilterValue, RadioGroup } from './FilterBar.types';
import { getVisibleOptions, isOptionSelected, isRadioGroup } from './filterBar.utils';

import styles from './FilterBar.module.css';

type FilterBarOptionPanelProps = {
  baseId: string;
  group: CheckboxGroup | RadioGroup;
  value: FilterValue;
  query: string;
  onQueryChange: (nextQuery: string) => void;
  onToggle: (optionId: string) => void;
};

export function FilterBarOptionPanel({
  baseId,
  group,
  value,
  query,
  onQueryChange,
  onToggle,
}: Readonly<FilterBarOptionPanelProps>): JSX.Element {
  const visibleOptions = group.searchable ? getVisibleOptions(group.options, query) : group.options;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.visuallyHidden}>{group.label}</legend>

      {group.searchable ? (
        <div className={styles.searchWrap}>
          <label
            className={styles.visuallyHidden}
            htmlFor={`${baseId}-${group.id}-search`}
          >
            Search {group.label}
          </label>
          <input
            id={`${baseId}-${group.id}-search`}
            className={styles.searchInput}
            type="search"
            value={query}
            placeholder={group.searchPlaceholder ?? `Search ${group.label}`}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const nextQuery = event.currentTarget.value;
              onQueryChange(nextQuery);
            }}
          />
        </div>
      ) : null}

      <div className={styles.optionList}>
        {visibleOptions.length > 0 ? (
          visibleOptions.map((option) => {
            const inputId = `${baseId}-${group.id}-${option.id}`;
            const checked = isOptionSelected(value, group.id, option.id);

            return (
              <label
                key={option.id}
                htmlFor={inputId}
                className={clsx(styles.optionRow, option.disabled && styles.optionRowDisabled)}
              >
                <input
                  id={inputId}
                  className={styles.input}
                  type={isRadioGroup(group) ? 'radio' : 'checkbox'}
                  name={group.id}
                  value={option.id}
                  checked={checked}
                  disabled={option.disabled}
                  onChange={() => {
                    onToggle(option.id);
                  }}
                />

                <span className={styles.optionLabel}>{option.label}</span>

                {typeof option.count === 'number' ? (
                  <span className={styles.optionCount}>{option.count}</span>
                ) : null}
              </label>
            );
          })
        ) : (
          <p className={styles.emptyState}>No filters found.</p>
        )}
      </div>
    </fieldset>
  );
}
