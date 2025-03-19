import { useState, useEffect, useCallback } from "react";

const useTimer = (initialTime: number | null | undefined = 0, onTimeUpdate: (time: number | null) => void) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(initialTime ?? 0);

  useEffect(() => {
    setElapsedTime(initialTime ?? 0);
  }, [initialTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 0.1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, onTimeUpdate]);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    onTimeUpdate(null);
  }, [onTimeUpdate]);

  return { isRunning, elapsedTime, startTimer, pauseTimer, resetTimer };
};

export default useTimer;