import { clearIntervalSafe, clearTimeoutSafe } from '@/utils/clearIntervalTimeout';
import { usePrefersReducedMotion } from '@/utils/usePrefersReducedMotion';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './NotificationBar.css';

type NotificationBannerProps = {
  messages: Array<React.ReactNode>;
  ariaLabel?: string;
};

function NotificationBar({
  messages,
  ariaLabel = 'Notifications',
}: Readonly<NotificationBannerProps>) {
  // Base settings
  const interval = 5000;
  const restartDelay = 2000;
  const fadeTime = 500;

  // User preferences
  const prefersReducedMotion = usePrefersReducedMotion();

  // Derived flags
  const hasMultipleMessages = messages.length > 1;
  const canRotate = hasMultipleMessages && !prefersReducedMotion;

  // States
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(!canRotate);
  const [isFading, setIsFading] = useState(false);

  // Refs
  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  // React to system setting or messages length changing
  useEffect(() => {
    // If rotation isn't allowed (1 item or reduced motion), ensure paused
    setPaused(!canRotate);
    if (messages.length > 0 && index >= messages.length) {
      setIndex(0);
    }
  }, [canRotate, messages.length]);

  const advance = () => {
    if (messages.length <= 1) return;

    if (prefersReducedMotion) {
      // This will bypass fading effect if active
      setIndex((i) => (i + 1) % messages.length);
      return;
    }

    // If reduced motion is off, activate fading effect.
    setIsFading(true);
    clearTimeoutSafe(fadeTimeoutRef);
    fadeTimeoutRef.current = window.setTimeout(
      () => {
        setIndex((i) => (i + 1) % messages.length);
        setIsFading(false);
      },
      Math.max(1, fadeTime)
    );
  };

  useEffect(() => {
    clearIntervalSafe(intervalRef);
    if (canRotate && !paused) {
      intervalRef.current = window.setInterval(advance, Math.max(1000, interval));
    }
    return () => clearIntervalSafe(intervalRef);
  }, [canRotate, paused, interval, fadeTime]); // advance is stable enough via refs used above

  const stopTemporarily = () => {
    if (!canRotate) return;
    clearTimeoutSafe(resumeTimeoutRef);
    setPaused(true);
  };

  const scheduleResume = () => {
    if (!canRotate) return;
    clearTimeoutSafe(resumeTimeoutRef);
    resumeTimeoutRef.current = window.setTimeout(
      () => setPaused(false),
      Math.max(500, restartDelay)
    );
  };

  const fadeStyle: CSSProperties =
    canRotate && !prefersReducedMotion
      ? { opacity: isFading ? 0 : 1, transition: `opacity ${fadeTime}ms linear` }
      : {};

  const ariaLive: 'polite' | 'off' = canRotate && !paused ? 'polite' : 'off';

  // Conditionally attach focusability + handlers ONLY when more than one message is present
  const interactiveProps = canRotate
    ? {
        tabIndex: 0,
        onMouseEnter: stopTemporarily,
        onMouseLeave: scheduleResume,
        onFocus: stopTemporarily as React.FocusEventHandler<HTMLElement>,
        onBlur: scheduleResume as React.FocusEventHandler<HTMLElement>,
      }
    : {};

  return (
    <section
      aria-label={ariaLabel}
      {...interactiveProps}
      className="hoam-notification-bar"
    >
      <output
        aria-live={ariaLive}
        aria-atomic="true"
        style={fadeStyle}
        dangerouslySetInnerHTML={{
          __html: hasMultipleMessages ? messages[index] : (messages[0] ?? null),
        }}
      />
    </section>
  );
}

export default NotificationBar;
