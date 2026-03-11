import { useCallback, useEffect, useRef, useState } from 'react';

export function useMegaNavState() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [isKeyboarding, setIsKeyboarding] = useState(false);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kbQuietTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHover = useCallback(() => {
    if (hoverTimer.current !== null) {
      globalThis.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current !== null) {
      globalThis.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const clearKeyboardTimer = useCallback(() => {
    if (kbQuietTimer.current !== null) {
      globalThis.clearTimeout(kbQuietTimer.current);
      kbQuietTimer.current = null;
    }
  }, []);

  const resetNavigation = useCallback(() => {
    setOpenIndex(null);
    setOpenGroupId(null);
  }, []);

  const setKeyboarding = useCallback(() => {
    setIsKeyboarding(true);
    clearKeyboardTimer();

    kbQuietTimer.current = globalThis.setTimeout(() => {
      setIsKeyboarding(false);
      kbQuietTimer.current = null;
    }, 400);
  }, [clearKeyboardTimer]);

  const handleTopNavigationOpen = useCallback(
    (index: number, delay = 80) => {
      clearLeave();
      clearHover();

      hoverTimer.current = globalThis.setTimeout(() => {
        setOpenIndex(index);
        setOpenGroupId(null);
        hoverTimer.current = null;
      }, delay);
    },
    [clearHover, clearLeave]
  );

  const handleAllNavigationClose = useCallback(
    (delay = 150) => {
      if (isKeyboarding) return;

      clearHover();
      clearLeave();

      leaveTimer.current = globalThis.setTimeout(() => {
        resetNavigation();
        leaveTimer.current = null;
      }, delay);
    },
    [clearHover, clearLeave, isKeyboarding, resetNavigation]
  );

  useEffect(() => {
    return () => {
      clearHover();
      clearLeave();
      clearKeyboardTimer();
    };
  }, [clearHover, clearLeave, clearKeyboardTimer]);

  return {
    openIndex,
    setOpenIndex,
    openGroupId,
    setOpenGroupId,
    isKeyboarding,
    setKeyboarding,
    resetNavigation,
    handleTopNavigationOpen,
    handleAllNavigationClose,
    clearHover,
    clearLeave,
  };
}
