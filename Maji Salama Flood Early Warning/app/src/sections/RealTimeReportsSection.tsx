import { ScrollReveal } from '@/components/ScrollReveal';
import { CountUp } from '@/components/CountUp';
import { CategoryTag } from '@/components/CategoryTag';
import { ArrowRight, MessageSquare, CloudRain, AlertTriangle, Shield } from 'lucide-react';

const stats = [
  {
    number: 2847,
    label: 'FLOOD REPORTS THIS MONTH',
    description: 'Community-submitted observations from across Kenya',
    suffix: '',
    color: 'text-ms-lime',
  },
  {
    number: 12,
    label: 'ACTIVE ALERT ZONES',
    description: 'Areas currently under flood watch or warning',
    suffix: '',
    color: 'text-ms-amber',
  },
  {
    number: 45,
    label: 'AVG. EARLY WARNING',
    description: 'Minutes of advance notice before flooding',
    suffix: ' min',
    color: 'text-ms-cyan',
  },
];

const reports = [
  {
    tag: 'FLOOD REPORT' as const,
    tagVariant: 'lime' as const,
    title: 'Mathare River Overflowing Near Bridge',
    description: 'Water level has risen above the embankment. Several homes in Section 3A taking in water. Requesting emergency response.',
    timestamp: '12 minutes ago',
    location: 'Mathare, Nairobi',
    status: 'URGENT',
    statusColor: 'bg-[rgba(255,43,43,0.15)] text-ms-red',
    source: 'USSD Report',
    icon: AlertTriangle,
  },
  {
    tag: 'RAINFALL ALERT' as const,
    tagVariant: 'cyan' as const,
    title: 'Heavy Rain Persisting in Kibra for 4 Hours',
    description: 'Continuous rainfall measured at 68mm since morning. Drainage systems overwhelmed. Standing water 30cm deep on major paths.',
    timestamp: '27 minutes ago',
    location: 'Kibra, Nairobi',
    status: 'ACTIVE',
    statusColor: 'bg-[rgba(255,159,43,0.15)] text-ms-amber',
    source: 'Weather Station',
    icon: CloudRain,
  },
  {
    tag: 'ROAD HAZARD' as const,
    tagVariant: 'amber' as const,
    title: 'Mbagathi Way Partially Flooded',
    description: 'Section between Nairobi West and South C impassable to small vehicles. Water depth approximately 40cm across two lanes.',
    timestamp: '1 hour ago',
    location: 'Mbagathi Way',
    status: 'WARNING',
    statusColor: 'bg-[rgba(255,159,43,0.15)] text-ms-amber',
    source: 'Mobile App',
    icon: MessageSquare,
  },
  {
    tag: 'SAFE ZONE' as const,
    tagVariant: 'green' as const,
    title: 'Karen Community Center Open as Shelter',
    description: 'Community center on Langata Road now accepting families. Capacity for 120 people. Hot meals and dry bedding available.',
    timestamp: '2 hours ago',
    location: 'Karen, Nairobi',
    status: 'OPEN',
    statusColor: 'bg-[rgba(196,255,0,0.15)] text-ms-green',
    source: 'Community Leader',
    icon: Shield,
  },
];

export function RealTimeReportsSection() {
  return (
    <section id="reports" className="bg-ms-dark relative">
      <div className="content-container section-padding-lg">
        <ScrollReveal>
          {/* Section Header */}
          <div data-reveal-item>
            <span className="font-mono text-label-md uppercase text-ms-lime tracking-[0.08em]">
              Real-Time Data
            </span>
            <h2 className="font-display font-semibold text-display-lg md:text-display-lg text-white mt-4">
              Live from the Ground
            </h2>
            <p className="text-ms-grey text-body-lg max-w-[600px] mt-4">
              Reports coming in every minute from communities across Nairobi.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.15}>
              <div
                data-reveal-item
                className="bg-ms-near-black rounded-2xl p-8 md:p-10"
              >
                <span className={`font-mono font-bold text-stat-number md:text-stat-number ${stat.color}`}>
                  <CountUp end={stat.number} suffix={stat.suffix} />
                </span>
                <p className="font-mono text-label-md uppercase text-ms-grey tracking-[0.08em] mt-3">
                  {stat.label}
                </p>
                <p className="text-ms-text-muted text-body-sm mt-2">
                  {stat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Reports Section */}
        <ScrollReveal delay={0.2}>
          <div data-reveal-item className="mt-20">
            <span className="font-mono text-label-md uppercase text-ms-grey tracking-[0.08em]">
              Recent Reports
            </span>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, i) => (
            <ScrollReveal key={report.title} delay={i * 0.1}>
              <div
                data-reveal-item
                className="bg-ms-near-black border border-white/10 rounded-2xl p-8 hover:border-[rgba(230,255,43,0.3)] hover:-translate-y-1 hover:shadow-glass transition-all duration-400 easing-default cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <CategoryTag variant={report.tagVariant}>{report.tag}</CategoryTag>
                  <report.icon className="w-5 h-5 text-ms-grey group-hover:text-ms-lime transition-colors duration-300" />
                </div>

                <h3 className="font-display font-semibold text-heading-lg text-white mb-3 group-hover:text-ms-lime transition-colors duration-300">
                  {report.title}
                </h3>

                <p className="text-ms-grey text-body-md mb-4 line-clamp-3">
                  {report.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`font-mono text-label-sm uppercase px-2 py-1 rounded ${report.statusColor}`}>
                    {report.status}
                  </span>
                  <span className="font-mono text-body-xs text-ms-text-muted">
                    {report.source}
                  </span>
                </div>

                <p className="font-mono text-body-xs text-ms-grey">
                  {report.timestamp} &middot; {report.location}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Link */}
        <ScrollReveal delay={0.3}>
          <div data-reveal-item className="flex justify-center mt-12">
            <button className="flex items-center gap-2 text-ms-lime font-display font-medium text-body-md group">
              View All Reports
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
