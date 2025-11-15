import React, {
  createContext,
  ReactNode,
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

export function ModalStackProvider({ children }: ModalStackProviderProps) {
  const [stack, setStack] = useState<string[]>([]);
  const prevOverflowRef = useRef<string>('');

  const register = useCallback((id: string) => {
    setStack((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setStack((prev) => prev.filter((item) => item !== id));
  }, []);

  const isTop = useCallback(
    (id: string) => {
      if (stack.length === 0) return false;
      return stack[stack.length - 1] === id;
    },
    [stack]
  );

  useEffect(() => {
    if (stack.length === 0) {
      document.body.style.overflow = prevOverflowRef.current;
      return;
    }

    if (stack.length === 1) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }, [stack.length]);

  const value = useMemo(
    () => ({
      register,
      unregister,
      isTop,
    }),
    [register, unregister, isTop]
  );

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>;
}

export function useModalStack(id: string, active: boolean) {
  const ctx = useContext(ModalStackContext);

  useEffect(() => {
    if (!ctx || !active) return;
    ctx.register(id);
    return () => {
      ctx.unregister(id);
    };
  }, [ctx, id, active]);

  const isTopMost = ctx ? ctx.isTop(id) : true;

  return { isTopMost };
}
