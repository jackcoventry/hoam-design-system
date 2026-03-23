import { type MouseEvent, useState } from 'react';
import clsx from 'clsx';

import { Icon } from '@/components/Icon';

import bodyText from '@/components/Common/BodyText.module.css';
import styles from '@/components/Message/Message.module.css';

export type MessageProps = {
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  status: 'info' | 'warning' | 'error' | 'success';
  text?: string | undefined;
  title: string;
  closeMessage?: string;
};

export function Message({
  status,
  text,
  title,
  onClose,
  closeMessage = 'Close message',
}: Readonly<MessageProps>) {
  const [isOpen, setIsOpen] = useState(true);

  function handleClose(event: MouseEvent<HTMLButtonElement>) {
    setIsOpen(false);
    onClose?.(event);
  }

  return (
    <div
      className={styles.root}
      data-status={status}
      data-open={isOpen}
      role="alert"
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        {text ? (
          <div className={clsx(styles.text, bodyText.root)}>
            <p>{text}</p>
          </div>
        ) : null}
      </div>

      {onClose ? (
        <div className={styles.closeWrapper}>
          <button
            className={styles.close}
            aria-label={closeMessage}
            onClick={handleClose}
          >
            <Icon
              id="close"
              size="2em"
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
