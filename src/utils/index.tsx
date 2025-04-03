import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  const handleResize = useCallback(
    () => setWindowDimensions(getWindowDimensions()),
    [],
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ...windowDimensions, isMobile: windowDimensions.width < 1024 };
};

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  ignoreRef?: React.RefObject<HTMLElement>,
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (ignoreRef && ignoreRef.current?.contains(e.target as Node)) {
          e.stopPropagation();
        }
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [callback]);
};

export const useInterval = (callback: () => void, delay?: number | null) => {
  const savedCallback = useRef(() => {});

  const [reset, setReset] = useState(false);

  const toggleReset = useCallback(() => setReset((prev) => !prev), []);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(id);
    }
  }, [delay, reset]);

  return toggleReset;
};

export const useOnScreen = (
  ref: RefObject<HTMLElement> | null,
  threshold: number,
) => {
  const [isOnScreen, setIsOnScreen] = useState(
    !("IntersectionObserver" in window),
  );

  useEffect(() => {
    if (!ref || !ref.current || isOnScreen) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(
              (threshold) => entry.intersectionRatio >= threshold,
            );

          setIsOnScreen(isIntersecting);
        });
      },
      { threshold },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, isOnScreen]);

  return isOnScreen;
};

export const debounce = (
  callback: (...args: unknown[]) => void,
  wait: number,
): typeof callback => {
  let timeoutId: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
