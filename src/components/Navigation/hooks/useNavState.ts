import { useEffect, useRef, useState } from 'react';

export function useMegaNavState() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const hoverTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  // Guard to prevent issue relating to keyboard and hover interactivty clashing
  const [isKeyboarding, setIsKeyboarding] = useState(false);
  const kbQuietTimer = useRef<number | null>(null);

  const setKeyboarding = () => {
    setIsKeyboarding(true);
    if (kbQuietTimer.current) clearTimeout(kbQuietTimer.current);
    kbQuietTimer.current = setTimeout(() => setIsKeyboarding(false), 400) as unknown as number;
  };

  const clearHover = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const clearLeave = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const handleTopNavigationOpen = (index: number, delay = 80) => {
    clearLeave();
    clearHover();
    hoverTimer.current = setTimeout(() => {
      setOpenIndex(index);
      setOpenGroupId(null);
    }, delay) as unknown as number;
  };

  const handleAllNavigationClose = (delay = 150) => {
    if (isKeyboarding) return;
    clearHover();
    clearLeave();
    leaveTimer.current = setTimeout(() => {
      setOpenGroupId(null);
      setOpenIndex(null);
    }, delay) as unknown as number;
  };

  useEffect(() => {
    if (openIndex === null) setOpenGroupId(null);
  }, [openIndex]);

  return {
    openIndex,
    setOpenIndex,
    openGroupId,
    setOpenGroupId,
    isKeyboarding,
    setKeyboarding,
    handleTopNavigationOpen,
    handleAllNavigationClose,
    clearLeave,
  };
}
