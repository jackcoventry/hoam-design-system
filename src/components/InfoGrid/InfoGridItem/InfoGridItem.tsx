import clsx from 'clsx';

import { Icon } from '@/components/Icon';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/InfoGrid/InfoGridItem/InfoGridItem.module.css';

export type InfoGridItemProps = {
  /** Main item heading. */
  title: string;
  /** Optional supporting description. */
  description?: string | undefined;
  /** Icon token id shown above the text content. */
  icon: string;
  /** Optional class applied to the item root. */
  className?: string;
};

export function InfoGridItem({ title, description, icon, className }: Readonly<InfoGridItemProps>) {
  return (
    <div className={clsx(styles.root, className)}>
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
