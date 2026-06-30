import { ScrollReveal } from '@/components/ScrollReveal';
import { CategoryTag } from '@/components/CategoryTag';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    category: 'TECHNOLOGY',
    tagVariant: 'lime' as const,
    title: 'How Our AI Predicts Floods 3 Days in Advance',
    description: 'Combining satellite imagery, weather station data, and community reports to build machine learning models that forecast flooding with 87% accuracy up to 72 hours ahead.',
    date: 'June 8, 2025',
    image: '/assets/article-ai-technology.jpg',
    tall: true,
  },
  {
    category: 'IMPACT STORY',
    tagVariant: 'amber' as const,
    title: 'Saving 200 Families in Mukuru',
    description: 'The early warning system that gave residents of Mukuru Kwa Njenga enough time to evacuate before the worst flooding in a decade.',
    date: 'May 22, 2025',
    image: '/assets/article-mukuru-impact.jpg',
    tall: false,
  },
  {
    category: 'DATA INSIGHT',
    tagVariant: 'cyan' as const,
    title: 'Rainfall Patterns Are Changing in Nairobi',
    description: 'Our data shows a 40% increase in extreme rainfall events over the past 5 years. What this means for informal settlements.',
    date: 'May 15, 2025',
    image: '/assets/article-rainfall-data.jpg',
    tall: false,
  },
  {
    category: 'PARTNERSHIP',
    tagVariant: 'green' as const,
    title: 'Safaricom and Airtel Join the Network',
    description: "Kenya's two largest carriers now provide free USSD access and bulk SMS delivery for flood alerts nationwide — reaching every subscriber regardless of data plan.",
    date: 'April 30, 2025',
    image: '/assets/article-partnership-carriers.jpg',
    tall: true,
  },
];

export function PlatformArticlesSection() {
  return (
    <section id="articles" className="bg-ms-dark relative">
      {/* Decorative line */}
      <div className="w-full h-px bg-white/5" />

      <div className="content-container section-padding-xl">
        <ScrollReveal>
          {/* Section Header */}
          <div data-reveal-item className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-label-md uppercase text-ms-lime tracking-[0.08em]">
                Platform Insights
              </span>
              <h2 className="font-display font-semibold text-display-lg md:text-display-lg text-white mt-4">
                Stories from the Field
              </h2>
            </div>
            <button className="flex items-center gap-2 text-ms-lime font-display font-medium text-body-md group self-start md:self-auto">
              View All Articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </ScrollReveal>

        {/* Articles Grid - staggered 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <ScrollReveal key={article.title} delay={i * 0.15}>
              <article
                data-reveal-item
                className={`group cursor-pointer ${article.tall ? 'md:row-span-1' : ''}`}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <CategoryTag variant={article.tagVariant}>{article.category}</CategoryTag>

                <h3 className="font-display font-semibold text-heading-sm text-white mt-3 group-hover:text-ms-lime transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-ms-grey text-body-sm mt-2 line-clamp-3">
                  {article.description}
                </p>

                <p className="font-mono text-body-xs text-ms-grey mt-4">
                  {article.date}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
