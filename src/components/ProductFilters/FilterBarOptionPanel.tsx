import clsx from 'clsx';

import { Checkbox } from '@/components/Form/Checkbox';
import { Radio } from '@/components/Form/Radio';
import { Stack } from '@/components/Layout';
import type {
  CheckboxGroup,
  FilterValue,
  RadioGroup as RadioGroupType,
} from '@/components/ProductFilters/ProductFilters.types';
import { isOptionSelected, isRadioGroup } from '@/components/ProductFilters/ProductFilters.utils';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/ProductFilters/ProductFilters.module.css';
import utils from '@/styles/Util.module.css';

type FilterBarOptionPanelProps = {
  baseId: string;
  group: CheckboxGroup | RadioGroupType;
  value: FilterValue;
  onToggle: (optionId: string) => void;
};

export function FilterBarOptionPanel({
  baseId,
  group,
  value,
  onToggle,
}: Readonly<FilterBarOptionPanelProps>) {
  const options = group.options;
  const t = useMessages('productFilters');

  return (
    <fieldset className={styles.fieldset}>
      <legend className={utils.srOnly}>{group.label}</legend>
      <Stack>
        <div className={styles.optionList}>
          {options.length > 0 ? (
            options.map((option) => {
              const inputId = `${baseId}-${group.id}-${option.id}`;
              const checked = isOptionSelected(value, group.id, option.id);

              return (
                <label
                  key={option.id}
                  htmlFor={inputId}
                  className={clsx(styles.optionRow, option.disabled && styles.optionRowDisabled)}
                >
                  {isRadioGroup(group) ? (
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
            <p className={styles.emptyState}>{t.noFilters}</p>
          )}
        </div>
      </Stack>
    </fieldset>
  );
}
