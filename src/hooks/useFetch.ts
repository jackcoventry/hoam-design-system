import { useCallback, useEffect, useRef, useState } from 'react';

type UseFetchResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => Promise<void>;
};

type UseFetchOptions = {
  manual?: boolean;
};

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Something went wrong');
}

export function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchResult<T> {
  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<T> => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const text = await response.text();
      const parsed = JSON.parse(text) as unknown;

      return parsed as T;
    },
    [url]
  );

  return useFetchSignal(fetcher, options);
}

export function useFetchSignal<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const manual = options?.manual ?? false;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(!manual);

  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      setData(result);
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      setError(toError(err));
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    if (manual) {
      return () => {
        controllerRef.current?.abort();
      };
    }

    void run();

    return () => {
      controllerRef.current?.abort();
    };
  }, [manual, run]);

  return {
    data,
    error,
    loading,
    reload: run,
  };
}
