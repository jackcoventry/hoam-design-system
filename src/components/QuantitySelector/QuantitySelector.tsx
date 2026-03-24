import { forwardRef, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { clamp } from '@/utils/clamp';

import utils from '@/components/Common/Util.module.css';
import styles from '@/components/QuantitySelector/QuantitySelector.module.css';

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  name?: string;
  ariaLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
}

export const QuantitySelector = forwardRef<HTMLInputElement, QuantitySelectorProps>(
  (
    {
      value = 0,
      onChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      id,
      name,
      ariaLabel,
      incrementLabel = 'Increase quantity',
      decrementLabel = 'Decrease quantity',
    },
    ref
  ) => {
    const ariaMin = Number.isFinite(min) ? min : undefined;
    const ariaMax = Number.isFinite(max) ? max : undefined;
    const latestValueRef = useRef(value);
    const atMin = value <= min;
    const atMax = value >= max;

    const [text, setText] = useState(String(value));

    useEffect(() => {
      setText(String(clamp(value, min, max)));
    }, [value, min, max]);

    useEffect(() => {
      latestValueRef.current = value;
    }, [value]);

    const apply = (next: number) => {
      onChange(clamp(next, min, max));
    };

    const update = (dir: 1 | -1, multiplier = 1) => {
      apply(latestValueRef.current + dir * multiplier);
    };

    const pressTimeout = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
    const pressDirection = useRef<1 | -1 | 0>(0);

    const stopPress = () => {
      pressDirection.current = 0;

      if (pressTimeout.current) {
        globalThis.clearTimeout(pressTimeout.current);
        pressTimeout.current = null;
      }
    };

    const pressTick = (dir: 1 | -1, delay: number) => {
      if (pressDirection.current !== dir) {
        return;
      }

      update(dir);

      const nextDelay = Math.max(50, delay - 10);

      pressTimeout.current = globalThis.setTimeout(() => {
        pressTick(dir, nextDelay);
      }, nextDelay);
    };

    const startPress = (dir: 1 | -1) => {
      stopPress();
      pressDirection.current = dir;
      update(dir);

      pressTimeout.current = globalThis.setTimeout(() => {
        pressTick(dir, 140);
      }, 300);
    };

    const createButtonHandlers = (dir: 1 | -1) => ({
      onMouseDown: () => startPress(dir),
      onMouseUp: stopPress,
      onMouseLeave: stopPress,
      onTouchStart: () => startPress(dir),
      onTouchEnd: stopPress,
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          startPress(dir);
        }
      },
      onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          stopPress();
        }
      },
    });

    useEffect(() => {
      return () => {
        stopPress();
      };
    }, []);

    return (
      <div className={styles.root}>
        {ariaLabel ? <span className={styles.label}>{ariaLabel}</span> : null}

        <div className={styles.inner}>
          <button
            aria-label={decrementLabel}
            disabled={atMin}
            className={clsx(styles.button, utils.focus)}
            data-position="left"
            {...createButtonHandlers(-1)}
          >
            −
          </button>

          <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            value={text}
            role="spinbutton"
            readOnly
            disabled
            aria-label={ariaLabel}
            aria-valuenow={value}
            aria-valuemin={ariaMin}
            aria-valuemax={ariaMax}
            className={styles.input}
          />

          <button
            aria-label={incrementLabel}
            disabled={atMax}
            {...createButtonHandlers(1)}
            className={clsx(styles.button, utils.focus)}
            data-position="right"
          >
            +
          </button>
        </div>
      </div>
    );
  }
);

QuantitySelector.displayName = 'QuantitySelector';
