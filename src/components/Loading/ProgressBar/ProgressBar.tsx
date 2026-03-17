import { useId } from 'react';
import clsx from 'clsx';

import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  formatValueText?: (percentage: number, value: number, min: number, max: number) => string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label = 'Loading progress',
  showValue = true,
  className,
  labelClassName,
  valueClassName,
  formatValueText,
}: Readonly<ProgressBarProps>) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;

  const hasValue = typeof value === 'number';
  const safeMax = max <= min ? min + 1 : max;
  const clampedValue = hasValue ? clamp(value, min, safeMax) : 0;

  const percentage =
    hasValue && safeMax > min ? ((clampedValue - min) / (safeMax - min)) * 100 : undefined;

  const valueText =
    hasValue && percentage !== undefined
      ? formatValueText
        ? formatValueText(percentage, clampedValue, min, safeMax)
        : `${Math.round(percentage)}%`
      : 'In progress';

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.header}>
        <span
          id={labelId}
          className={clsx(styles.label, labelClassName)}
        >
          {label}
        </span>

        {showValue ? (
          <span
            className={clsx(styles.valueText, valueClassName)}
            aria-live="off"
          >
            {valueText}
          </span>
        ) : null}
      </div>

      {hasValue ? (
        <progress
          className={styles.progress}
          value={clampedValue}
          max={safeMax}
          aria-labelledby={labelId}
        >
          {valueText}
        </progress>
      ) : (
        <progress
          className={clsx(styles.progress, styles.indeterminate)}
          aria-labelledby={labelId}
        >
          {valueText}
        </progress>
      )}
    </div>
  );
}
