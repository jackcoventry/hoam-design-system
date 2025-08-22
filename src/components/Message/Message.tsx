import React from "react";

type MessageProps = {
  status: "info" | "warning" | "error" | "success";
  text: string;
  title: string;
};

function Message({ status = "info", text, title }: Readonly<MessageProps>) {
  return (
    <div className="hoam-message" data-status={status}>
      {title && <h4 className="hoam-message__title">{title}</h4>}
      {text && <p className="hoam-message__text">{text}</p>}
    </div>
  );
}

export default Message;
