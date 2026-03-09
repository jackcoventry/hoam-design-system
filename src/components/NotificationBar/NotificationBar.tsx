import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { clearIntervalSafe, clearTimeoutSafe } from '@/utils/clearIntervalTimeout';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import './NotificationBar.css';

type NotificationBarProps = {
  messages: React.ReactNode[];
  ariaLabel?: string;
};

const INTERVAL = 5000;
const RESTART_DELAY = 2000;
const FADE_TIME = 500;

function NotificationBar({
  messages,
  ariaLabel = 'Notifications',
}: Readonly<NotificationBarProps>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const hasMultipleMessages = messages.length > 1;
  const canRotate = hasMultipleMessages && !prefersReducedMotion;

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  const paused = !canRotate || userPaused;

  const safeIndex = index < messages.length ? index : 0;
  const currentMessage = messages[safeIndex] ?? null;

  const advance = useCallback(() => {
    if (messages.length <= 1) return;

    if (prefersReducedMotion) {
      setIndex((currentIndex) => (currentIndex + 1) % messages.length);
      return;
    }

    setIsFading(true);
    clearTimeoutSafe(fadeTimeoutRef);

    fadeTimeoutRef.current = globalThis.setTimeout(
      () => {
        setIndex((currentIndex) => (currentIndex + 1) % messages.length);
        setIsFading(false);
      },
      Math.max(1, FADE_TIME)
    );
  }, [messages.length, prefersReducedMotion]);

  useEffect(() => {
    clearIntervalSafe(intervalRef);

    if (canRotate && !paused) {
      intervalRef.current = globalThis.setInterval(advance, Math.max(1000, INTERVAL));
    }

    return () => {
      clearIntervalSafe(intervalRef);
    };
  }, [advance, canRotate, paused]);

  useEffect(() => {
    return () => {
      clearTimeoutSafe(resumeTimeoutRef);
      clearTimeoutSafe(fadeTimeoutRef);
      clearIntervalSafe(intervalRef);
    };
  }, []);

  const stopTemporarily = () => {
    if (!canRotate) return;

    clearTimeoutSafe(resumeTimeoutRef);
    setUserPaused(true);
  };

  const scheduleResume = () => {
    if (!canRotate) return;

    clearTimeoutSafe(resumeTimeoutRef);
    resumeTimeoutRef.current = globalThis.setTimeout(
      () => {
        setUserPaused(false);
      },
      Math.max(500, RESTART_DELAY)
    );
  };

  const fadeStyle: CSSProperties =
    canRotate && !prefersReducedMotion
      ? {
          opacity: isFading ? 0 : 1,
          transition: `opacity ${FADE_TIME}ms linear`,
        }
      : {};

  const ariaLive: 'polite' | 'off' = canRotate && !paused ? 'polite' : 'off';

  const interactiveProps = canRotate
    ? {
        tabIndex: 0,
        onMouseEnter: stopTemporarily,
        onMouseLeave: scheduleResume,
        onFocus: stopTemporarily,
        onBlur: scheduleResume,
      }
    : {};

  return (
    <section
      aria-label={ariaLabel}
      className="hoam-notification-bar"
      {...interactiveProps}
    >
      <output
        aria-live={ariaLive}
        aria-atomic="true"
        style={fadeStyle}
      >
        {currentMessage}
      </output>
    </section>
  );
}

export default NotificationBar;
