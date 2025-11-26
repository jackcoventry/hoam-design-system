import React from 'react';
import './RichLink.css';

function RichLink({ href, title, image }) {
  return (
    <a
      href={href}
      className="hoam-rich-link"
    >
      <span className="hoam-rich-link__text">{title}</span>
      <img
        src={image}
        alt=""
        className="hoam-rich-link__image"
      />
    </a>
  );
}

export default RichLink;
