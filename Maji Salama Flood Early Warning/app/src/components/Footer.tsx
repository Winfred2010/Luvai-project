import { ScrollReveal } from './ScrollReveal';
import { Waves, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const platformLinks = ['Real-Time Reports', 'Flood Maps', 'Alert System', 'USSD *384*88#', 'Community Forum'];
const resourceLinks = ['Documentation', 'API Reference', 'Data Sources', 'Partner Organizations', 'Research Papers'];
const contactLinks = ['About the Team', 'Partner With Us', 'Report an Issue', 'hello@majisalama.org'];

export function Footer() {
  return (
    <footer className="bg-ms-warm-black border-t-2 border-ms-dark-grey">
      <div className="content-container pt-16 md:pt-[120px] pb-12 md:pb-12">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div data-reveal-item>
              <div className="flex items-center gap-2 mb-4">
                <Waves className="w-6 h-6 text-ms-cyan" />
                <span className="font-display font-bold text-2xl text-ms-lime">
                  Maji<span className="text-white">Salama</span>
                </span>
              </div>
              <p className="text-ms-grey text-body-md mb-6">
                Flood early warning for every community.
              </p>
              <div className="flex gap-4">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-ms-grey hover:text-ms-lime transition-colors duration-300"
                    aria-label="Social link"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Column */}
            <div data-reveal-item>
              <h4 className="font-display font-semibold text-heading-sm text-white mb-6">
                Platform
              </h4>
              <ul className="space-y-3">
                {platformLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-ms-grey hover:text-ms-lime text-body-sm transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div data-reveal-item>
              <h4 className="font-display font-semibold text-heading-sm text-white mb-6">
                Resources
              </h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-ms-grey hover:text-ms-lime text-body-sm transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div data-reveal-item>
              <h4 className="font-display font-semibold text-heading-sm text-white mb-6">
                Contact
              </h4>
              <ul className="space-y-3">
                {contactLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-ms-grey hover:text-ms-lime text-body-sm transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Bar */}
        <div className="mt-20 pt-6 border-t border-ms-dark-grey flex flex-col md:flex-row justify-between gap-4">
          <p className="font-mono text-body-xs text-ms-text-muted">
            &copy; 2025 MajiSalama. Open source for public safety.
          </p>
          <p className="font-mono text-body-xs text-ms-text-muted">
            Built with urgency for Kenya&apos;s communities
          </p>
        </div>
      </div>
    </footer>
  );
}
