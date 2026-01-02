import { useCallback, useRef, useState } from "react";

export default function useTimedError(timeout = 5000) {
  const [error, setError] = useState<string | undefined>(undefined);
  const timerRef = useRef<number | null>(null);

  const setTimedError = useCallback(
    (message: string) => {
      setError(message);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setError(undefined);
        timerRef.current = null;
      }, timeout);
    },
    [timeout]
  );

  const clearError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setError(undefined);
  }, []);

  return {
    error,
    setTimedError,
    clearError,
  };
}
