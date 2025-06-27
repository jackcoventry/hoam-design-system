import React from "react";
import "./Button.css";

type ButtonProps = {
  children?: React.ReactNode;
  icon?: string;
  iconPosition?: "left" | "right";
};

const Button = ({ children, icon, iconPosition = "right" }: ButtonProps) => {
  return (
    <button className="hoam-button" data-icon-position={iconPosition}>
      {children && <span className="button__content">{children}</span>}
      {icon && (
        <span className="hoam-button__icon">
          <svg className="icon" width="1em" height="1em" fill="currentColor">
            <use xlinkHref={`/icons/icons.svg#${icon}`} />
          </svg>
        </span>
      )}
    </button>
  );
};

export { Button };
