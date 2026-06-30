import { ScrollReveal } from '@/components/ScrollReveal';
import { Smartphone, MapPin, AlertTriangle, Signal } from 'lucide-react';

const features = [
  {
    step: '01',
    icon: Smartphone,
    iconBg: 'bg-[rgba(230,255,43,0.1)]',
    iconColor: 'text-ms-lime',
    title: 'Report Flooding',
    description: 'Dial *384*88# on any phone — no app or internet needed. Describe what you see, send photos via WhatsApp, or tap buttons in our mobile app. Every report creates a data point on our live map.',
    highlight: 'Works on Ksh 1,000 feature phones',
    highlightColor: 'text-ms-lime',
  },
  {
    step: '02',
    icon: MapPin,
    iconBg: 'bg-[rgba(0,229,255,0.1)]',
    iconColor: 'text-ms-cyan',
    title: 'See the Map Fill',
    description: 'Our AI combines community reports with weather data and satellite imagery to build a living flood risk map. Watch danger zones light up in real-time as the picture gets clearer with every report.',
    highlight: 'AI-powered risk prediction',
    highlightColor: 'text-ms-cyan',
  },
  {
    step: '03',
    icon: AlertTriangle,
    iconBg: 'bg-[rgba(255,43,43,0.1)]',
    iconColor: 'text-ms-red',
    title: 'Get Alerts Instantly',
    description: 'When danger is detected, alerts go out immediately via SMS to every registered phone in the area. Smart evacuation routes guide residents to the nearest safe shelter — all without needing mobile data.',
    highlight: 'SMS alerts in under 60 seconds',
    highlightColor: 'text-ms-red',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-ms-warm-dark relative overflow-hidden">
      {/* Tilted Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            perspective: '1000px',
          }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: 'rotateX(60deg) rotateZ(-15deg)',
              transformOrigin: 'center center',
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 79px,
                  rgba(0, 229, 255, 0.08) 79px,
                  rgba(0, 229, 255, 0.08) 80px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 79px,
                  rgba(0, 229, 255, 0.08) 79px,
                  rgba(0, 229, 255, 0.08) 80px
                )
              `,
              animation: 'grid-pulse 4s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Mobile flat grid fallback */}
      <div
        className="absolute inset-0 z-0 pointer-events-none md:hidden opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,229,255,0.1) 39px, rgba(0,229,255,0.1) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,229,255,0.1) 39px, rgba(0,229,255,0.1) 40px)
          `,
        }}
      />

      <div className="content-container section-padding-xl relative z-[5]">
        <ScrollReveal>
          {/* Section Header */}
          <div data-reveal-item>
            <span className="font-mono text-label-md uppercase text-ms-cyan tracking-[0.08em]">
              How It Works
            </span>
            <h2 className="font-display font-semibold text-display-lg md:text-display-lg text-white mt-4">
              Three Steps to Safety
            </h2>
            <p className="text-ms-grey text-body-lg max-w-[640px] mt-4">
              From the first raindrop to the last family reached — our system works in minutes, not hours.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <ScrollReveal
              key={feature.step}
              delay={i * 0.2}
              x={i === 0 ? -60 : i === 2 ? 60 : 0}
              y={i === 1 ? 60 : 0}
            >
              <div
                data-reveal-item
                className="relative bg-white/5 border border-white/10 rounded-[20px] p-8 md:p-10 hover:bg-[rgba(230,255,43,0.05)] hover:border-[rgba(230,255,43,0.2)] transition-all duration-400 easing-default group animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {/* Step Number */}
                <span className="absolute top-6 right-6 font-mono font-bold text-[48px] text-white/10 select-none">
                  {feature.step}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-heading-md text-white mb-3 group-hover:text-ms-lime transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-ms-grey text-body-md">
                  {feature.description}
                </p>

                {/* Highlight */}
                <p className={`font-mono text-label-sm ${feature.highlightColor} mt-5`}>
                  {feature.highlight}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* USSD Highlight Banner */}
        <ScrollReveal delay={0.3}>
          <div
            data-reveal-item
            className="mt-20 glass-panel border border-[rgba(230,255,43,0.2)] hover:border-[rgba(230,255,43,0.4)] transition-all duration-300 rounded-[20px] overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-12">
                <span className="font-mono text-label-md uppercase text-ms-lime tracking-[0.08em]">
                  No Internet? No Problem.
                </span>
                <h3 className="font-display font-bold text-display-sm md:text-display-sm text-white mt-3">
                  Dial *384*88# on Any Phone
                </h3>
                <p className="text-ms-grey text-body-md mt-4 max-w-[500px]">
                  Most Kenyans don&apos;t own smartphones or have reliable data. Our USSD system works on every mobile phone — from the cheapest feature phone to the latest iPhone. Connected through Safaricom and Airtel for nationwide reach.
                </p>
              </div>

              {/* Right - Phone Mockup */}
              <div className="md:w-[320px] bg-ms-near-black/50 flex flex-col items-center justify-center p-8 border-t md:border-t-0 md:border-l border-white/10">
                <div className="bg-ms-dark border-2 border-ms-dark-grey rounded-3xl p-4 w-[180px]">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Signal className="w-3 h-3 text-ms-green" />
                    <span className="font-mono text-body-xs text-ms-grey">Safaricom</span>
                  </div>
                  <div className="bg-ms-soft-black rounded-lg p-3 font-mono text-sm">
                    <p className="text-ms-lime mb-3 text-center">*384*88#</p>
                    <div className="space-y-1.5 text-white/90 text-xs">
                      <p>1. Report Flood</p>
                      <p>2. Check Alerts</p>
                      <p>3. Find Shelter</p>
                      <p>4. View Map</p>
                      <p>5. Help</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-3">
                    <div className="w-8 h-8 rounded-full border border-ms-dark-grey flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border border-ms-grey" />
                    </div>
                  </div>
                </div>
                <p className="font-mono text-body-xs text-ms-grey mt-4">
                  Safaricom / Airtel
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
