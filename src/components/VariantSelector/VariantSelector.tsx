import { forwardRef, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from '@/components/VariantSelector/VariantSelector.module.css';

export type VariantValue = string | number;

export type VariantOption = {
  label: string;
  value: VariantValue;
  displayValue?: string;
  disabled?: boolean;
};

export type VariantSelectorProps = {
  name: string;
  value: VariantValue | null;
  onChange: (value: VariantValue) => void;
  options: VariantOption[];
  label?: string | undefined;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical' | undefined;
  wrap?: boolean;
  variant?: 'color' | 'image' | 'label' | undefined;
};

function focusNextTick(fn: () => void) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
  } else {
    setTimeout(fn, 0);
  }
}

export const VariantSelector = forwardRef<HTMLInputElement, VariantSelectorProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      label,
      required,
      orientation = 'horizontal',
      wrap = true,
      variant = 'label',
    },
    forwardedRef
  ) => {
    const legendId = useId();
    const groupRef = useRef<HTMLDivElement | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [groupTabIndex, setGroupTabIndex] = useState<0 | -1>(0);

    function setFirstInputRef(el: HTMLInputElement | null) {
      if (!el) {
        return;
      }

      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef && 'current' in forwardedRef) {
        forwardedRef.current = el;
      }
    }

    const currentIndex = useMemo(
      () => options.findIndex((option) => option.value === value),
      [options, value]
    );

    function nextEnabledIndex(from: number, dir: 1 | -1) {
      const length = options.length;
      let index = from;

      for (let step = 0; step < length; step += 1) {
        index += dir;

        if (wrap) {
          if (index < 0) {
            index = length - 1;
          }

          if (index >= length) {
            index = 0;
          }
        }

        if (index < 0 || index >= length) {
          return from;
        }

        if (!options[index]?.disabled) {
          return index;
        }
      }

      return from;
    }

    function handleArrow(move: 1 | -1) {
      const start = currentIndex >= 0 ? currentIndex : -1;
      const target =
        start === -1
          ? options.findIndex((option) => !option.disabled)
          : nextEnabledIndex(start, move);

      if (target !== -1 && target !== start) {
        const targetOption = options[target];

        if (!targetOption) {
          return;
        }

        onChange(targetOption.value);

        focusNextTick(() => {
          inputRefs.current[target]?.focus();
        });
      }
    }

    const isHorizontal = orientation === 'horizontal';

    function getLabelFromValue(selectedValue: VariantValue | null) {
      const option = options.find((opt) => opt.value === selectedValue);
      return option?.label || '';
    }

    return (
      <fieldset
        aria-required={required || undefined}
        className={styles.root}
      >
        {label ? (
          <div className={styles.label}>
            <legend
              className={styles.legend}
              id={legendId}
            >
              {label}
            </legend>
            <span className={styles.selected}>{getLabelFromValue(value)}</span>
          </div>
        ) : null}

        <div
          className={styles.items}
          ref={groupRef}
          role="radiogroup"
          aria-orientation={orientation}
          data-variant={variant}
          {...(label ? { 'aria-labelledby': legendId } : { 'aria-label': name })}
          tabIndex={groupTabIndex}
          onFocus={(event) => {
            if (event.target === event.currentTarget) {
              const start =
                currentIndex >= 0 ? currentIndex : options.findIndex((option) => !option.disabled);

              if (start !== -1) {
                inputRefs.current[start]?.focus();
              }
            }
          }}
          onFocusCapture={() => {
            if (groupTabIndex !== -1) {
              setGroupTabIndex(-1);
            }
          }}
          onBlurCapture={(event) => {
            const next = event.relatedTarget as Node | null;
            const stillInside = next && groupRef.current?.contains(next);

            if (!stillInside && groupTabIndex !== 0) {
              setGroupTabIndex(0);
            }
          }}
          onKeyDown={(event) => {
            const left = event.key === 'ArrowLeft';
            const right = event.key === 'ArrowRight';
            const up = event.key === 'ArrowUp';
            const down = event.key === 'ArrowDown';

            const relevant = isHorizontal ? left || right : up || down;

            if (!relevant) {
              return;
            }

            event.preventDefault();

            if (left || up) {
              handleArrow(-1);
            }

            if (right || down) {
              handleArrow(1);
            }
          }}
        >
          {options.map((option, index) => {
            const selected = value === option.value;

            const setRef = (el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;

              if (index === 0 && el) {
                setFirstInputRef(el);
              }
            };

            return (
              <label
                key={option.value}
                className={styles.item}
              >
                <input
                  ref={setRef}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={selected}
                  disabled={option.disabled}
                  required={required}
                  onChange={() => onChange(option.value)}
                  aria-label={option.label}
                  className={clsx(styles.radio, 'sr-only')}
                />
                <span className={styles.visual}>
                  <span
                    className={styles.indicator}
                    style={{
                      backgroundColor:
                        variant === 'color' ? option.displayValue?.toString() : undefined,
                    }}
                  >
                    {variant === 'image' ? (
                      <img
                        src={option.displayValue?.toString()}
                        alt={option.label}
                        className={styles.image}
                      />
                    ) : null}

                    {variant === 'label' ? (
                      <span className={styles.indicatorText}>{option.label}</span>
                    ) : null}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }
);

VariantSelector.displayName = 'VariantSelector';
