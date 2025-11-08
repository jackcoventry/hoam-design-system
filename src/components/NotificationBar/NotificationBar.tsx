import { clearIntervalSafe, clearTimeoutSafe } from '@/utils/clearIntervalTimeout';
import { usePrefersReducedMotion } from '@/utils/usePrefersReducedMotion';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

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

  // States
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [isFading, setIsFading] = useState(false);

  // Refs
  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

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
    if (!paused && messages.length > 1) {
      intervalRef.current = window.setInterval(
        () => {
          advance();
        },
        Math.max(1000, interval)
      );
    }
    return () => clearIntervalSafe(intervalRef);
  }, [paused, prefersReducedMotion, messages.length, interval, fadeTime]);

  const stopTemporarily = () => {
    clearTimeoutSafe(resumeTimeoutRef);
    setPaused(true);
  };

  const scheduleResume = () => {
    clearTimeoutSafe(resumeTimeoutRef);
    if (!prefersReducedMotion) {
      resumeTimeoutRef.current = window.setTimeout(
        () => {
          setPaused(false);
        },
        Math.max(500, restartDelay)
      );
    }
  };

  const fadeStyle: CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: isFading ? 0 : 1,
        transition: `opacity ${fadeTime}ms linear`,
      };
  const ariaLive: 'polite' | 'off' = paused ? 'off' : 'polite';

  return (
    <section
      aria-label={ariaLabel}
      onMouseEnter={stopTemporarily}
      onMouseLeave={scheduleResume}
      onFocus={stopTemporarily}
      onBlur={scheduleResume}
      tabIndex={0}
    >
      <output
        aria-live={ariaLive}
        aria-atomic="true"
        style={fadeStyle}
        dangerouslySetInnerHTML={{ __html: messages[index] }}
      />
    </section>
  );
}

export default NotificationBar;
