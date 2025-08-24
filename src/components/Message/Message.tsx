import React from "react";
import "./Message.css";

type MessageProps = {
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  pinned?: boolean;
  status: "info" | "warning" | "error" | "success";
  text?: string;
  title: string;
};

function Message({
  pinned,
  status = "info",
  text,
  title,
  onClose,
}: Readonly<MessageProps>) {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(false);
    onClose?.(e);
  };

  return (
    <div
      className="hoam-message"
      data-status={status}
      data-pinned={pinned}
      data-open={isOpen}
      role="alert"
    >
      <div className="hoam-message__content">
        {title && <h2 className="hoam-message__title">{title}</h2>}
        {text && (
          <div className="hoam-message__text | body-text">
            <p>{text}</p>
          </div>
        )}
      </div>
      {onClose && (
        <div className="hoam-message__close-wrapper">
          <button
            className="hoam-message__close"
            aria-label="Close message"
            onClick={handleClose}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default Message;
