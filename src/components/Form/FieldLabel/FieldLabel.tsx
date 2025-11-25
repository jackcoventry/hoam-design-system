import React from 'react';
import './FieldLabel.css';

type FieldTypeProps = {
  children: React.ReactNode;
  htmlFor: string;
};

function FieldLabel({ children, htmlFor }: Readonly<FieldTypeProps>) {
  return (
    <label
      className="hoam-field-label"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

export default FieldLabel;
