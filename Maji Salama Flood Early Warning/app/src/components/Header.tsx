import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Phone, Waves } from 'lucide-react';

const navItems = ['Reports', 'How It Works', 'Alerts', 'Community'];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[200] h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(8,8,8,0.95)] border-b border-white/10'
            : 'bg-[rgba(8,8,8,0.6)] border-b border-transparent'
        } backdrop-blur-xl px-5 md:px-12`}
      >
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <Waves className="w-6 h-6 text-ms-cyan" />
          <span className="font-display font-bold text-xl text-ms-lime">
            Maji<span className="text-white">Salama</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="font-display font-medium text-sm text-white hover:text-ms-lime transition-colors duration-300"
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('alerts')}
            className="flex items-center gap-2 bg-ms-lime text-black font-display font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-ms-light-lime transition-colors duration-300"
          >
            <Phone className="w-4 h-4" />
            Get Alerts
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white p-2"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[300] bg-ms-near-black">
          <div className="flex justify-end p-5">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-8 pt-20">
            {navItems.map((item, i) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="font-display font-medium text-nav-link text-white hover:text-ms-lime transition-colors duration-300"
                style={{
                  animation: `fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) ${i * 0.08}s both`,
                }}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('alerts')}
              className="mt-4 flex items-center gap-2 bg-ms-lime text-black font-display font-semibold text-lg px-8 py-3 rounded-full hover:bg-ms-light-lime transition-colors duration-300"
              style={{
                animation: `fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) ${navItems.length * 0.08}s both`,
              }}
            >
              <Phone className="w-5 h-5" />
              Get Alerts
            </button>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
