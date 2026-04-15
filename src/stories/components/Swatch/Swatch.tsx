import styles from './Swatch.module.css';

type SwatchProps = {
  name: string;
  value: string;
  cssVar?: string;
};

export function Swatch({ name, value, cssVar }: Readonly<SwatchProps>) {
  return (
    <div className={styles.root}>
      <div
        className={styles.color}
        style={{
          backgroundColor: value,
        }}
      />
      <div className={styles.content}>
        <strong className={styles.name}>{name}</strong>
        {cssVar ? <code className={styles.code}>{cssVar}</code> : null}
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
}
