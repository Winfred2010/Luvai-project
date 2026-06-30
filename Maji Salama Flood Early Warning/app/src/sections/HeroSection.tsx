import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Simplex noise for particle flow field
function simplexNoise2D(x: number, y: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function noise2D(x: number, y: number, t: number): number {
  const nx = Math.floor(x);
  const ny = Math.floor(y);
  const fx = x - nx;
  const fy = y - ny;

  const a = simplexNoise2D(nx + t * 0.1, ny);
  const b = simplexNoise2D(nx + 1 + t * 0.1, ny);
  const c = simplexNoise2D(nx + t * 0.1, ny + 1);
  const d = simplexNoise2D(nx + 1 + t * 0.1, ny + 1);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

// River basin waypoints (normalized 0-1)
const riverWaypoints = [
  [0.1, 0.2], [0.2, 0.25], [0.35, 0.45], [0.4, 0.55],
  [0.5, 0.6], [0.6, 0.5], [0.65, 0.55], [0.7, 0.7],
  [0.7, 0.8], [0.8, 0.85], [0.9, 0.9],
];

const tributary1 = [
  [0.4, 0.55], [0.35, 0.65], [0.3, 0.75],
];

const tributary2 = [
  [0.6, 0.5], [0.7, 0.42], [0.8, 0.35],
];

// Catmull-Rom spline interpolation
function catmullRom(p0: number[], p1: number[], p2: number[], p3: number[], t: number): number[] {
  const t2 = t * t;
  const t3 = t2 * t;
  return [
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
  ];
}

function drawSpline(ctx: CanvasRenderingContext2D, points: number[][], canvasWidth: number, canvasHeight: number, progress: number, color: string, width: number, opacity: number) {
  const totalSegments = points.length - 1;
  const currentSegment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
  const segmentProgress = (progress * totalSegments) - currentSegment;

  if (currentSegment < 0) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity;

  ctx.beginPath();

  for (let i = 0; i <= currentSegment; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const steps = i === currentSegment ? Math.max(1, Math.floor(segmentProgress * 20)) : 20;

    for (let j = 0; j < steps; j++) {
      const t = j / 20;
      const [x, y] = catmullRom(p0, p1, p2, p3, t);
      if (i === 0 && j === 0) {
        ctx.moveTo(x * canvasWidth, y * canvasHeight);
      } else {
        ctx.lineTo(x * canvasWidth, y * canvasHeight);
      }
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

interface HeroSectionProps {
  loaded: boolean;
}

export function HeroSection({ loaded }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLImageElement>(null);
  const paintProgressRef = useRef(0);
  const mousePos = useMousePosition(0.15);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; color: string;
  }>>([]);
  const timeRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const isVisibleRef = useRef(true);

  // Initialize particles
  useEffect(() => {
    const particles = [];
    const colors = ['#00E5FF', '#0055FF', '#A2E2FF'];
    const colorWeights = [0.6, 0.3, 0.1];

    for (let i = 0; i < 400; i++) {
      const rand = Math.random();
      let color = colors[0];
      let cumulative = 0;
      for (let j = 0; j < colorWeights.length; j++) {
        cumulative += colorWeights[j];
        if (rand < cumulative) {
          color = colors[j];
          break;
        }
      }

      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.6,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.3,
        color,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Canvas animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // Semi-transparent clear for trails
    ctx.fillStyle = 'rgba(8, 8, 8, 0.15)';
    ctx.fillRect(0, 0, w, h);

    timeRef.current += 0.0003;

    const mouseX = mousePos.x;
    const mouseY = mousePos.y - canvas.getBoundingClientRect().top;

    // Update and draw particles
    const particles = particlesRef.current;
    for (const p of particles) {
      // Flow field
      const angle = noise2D(p.x * 0.003, p.y * 0.003, timeRef.current) * Math.PI * 2;
      const speed = 0.5 + noise2D(p.x * 0.001, p.y * 0.001, timeRef.current * 0.5) * 1.5;

      p.vx += Math.cos(angle) * speed * 0.1;
      p.vy += Math.sin(angle) * speed * 0.1;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        const force = (100 - dist) / 100 * 2;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Damping
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Draw painting stroke
    const progress = paintProgressRef.current;
    drawSpline(ctx, riverWaypoints, w, h, progress, '#00E5FF', 4, 0.7);
    drawSpline(ctx, tributary1, w, h, Math.min(1, progress * 1.5), '#00E5FF', 2, 0.4);
    drawSpline(ctx, tributary2, w, h, Math.min(1, progress * 1.3), '#00E5FF', 2, 0.4);

    // Burst on completion
    if (progress > 0.95) {
      const burstProgress = (progress - 0.95) / 0.05;
      const endPoint = riverWaypoints[riverWaypoints.length - 1];
      const bx = endPoint[0] * w;
      const by = endPoint[1] * h;

      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const dist = burstProgress * 60;
        ctx.beginPath();
        ctx.arc(
          bx + Math.cos(angle) * dist,
          by + Math.sin(angle) * dist * 0.5,
          2 * burstProgress,
          0, Math.PI * 2
        );
        ctx.fillStyle = '#00E5FF';
        ctx.globalAlpha = (1 - burstProgress) * 0.8;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [mousePos]);

  // Start/stop animation based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // ScrollTrigger for painting progress
  useGSAP(() => {
    if (!sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        paintProgressRef.current = self.progress;
      },
    });
  }, { scope: sectionRef });

  // Entrance animation
  useGSAP(() => {
    if (!loaded || !contentRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.19, 1, 0.22, 1)' } });

    tl.fromTo(
      contentRef.current.querySelector('.status-row'),
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      0.2
    );

    tl.fromTo(
      contentRef.current.querySelector('.hero-line-1'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.3
    );

    tl.fromTo(
      contentRef.current.querySelector('.hero-line-2'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.45
    );

    tl.fromTo(
      contentRef.current.querySelector('.hero-sub'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.5
    );

    tl.fromTo(
      contentRef.current.querySelector('.hero-ctas'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.7
    );

    if (mascotRef.current) {
      tl.fromTo(
        mascotRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8 },
        0
      );
    }
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden bg-ms-dark"
    >
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full h-[60%] z-[1]"
      />

      {/* Starfield dots */}
      <div className="absolute inset-0 z-[0] pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60%] z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.4) 40%, transparent 70%)',
        }}
      />

      {/* Mascot */}
      <img
        ref={mascotRef}
        src="/assets/maji-mascot.png"
        alt="Maji - the MajiSalama elephant mascot"
        className="absolute right-[5%] md:right-[8%] bottom-[15%] w-[200px] md:w-[320px] h-auto z-[3] opacity-0 drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 0 40px rgba(0,229,255,0.2))',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[5] content-container pt-32 md:pt-40 pb-20 md:pb-20 min-h-[100dvh] flex flex-col justify-center"
      >
        {/* Status Row */}
        <div className="status-row flex items-center gap-3 opacity-0">
          <span className="w-2 h-2 rounded-full bg-ms-green animate-pulse-dot" />
          <span className="font-mono text-label-sm uppercase text-ms-green tracking-wider">
            Live Monitoring
          </span>
          <span className="font-mono text-body-xs text-ms-grey">
            Nairobi, Kenya
          </span>
        </div>

        {/* Spacer */}
        <div className="h-6" />

        {/* Heading */}
        <h1 className="hero-line-1 font-display font-bold text-hero-heading md:text-hero-heading text-ms-lime leading-[0.95] opacity-0"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
          Early Warnings
        </h1>
        <h1 className="hero-line-2 font-display font-bold text-hero-heading md:text-hero-heading text-white leading-[0.95] opacity-0"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
          Save Lives
        </h1>

        {/* Sub-heading */}
        <p className="hero-sub text-ms-grey text-body-lg max-w-[560px] mt-6 opacity-0">
          Real-time flood prediction and emergency alerts for Kenya&apos;s communities —{' '}
          <span className="text-ms-lime">no internet required</span>.
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap gap-4 mt-12 opacity-0">
          <button className="flex items-center gap-2 bg-ms-lime text-black font-display font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-ms-light-lime hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 easing-default">
            <MapPin className="w-4 h-4" />
            Explore the Map
          </button>
          <button className="flex items-center gap-2 bg-transparent text-white font-display font-semibold text-sm px-8 py-3.5 rounded-full border border-white/30 hover:border-ms-lime hover:text-ms-lime active:scale-[0.98] transition-all duration-300">
            <Phone className="w-4 h-4" />
            Dial *384*88#
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2">
        <div
          className="w-px h-[60px] animate-scroll-indicator"
          style={{
            background: 'linear-gradient(to bottom, #E6FF2B, transparent)',
          }}
        />
        <span className="font-mono text-label-sm text-ms-grey uppercase">Scroll</span>
      </div>
    </section>
  );
}
