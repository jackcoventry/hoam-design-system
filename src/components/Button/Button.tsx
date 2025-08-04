import React from "react";
import "./Button.css";
import clsx from "clsx";

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  icon?: string;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const Button = ({
  children,
  className = "",
  onClick,
  icon,
  iconPosition = "right",
  variant = "primary",
}: ButtonProps) => {
  const classes = clsx("hoam-button", className);
  return (
    <button
      className={classes}
      data-icon-position={iconPosition}
      data-variant={variant}
      onClick={onClick}
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
