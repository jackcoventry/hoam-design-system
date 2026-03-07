import { Button } from '@/components/Button/Button';

import './ErrorPanel.css';

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="hoam-error-panel">
      <img
        src="/mindfullness.svg"
        alt="An illustration of a woman meditating"
        className="hoam-error-panel__image"
      />
      <h2 className="hoam-error-panel__title">{message}</h2>
      <Button
        as="a"
        href="/"
        className="hoam-error-panel__button"
      >
        Return to homepage
      </Button>
    </div>
  );
}

export default ErrorPanel;
