import './FieldWrapper.css';

function FieldWrapper({ children, error }) {
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
