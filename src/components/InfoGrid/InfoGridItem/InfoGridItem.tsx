import clsx from 'clsx';

import styles from '@/components/InfoGrid/InfoGridItem/InfoGridItem.module.css';

export type InfoGridItemProps = {
  title: string;
  description?: string | undefined;
  icon: string;
};

export function InfoGridItem({ title, description, icon }: Readonly<InfoGridItemProps>) {
  return (
    <div className={clsx(styles.root, 'mb-lg lg:mb-0')}>
      <span className={styles.icon}>
        <svg
          className="icon"
          width="3em"
          height="3em"
          fill="currentColor"
        >
          <use xlinkHref={`/icons/icons.svg#${icon}`} />
        </svg>
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
