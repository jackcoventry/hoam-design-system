import { useCallback, useRef, useState } from 'react';

export type AsyncState<TData, TError extends Error = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: TError };

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown error');
}

type UseAsyncTaskResult<TResult, TError extends Error = Error> = {
  state: AsyncState<TResult, TError>;
  reset: () => void;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: TResult | null;
  error: TError | null;
};

export function useAsyncTask<TResult, TError extends Error = Error>(
  task: (signal: AbortSignal) => Promise<TResult>
): UseAsyncTaskResult<TResult, TError> & {
  run: () => Promise<TResult>;
};

export function useAsyncTask<TInput, TResult, TError extends Error = Error>(
  task: (input: TInput, signal: AbortSignal) => Promise<TResult>
): UseAsyncTaskResult<TResult, TError> & {
  run: (input: TInput) => Promise<TResult>;
};

export function useAsyncTask<TInput, TResult, TError extends Error = Error>(
  task:
    | ((signal: AbortSignal) => Promise<TResult>)
    | ((input: TInput, signal: AbortSignal) => Promise<TResult>)
) {
  const [state, setState] = useState<AsyncState<TResult, TError>>({
    status: 'idle',
  });

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (input?: TInput): Promise<TResult> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setState({ status: 'loading' });

      try {
        const result =
          input === undefined
            ? await (task as (signal: AbortSignal) => Promise<TResult>)(controller.signal)
            : await (task as (input: TInput, signal: AbortSignal) => Promise<TResult>)(
                input,
                controller.signal
              );

        if (controller.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        setState({ status: 'success', data: result });
        return result;
      } catch (error) {
        if (controller.signal.aborted) {
          throw error;
        }

        const resolvedError = toError(error) as TError;

        setState({
          status: 'error',
          error: resolvedError,
        });

        throw resolvedError;
      }
    },
    [task]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: 'idle' });
  }, []);

  return {
    state,
    run,
    reset,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    data: state.status === 'success' ? state.data : null,
    error: state.status === 'error' ? state.error : null,
  };
}
