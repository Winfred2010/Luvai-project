import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  x?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
  y = 60,
  x = 0,
  duration = 0.8,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[data-reveal-item]');
    const targets = items.length > 0 ? items : [containerRef.current];

    gsap.fromTo(
      targets,
      {
        y,
        x,
        opacity: 0,
      },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
