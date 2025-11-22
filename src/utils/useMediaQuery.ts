import { useEffect, useState } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if ('addEventListener' in media) {
      media.addEventListener('change', listener);
    } else {
      // @ts-expect-error legacy
      media.addListener(listener);
    }

    setMatches(media.matches);

    return () => {
      if ('removeEventListener' in media) {
        media.removeEventListener('change', listener);
      } else {
        // @ts-expect-error legacy
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
