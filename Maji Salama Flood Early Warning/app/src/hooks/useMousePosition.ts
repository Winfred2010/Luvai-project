import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(lerpFactor: number = 1): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerpFactor;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerpFactor;

      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
        normalizedX: (currentRef.current.x / window.innerWidth) * 2 - 1,
        normalizedY: (currentRef.current.y / window.innerHeight) * 2 - 1,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, lerpFactor]);

  return position;
}
