import { useRef, useEffect } from "react";

type Callback = () => void | (() => void);

export const useMount = (callback: Callback) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      const clean = callback();
      isMounted.current = true;

      return () => {
        clean && clean();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const getIsBrowser = () => {
  return typeof window !== "undefined";
};

export const generateRandomColors = (numColors: number): string[] => {
  const colors = new Set<string>();

  while (colors.size < numColors) {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    colors.add(color);
  }

  return Array.from(colors);
};
