import clsx from 'clsx';
import type { ChangeEvent, JSX } from 'react';

import { Checkbox } from '@/components/Form/Checkbox';
import { Radio } from '@/components/Form/Radio';

import { Stack } from '../Layout';

import type { CheckboxGroup, FilterValue, RadioGroup as RadioGroupType } from './FilterBar.types';
import { getVisibleOptions, isOptionSelected, isRadioGroup } from './filterBar.utils';

import styles from './FilterBar.module.css';
import formStyles from '@/components/Form/Form.module.css';
import utils from '@/styles/Util.module.css';

type FilterBarOptionPanelProps = {
  baseId: string;
  group: CheckboxGroup | RadioGroupType;
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
  const textFieldClasses = clsx(formStyles.textField, utils.focus);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.visuallyHidden}>{group.label}</legend>
      <Stack>
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
              className={textFieldClasses}
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
                  {isRadioGroup(group) ? (
                    // <RadioGroup legend="Preferred contact method">

                    <Radio
                      name={group.id}
                      label={option.label}
                      value={option.id}
                      checked={checked}
                      onCheckedChange={() => {
                        onToggle(option.id);
                      }}
                    />
                  ) : (
                    // </RadioGroup>
                    <Checkbox
                      id={inputId}
                      name={group.id}
                      value={option.id}
                      label={option.label}
                      checked={checked}
                      onCheckedChange={() => {
                        onToggle(option.id);
                      }}
                    />
                  )}

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
      </Stack>
    </fieldset>
  );
}
