import React from "react";
import "./Message.css";

type MessageProps = {
  pinned?: boolean;
  status: "info" | "warning" | "error" | "success";
  text: string;
  title: string;
};

function Message({
  pinned,
  status = "info",
  text,
  title,
}: Readonly<MessageProps>) {
  return (
    <div className="hoam-message" data-status={status} data-pinned={pinned}>
      {title && <h4 className="hoam-message__title">{title}</h4>}
      {text && <p className="hoam-message__text">{text}</p>}
    </div>
  );
}

export default Message;
