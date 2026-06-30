import { useEffect, useRef, useState } from 'react';
import { useInViewport } from '@/hooks/useInViewport';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ end, duration = 2000, suffix = '', prefix = '', className = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const { ref, isInViewport } = useInViewport(0.5);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInViewport || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Power2.out easing
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(startValue + (end - startValue) * eased);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInViewport, end, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}
