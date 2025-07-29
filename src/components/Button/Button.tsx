import React from "react";
import "./Button.css";

type ButtonProps = {
  children?: React.ReactNode;
  icon?: string;
  variant?: "primary" | "secondary";
  iconPosition?: "left" | "right";
};

const Button = ({
  children,
  icon,
  iconPosition = "right",
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
      className="hoam-button"
      data-icon-position={iconPosition}
      data-variant={variant}
    >
      {children && <span className="hoam-button__content">{children}</span>}
      {icon && (
        <span className="hoam-button__icon">
          <svg
            className="icon"
            width="1.25em"
            height="1.25em"
            fill="currentColor"
          >
            <use xlinkHref={`/icons/icons.svg#${icon}`} />
          </svg>
        </span>
      )}
    </button>
  );
};

export { Button };
