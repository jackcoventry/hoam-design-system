import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import clsx from 'clsx';

import { Icon } from '@/components/Icon';

import styles from './Checkbox.module.css';
import utils from '@/styles/Util.module.css';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string;
  description?: string;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    id,
    label,
    description,
    className,
    disabled = false,
    indeterminate = false,
    onChange,
    onCheckedChange,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    if (!inputRef.current) {
      throw new Error('Checkbox input ref is not set');
    }

    return inputRef.current;
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <label
        className={clsx(styles.root, disabled && styles.disabled)}
        htmlFor={inputId}
      >
        <span className={styles.control}>
          <input
            {...rest}
            ref={inputRef}
            id={inputId}
            className={clsx(styles.input, utils.focus)}
            type="checkbox"
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            onChange={handleChange}
          />

          <span
            className={clsx(styles.box, utils.focusTarget)}
            aria-hidden="true"
          >
            <span className={styles.icon}>
              <Icon id={indeterminate ? 'dash' : 'check'} />
            </span>
          </span>
        </span>

        <span
          id={labelId}
          className={styles.label}
        >
          {label}
        </span>
      </label>

      {description ? (
        <span
          id={descriptionId}
          className={styles.description}
        >
          {description}
        </span>
      ) : null}
    </div>
  );
});
