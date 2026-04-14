import { type MouseEvent, useState } from 'react';

import { BodyText } from '@/components/Common/BodyText';
import { Icon } from '@/components/Icon';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Message/Message.module.css';

export const MessageStatuses = ['info', 'warning', 'error', 'success'];
export type MessageStatus = (typeof MessageStatuses)[number];
export type MessageProps = {
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  status: MessageStatus;
  text?: string | undefined;
  title: string;
  closeMessage?: string;
};

export function Message(props: Readonly<MessageProps>) {
  const t = useMessages('message');
  const { status, text, title, onClose, closeMessage = t.close } = props;

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
          <div className={styles.text}>
            <BodyText>{text}</BodyText>
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
