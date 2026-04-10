import type { ChangeEvent, JSX } from 'react';

import type { FilterValue, RangeGroup } from './ProductFilters.types';
import { clamp, getRangeValue, setRangeValue } from './ProductFilters.utils';

import styles from './ProductFilters.module.css';
import utils from '@/styles/Util.module.css';

type FilterBarRangePanelProps = {
  baseId: string;
  group: RangeGroup;
  value: FilterValue;
  onChange: (nextValue: FilterValue) => void;
};

export function FilterBarRangePanel({
  baseId,
  group,
  value,
  onChange,
}: Readonly<FilterBarRangePanelProps>): JSX.Element {
  const current = getRangeValue(value, group.id);
  const step = group.step ?? 1;

  const minValue = typeof current?.min === 'number' ? current.min : group.min;
  const maxValue = typeof current?.max === 'number' ? current.max : group.max;

  const safeMin = clamp(Math.min(minValue, maxValue), group.min, group.max);
  const safeMax = clamp(Math.max(minValue, maxValue), group.min, group.max);

  const percentageMin = ((safeMin - group.min) / (group.max - group.min)) * 100;
  const percentageMax = ((safeMax - group.min) / (group.max - group.min)) * 100;

  return (
    <div className={styles.rangePanelBody}>
      <div className={styles.rangeInputs}>
        <label className={styles.rangeField}>
          <span className={styles.rangeFieldLabel}>Min</span>
          <input
            className={styles.numberInput}
            type="number"
            inputMode="numeric"
            min={group.min}
            max={group.max}
            step={step}
            value={safeMin}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const nextMin = Number(event.currentTarget.value);

              if (Number.isNaN(nextMin)) {
                return;
              }

              onChange(
                setRangeValue(value, group.id, {
                  min: clamp(nextMin, group.min, safeMax),
                  max: safeMax,
                })
              );
            }}
          />
        </label>

        <label className={styles.rangeField}>
          <span className={styles.rangeFieldLabel}>Max</span>
          <input
            className={styles.numberInput}
            type="number"
            inputMode="numeric"
            min={group.min}
            max={group.max}
            step={step}
            value={safeMax}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const nextMax = Number(event.currentTarget.value);

              if (Number.isNaN(nextMax)) {
                return;
              }

              onChange(
                setRangeValue(value, group.id, {
                  min: safeMin,
                  max: clamp(nextMax, safeMin, group.max),
                })
              );
            }}
          />
        </label>
      </div>

      <div className={styles.dualSlider}>
        <div
          className={styles.sliderTrack}
          aria-hidden="true"
        >
          <div
            className={styles.sliderRange}
            style={{
              left: `${percentageMin}%`,
              right: `${100 - percentageMax}%`,
            }}
          />
        </div>

        <label
          className={utils.srOnly}
          htmlFor={`${baseId}-${group.id}-min`}
        >
          Minimum {group.label}
        </label>
        <input
          id={`${baseId}-${group.id}-min`}
          className={styles.slider}
          type="range"
          min={group.min}
          max={group.max}
          step={step}
          value={safeMin}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextMin = Number(event.currentTarget.value);

            onChange(
              setRangeValue(value, group.id, {
                min: clamp(nextMin, group.min, safeMax),
                max: safeMax,
              })
            );
          }}
        />

        <label
          className={utils.srOnly}
          htmlFor={`${baseId}-${group.id}-max`}
        >
          Maximum {group.label}
        </label>
        <input
          id={`${baseId}-${group.id}-max`}
          className={styles.slider}
          type="range"
          min={group.min}
          max={group.max}
          step={step}
          value={safeMax}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextMax = Number(event.currentTarget.value);

            onChange(
              setRangeValue(value, group.id, {
                min: safeMin,
                max: clamp(nextMax, safeMin, group.max),
              })
            );
          }}
        />
      </div>

      <div
        className={styles.rangeSummary}
        aria-live="polite"
      >
        <span>{group.minLabel ?? `£${group.min}`}</span>
        {/* <span>
          Selected: £{safeMin} – £{safeMax}
        </span> */}
        <span>{group.maxLabel ?? `£${group.max}`}</span>
      </div>
    </div>
  );
}
