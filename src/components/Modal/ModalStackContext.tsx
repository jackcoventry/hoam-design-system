import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ModalStackContextValue = {
  register: (id: string) => void;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
};

const ModalStackContext = createContext<ModalStackContextValue | null>(null);

type ModalStackProviderProps = {
  children: ReactNode;
};

export function ModalStackProvider({ children }: Readonly<ModalStackProviderProps>) {
  const [stack, setStack] = useState<string[]>([]);
  const prevOverflowRef = useRef<string>('');
  const previousStackLengthRef = useRef(0);

  const register = useCallback((id: string) => {
    setStack((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setStack((prev) => prev.filter((item) => item !== id));
  }, []);

  const isTop = useCallback(
    (id: string) => {
      if (stack.length === 0) {
        return false;
      }

      return stack.at(-1) === id;
    },
    [stack]
  );

  useEffect(() => {
    const previousLength = previousStackLengthRef.current;
    const currentLength = stack.length;

    // Transition: 0 -> 1+ (lock scroll and remember previous value)
    if (previousLength === 0 && currentLength > 0) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // Transition: 1+ -> 0 (restore previous value)
    if (previousLength > 0 && currentLength === 0) {
      document.body.style.overflow = prevOverflowRef.current;
    }

    previousStackLengthRef.current = currentLength;
  }, [stack.length]);

  useEffect(() => {
    return () => {
      if (previousStackLengthRef.current > 0) {
        document.body.style.overflow = prevOverflowRef.current;
      }
    };
  }, []);

  const value = useMemo<ModalStackContextValue>(
    () => ({
      register,
      unregister,
      isTop,
    }),
    [register, unregister, isTop]
  );

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>;
}

/**
 * Hook for a modal to participate in the global stack
 * - Registers/unregisters when active
 * - Returns whether this modal is currently the top-most one
 * - Falls back to a single modal when no provider is present
 */
export function useModalStack(id: string, active: boolean) {
  const ctx = useContext(ModalStackContext);

  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    if (!active || !register || !unregister) {
      return;
    }

    register(id);

    return () => {
      unregister(id);
    };
  }, [active, id, register, unregister]);

  const isTopMost = ctx?.isTop ? ctx.isTop(id) : true;

  return { isTopMost };
}
