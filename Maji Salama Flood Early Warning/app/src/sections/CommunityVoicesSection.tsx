import { useState, useCallback, useEffect, useRef } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Before MajiSalama, we only knew the river was coming when we saw it. Last month, I got an SMS alert 50 minutes before the flood reached our area. My family had time to move to higher ground.",
    name: 'Grace Wanjiku',
    role: 'Community Resident',
    location: 'Mathare, Nairobi',
    initials: 'GW',
    color: '#E6FF2B',
  },
  {
    quote: "The USSD system is a game-changer. I don't have a smartphone, but I can still report flooding and receive alerts on my basic phone. Every Kenyan deserves this kind of protection.",
    name: 'John Ochieng',
    role: 'Community Leader',
    location: 'Kibra, Nairobi',
    initials: 'JO',
    color: '#00E5FF',
  },
  {
    quote: "As first responders, real-time information saves lives. MajiSalama's live map shows us exactly which areas are worst hit and which routes are still passable. We've cut our response time in half.",
    name: 'Amina Hassan',
    role: 'Red Cross Volunteer',
    location: 'Nairobi County',
    initials: 'AH',
    color: '#FF9F2B',
  },
  {
    quote: "I run a community center in Karen. When the alert system tells us flooding is coming, we open our doors as a shelter. The coordination between MajiSalama and local organizations is incredible.",
    name: 'Peter Mwangi',
    role: 'Shelter Coordinator',
    location: 'Karen, Nairobi',
    initials: 'PM',
    color: '#C4FF00',
  },
  {
    quote: "The AI predictions are surprisingly accurate. It predicted the Mukuru flooding three days in advance using rainfall data. We evacuated 200 families before the waters rose.",
    name: 'Dr. Sarah Kimani',
    role: 'Disaster Risk Researcher',
    location: 'University of Nairobi',
    initials: 'SK',
    color: '#FF2B91',
  },
  {
    quote: "My grandmother lives alone in Eastleigh. Now she gets SMS alerts automatically when her area is at risk. I have peace of mind knowing she'll be warned even if I'm not there.",
    name: 'David Otieno',
    role: 'Family Member',
    location: 'Eastleigh, Nairobi',
    initials: 'DO',
    color: '#A2E2FF',
  },
];

export function CommunityVoicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => {
      if (direction === 'next') return (prev + 1) % testimonials.length;
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 'next' : 'prev');
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length + 3) % testimonials.length) - 3;

    if (normalizedDiff === 0) {
      return {
        transform: 'translateZ(200px) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (Math.abs(normalizedDiff) === 1) {
      return {
        transform: `translateZ(100px) translateX(${normalizedDiff * 60}%) scale(0.85) rotateY(${normalizedDiff * -15}deg)`,
        opacity: 0.5,
        zIndex: 5,
      };
    } else if (Math.abs(normalizedDiff) === 2) {
      return {
        transform: `translateZ(0px) translateX(${normalizedDiff * 55}%) scale(0.7) rotateY(${normalizedDiff * -25}deg)`,
        opacity: 0.2,
        zIndex: 1,
      };
    } else {
      return {
        transform: 'translateZ(-200px) scale(0.5)',
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  return (
    <section id="community" className="bg-ms-dark relative overflow-hidden">
      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="content-container section-padding-xl relative z-[5]">
        <ScrollReveal>
          {/* Section Header */}
          <div data-reveal-item className="text-center mb-16">
            <span className="font-mono text-label-md uppercase text-ms-lime tracking-[0.08em]">
              Community Voices
            </span>
            <h2 className="font-display font-semibold text-display-lg md:text-display-lg text-white mt-4">
              What Communities Say
            </h2>
            <p className="text-ms-grey text-body-lg max-w-[600px] mx-auto mt-4">
              From residents to responders — the people who rely on MajiSalama every rainy season.
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Carousel */}
        <ScrollReveal>
          <div
            data-reveal-item
            ref={containerRef}
            className="relative h-[450px] md:h-[500px]"
            style={{ perspective: '1200px' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Cards */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="absolute w-[300px] md:w-[420px] transition-all duration-600"
                  style={{
                    ...getCardStyle(i),
                    transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="bg-ms-near-black border border-white/10 rounded-[20px] p-8 md:p-12 min-h-[320px] md:min-h-[360px] flex flex-col">
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-ms-lime opacity-50 mb-4" />

                    {/* Quote */}
                    <p className="font-display font-medium text-heading-md text-white leading-[1.3] italic flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Divider */}
                    <div className="w-10 h-px bg-white/10 my-6" />

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm"
                        style={{ backgroundColor: `${testimonial.color}20`, color: testimonial.color, border: `2px solid ${testimonial.color}40` }}
                      >
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-heading-sm text-white">
                          {testimonial.name}
                        </p>
                        <p className="font-mono text-body-xs text-ms-grey uppercase">
                          {testimonial.role}
                        </p>
                        <p className="text-body-xs text-ms-text-muted mt-0.5">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigate('prev')}
              className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-ms-lime hover:text-black hover:border-ms-lime transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-ms-lime hover:text-black hover:border-ms-lime transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </ScrollReveal>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setActiveIndex(i);
                  setTimeout(() => setIsTransitioning(false), 600);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-ms-lime w-6' : 'bg-ms-dark-grey hover:bg-ms-grey'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
