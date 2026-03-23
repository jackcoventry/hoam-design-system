import clsx from 'clsx';

import { Icon } from '@/components/Icon';
import { IconId } from '@/design-tokens/icons';

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
        <Icon
          id={icon as IconId}
          size="3em"
        />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
