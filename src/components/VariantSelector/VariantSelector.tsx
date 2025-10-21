import React, { forwardRef, useId, useMemo, useRef, useState } from 'react';
import './VariantSelector.css';

type VariantValue = string | number;

export type VariantOption = {
  label: string;
  value: VariantValue;
  displayValue?: string; // e.g. hex color code, image URL or label
  disabled?: boolean;
};

export type VariantSelectorProps = {
  name: string;
  value: VariantValue | null;
  onChange: (value: VariantValue) => void;
  options: VariantOption[];
  label?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  wrap?: boolean; // whether arrow navigation circles around or stops at end
  variant?: 'color' | 'image' | 'label';
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
      variant = 'label',
    },
    forwardedRef
  ) => {
    const legendId = useId();
    const groupRef = useRef<HTMLDivElement | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [groupTabIndex, setGroupTabIndex] = useState<0 | -1>(0);

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

    function getLabelFromValue(value: VariantValue | null) {
      const option = options.find((opt) => opt.value === value);
      return option?.label || '';
    }

    return (
      <fieldset
        aria-required={required || undefined}
        className="hoam-variant-selector"
      >
        {label ? (
          <div className="hoam-variant-selector__label">
            <legend
              className="hoam-variant-selector__legend"
              id={legendId}
            >
              {label}
            </legend>
            <span className="hoam-variant-selector__selected">{getLabelFromValue(value)}</span>
          </div>
        ) : null}

        <div
          className="hoam-variant-selector__items"
          ref={groupRef}
          role="radiogroup"
          aria-orientation={orientation}
          data-variant={variant}
          {...(label ? { 'aria-labelledby': legendId } : { 'aria-label': name })}
          tabIndex={groupTabIndex}
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
          // Track focus entering children → make group not tabbable
          onFocusCapture={() => {
            if (groupTabIndex !== -1) setGroupTabIndex(-1);
          }}
          // When focus leaves the entire group, restore tabIndex=0
          onBlurCapture={(e) => {
            const next = e.relatedTarget as Node | null;
            const stillInside = next && groupRef.current && groupRef.current.contains(next);
            if (!stillInside && groupTabIndex !== 0) {
              setGroupTabIndex(0);
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
                      backgroundColor:
                        variant === 'color' ? opt.displayValue.toString() : undefined,
                    }}
                  >
                    {variant === 'image' ? (
                      <img
                        src={opt.displayValue.toString()}
                        alt={opt.label}
                        className="hoam-variant-selector__image"
                      />
                    ) : null}
                    {variant === 'label' && (
                      <span className="hoam-variant-selector__indicator-text">{opt.label}</span>
                    )}
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

export default VariantSelector;
