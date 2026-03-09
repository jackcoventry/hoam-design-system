import { PropsWithChildren } from 'react';
import './FieldWrapper.css';

type Props = {
  error?: string | undefined;
};

function FieldWrapper({ children, error }: PropsWithChildren<Props>) {
  return (
    <div className="hoam-field-wrapper">
      <div className="hoam-field-wrapper__content">{children}</div>
      {error && (
        <div
          className="hoam-field-wrapper-error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default FieldWrapper;
