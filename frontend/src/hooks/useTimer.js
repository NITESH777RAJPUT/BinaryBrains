import { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    startRef.current = Date.now();
    setSeconds(0);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    return {
      seconds,
      startedAt: startRef.current ? new Date(startRef.current).toISOString() : null,
    };
  };

  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
    startRef.current = null;
  };

  return { seconds, isRunning, start, stop, reset };
};

export default useTimer;

