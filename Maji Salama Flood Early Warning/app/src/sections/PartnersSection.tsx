import { ScrollReveal } from '@/components/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import Marquee from 'react-fast-marquee';

const partnerCategories = [
  {
    label: 'TECHNOLOGY PARTNERS',
    logos: [
      { name: 'Safaricom', color: '#00A650', style: 'font-bold' },
      { name: 'Airtel', color: '#FF0000', style: 'font-bold italic' },
      { name: 'Google.org', color: '#4285F4', style: 'font-normal' },
      { name: 'OpenStreetMap', color: '#7EBC6F', style: 'font-medium' },
    ],
  },
  {
    label: 'RESEARCH & GOVERNMENT',
    logos: [
      { name: 'University of Nairobi', color: '#003366', style: 'font-serif' },
      { name: 'Kenya Met Department', color: '#0066CC', style: 'font-medium' },
      { name: 'Nairobi County', color: '#CC0000', style: 'font-bold' },
    ],
  },
  {
    label: 'COMMUNITY ORGANIZATIONS',
    logos: [
      { name: 'Red Cross Kenya', color: '#FF0000', style: 'font-bold' },
      { name: 'Map Kibera', color: '#FF6600', style: 'font-medium' },
      { name: 'Code for Africa', color: '#00CCFF', style: 'font-mono' },
    ],
  },
];

const marqueeNames = [
  'Safaricom', 'Airtel', 'Google.org', 'OpenStreetMap', 'University of Nairobi',
  'Kenya Met Department', 'Nairobi County', 'Red Cross Kenya', 'Map Kibera', 'Code for Africa',
  'MajiSalama', 'Safaricom', 'Airtel', 'Google.org', 'OpenStreetMap',
];

export function PartnersSection() {
  return (
    <section id="partners" className="bg-ms-warm-black relative overflow-hidden">
      <div className="content-container section-padding-lg relative z-[5]">
        <ScrollReveal>
          {/* Section Header */}
          <div data-reveal-item>
            <span className="font-mono text-label-md uppercase text-ms-amber tracking-[0.08em]">
              Partners & Supporters
            </span>
            <h2 className="font-display font-semibold text-display-lg md:text-display-lg text-white mt-4">
              Built Together
            </h2>
            <p className="text-ms-grey text-body-lg max-w-[720px] mt-4">
              MajiSalama is made possible by a coalition of technology partners, research institutions, government agencies, and community organizations working together for a safer Kenya.
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee Banner */}
        <ScrollReveal delay={0.2}>
          <div data-reveal-item className="mt-12 mb-12 opacity-30">
            <Marquee speed={30} pauseOnHover gradient={false}>
              {marqueeNames.map((name, i) => (
                <span key={i} className="font-mono text-body-sm text-ms-grey mx-4 flex items-center">
                  {name}
                  <span className="mx-4 text-ms-dark-grey">&middot;</span>
                </span>
              ))}
            </Marquee>
          </div>
        </ScrollReveal>

        {/* Partner Categories */}
        {partnerCategories.map((category, catIndex) => (
          <ScrollReveal key={category.label} delay={catIndex * 0.2}>
            <div data-reveal-item className={catIndex > 0 ? 'mt-12' : ''}>
              <h4 className="font-mono text-label-sm uppercase text-ms-grey tracking-[0.1em] mb-6">
                {category.label}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
                {category.logos.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex items-center justify-center h-16 group"
                  >
                    <span
                      className={`text-lg md:text-xl ${logo.style} grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400 cursor-default`}
                      style={{ color: logo.color }}
                    >
                      {logo.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}

        {/* CTA Row */}
        <ScrollReveal delay={0.3}>
          <div data-reveal-item className="flex flex-wrap justify-center gap-4 mt-20">
            <button className="flex items-center gap-2 bg-ms-lime text-black font-display font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-ms-light-lime hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 easing-default">
              Partner With Us
            </button>
            <button className="flex items-center gap-2 bg-transparent text-white font-display font-semibold text-sm px-8 py-3.5 rounded-full border border-white/30 hover:border-ms-lime hover:text-ms-lime active:scale-[0.98] transition-all duration-300">
              View All Partners
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(26,23,20,1))',
        }}
      />
    </section>
  );
}
