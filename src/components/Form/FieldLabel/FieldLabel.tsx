import clsx from 'clsx';

import styles from '@/components/Form/FieldLabel/FieldLabel.module.css';

export type FieldLabelProps = {
  /** Label content. */
  children: React.ReactNode;
  /** Form control id associated with the label. */
  htmlFor: string;
  /** Optional class applied to the label root. */
  className?: string;
};

export function FieldLabel({ children, htmlFor, className }: Readonly<FieldLabelProps>) {
  return (
    <label
      className={clsx(styles.root, className)}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
