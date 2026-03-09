import styles from '@/components/Form/FieldLabel/FieldLabel.module.css';

type FieldTypeProps = {
  children: React.ReactNode;
  htmlFor: string;
};

export function FieldLabel({ children, htmlFor }: Readonly<FieldTypeProps>) {
  return (
    <label
      className={styles.root}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
