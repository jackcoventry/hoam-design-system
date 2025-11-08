import { usePrefersReducedMotion } from '@/utils/usePrefersReducedMotion';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type NotificationBannerProps = {
  messages: Array<React.ReactNode>;
  interval?: number;
  restartDelay?: number;
  ariaLabel?: string;
};

function clearIntervalSafe(ref: React.RefObject<number | null>) {
  if (ref.current !== null) {
    clearInterval(ref.current);
    ref.current = null;
  }
}
function clearTimeoutSafe(ref: React.RefObject<number | null>) {
  if (ref.current !== null) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

function NotificationBar({
  messages,
  interval = 4000,
  restartDelay = 2000,
  ariaLabel = 'Notifications',
}: Readonly<NotificationBannerProps>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);

  const safeMessages = useMemo(() => (messages?.length ? messages : ['']), [messages]);

  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    clearIntervalSafe(intervalRef);
    if (!paused && !prefersReducedMotion && safeMessages.length > 1) {
      intervalRef.current = window.setInterval(
        () => {
          setIndex((i) => (i + 1) % safeMessages.length);
        },
        Math.max(1000, interval)
      );
    }
    return () => clearIntervalSafe(intervalRef);
  }, [paused, prefersReducedMotion, safeMessages.length, interval]);

  useEffect(() => {
    setPaused(prefersReducedMotion);
  }, [prefersReducedMotion]);

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
      >
        {safeMessages[index]}
      </output>

      {safeMessages.length > 1 && (
        <div aria-live="off">
          <small>
            {index + 1} of {safeMessages.length}
          </small>
        </div>
      )}
    </section>
  );
}

export default NotificationBar;
