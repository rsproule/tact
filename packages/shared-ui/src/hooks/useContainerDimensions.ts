import { useState, useEffect, RefObject } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useContainerDimensions(ref: RefObject<HTMLElement>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Update on mount
    updateDimensions();

    // Update on window resize
    window.addEventListener('resize', updateDimensions);

    // Update when ref changes
    const observer = new ResizeObserver(updateDimensions);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, [ref]);

  return dimensions;
}