import { useEffect, useState, useRef } from 'react';
import { Waves } from 'lucide-react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.to(barRef.current, {
      width: '100%',
      duration: 2,
      ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[600] bg-ms-dark flex flex-col items-center justify-center"
    >
      <div className="flex items-center gap-3 mb-8">
        <Waves className="w-8 h-8 text-ms-cyan" />
        <span className="font-display font-bold text-2xl text-ms-lime">
          Maji<span className="text-white">Salama</span>
        </span>
      </div>
      <div className="w-[200px] h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div ref={barRef} className="h-full bg-ms-lime w-0" />
      </div>
    </div>
  );
}
