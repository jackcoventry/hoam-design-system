import styles from '@/components/Message/Message.module.css';
import clsx from 'clsx';
import { useState } from 'react';

export type MessageProps = {
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  status: 'info' | 'warning' | 'error' | 'success';
  text?: string | undefined;
  title: string;
};

export function Message({ status = 'info', text, title, onClose }: Readonly<MessageProps>) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(false);
    onClose?.(e);
  };

  return (
    <div
      className={styles.root}
      data-status={status}
      data-open={isOpen}
      role="alert"
    >
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {text && (
          <div className={clsx(styles.text, 'body-text')}>
            <p>{text}</p>
          </div>
        )}
      </div>
      {onClose && (
        <div className={styles.closeWrapper}>
          <button
            className={styles.close}
            aria-label="Close message"
            onClick={handleClose}
          >
            <svg
              className="icon"
              width="2em"
              height="2em"
              fill="currentColor"
            >
              <use xlinkHref="/icons/icons.svg#close" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
