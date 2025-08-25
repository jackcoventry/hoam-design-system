import React from "react";
import "./Message.css";

type MessageProps = {
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  status: "info" | "warning" | "error" | "success";
  text?: string;
  title: string;
};

function Message({
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
            <svg className="icon" width="2em" height="2em" fill="currentColor">
              <use xlinkHref="/icons/icons.svg#close" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Message;
