import React, { forwardRef, useId, useMemo, useRef } from 'react';
import './VariantSelector.css';

type VariantValue = string | number;

export type VariantOption = {
  value: VariantValue;
  label: string;
  name: string;
  type?: string; // 'color' | 'image'
  disabled?: boolean;
  description?: string;
};

export type VariantSelectorProps = {
  name: string;
  value: VariantValue | null;
  onChange: (value: VariantValue) => void;
  options: VariantOption[];
  label?: string;
  showLabels?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  wrap?: boolean; // whether arrow navigation circles around or stops at end
};

function focusNextTick(fn: () => void) {
  if (typeof queueMicrotask === 'function') queueMicrotask(fn);
  else setTimeout(fn, 0);
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
      showLabels = true,
    },
    forwardedRef
  ) => {
    const legendId = useId();
    const groupRef = useRef<HTMLDivElement | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Forward the first radio input to parent
    function setFirstInputRef(el: HTMLInputElement | null) {
      if (!el) return;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef && 'current' in forwardedRef) {
        forwardedRef.current = el;
      }
    }

    const currentIndex = useMemo(
      () => options.findIndex((o) => o.value === value),
      [options, value]
    );

    function nextEnabledIndex(from: number, dir: 1 | -1) {
      const len = options.length;
      let i = from;

      for (let step = 0; step < len; step++) {
        i = i + dir;
        if (wrap) {
          if (i < 0) i = len - 1;
          if (i >= len) i = 0;
        }
        if (i < 0 || i >= len) return from; // no wrap: stop at edges
        if (!options[i].disabled) return i;
      }
      return from;
    }

    function handleArrow(move: 1 | -1) {
      const start = currentIndex >= 0 ? currentIndex : -1;
      const target =
        start === -1 ? options.findIndex((o) => !o.disabled) : nextEnabledIndex(start, move);

      if (target !== -1 && target !== start) {
        const targetVal = options[target].value;
        onChange(targetVal);
        focusNextTick(() => inputRefs.current[target]?.focus());
      }
    }

    const isHorizontal = orientation === 'horizontal';

    return (
      <fieldset
        aria-required={required || undefined}
        className="hoam-variant-selector"
      >
        {label ? <legend id={legendId}>{label}</legend> : null}

        <div
          className="hoam-variant-selector__items"
          ref={groupRef}
          role="radiogroup"
          aria-orientation={orientation}
          {...(label ? { 'aria-labelledby': legendId } : { 'aria-label': name })}
          tabIndex={0}
          onFocus={(e) => {
            // Only when the group itself receives focus (not a child)
            if (e.target === e.currentTarget) {
              const start =
                currentIndex >= 0 ? currentIndex : options.findIndex((o) => !o.disabled);
              if (start !== -1) {
                inputRefs.current[start]?.focus();
              }
            }
          }}
          onKeyDown={(e) => {
            const left = e.key === 'ArrowLeft';
            const right = e.key === 'ArrowRight';
            const up = e.key === 'ArrowUp';
            const down = e.key === 'ArrowDown';

            const relevant = isHorizontal ? left || right : up || down;
            if (!relevant) return;

            // prevent default scrolling and native non-wrapping behavior
            e.preventDefault();

            if (left || up) handleArrow(-1);
            if (right || down) handleArrow(1);
          }}
        >
          {options.map((opt, idx) => {
            const selected = value === opt.value;
            const setRef = (el: HTMLInputElement | null) => {
              inputRefs.current[idx] = el;
              if (idx === 0 && el) setFirstInputRef(el);
            };

            // TODO: add colors or images
            // Also, pull this into separate component
            return (
              <label
                key={opt.value}
                className="hoam-variant-selector__item"
              >
                <input
                  ref={setRef}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  disabled={opt.disabled}
                  required={required}
                  onChange={() => onChange(opt.value)}
                  aria-label={opt.label}
                  className="hoam-variant-selector__radio | sr-only"
                />
                <span className="hoam-variant-selector__visual">
                  <span
                    className="hoam-variant-selector__indicator"
                    style={{
                      backgroundColor: opt.type === 'color' ? opt.value.toString() : undefined,
                    }}
                  >
                    {opt.type === 'image' ? (
                      <img
                        src={opt.value.toString()}
                        alt={opt.label}
                        className="hoam-variant-selector__image"
                      />
                    ) : null}
                  </span>
                  {showLabels && <span className="hoam-variant-selector__label">{opt.label}</span>}
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

export default VariantSelector;
