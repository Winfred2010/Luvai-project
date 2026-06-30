import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmergencyPopup } from '@/components/EmergencyPopup';
import { HeroSection } from '@/sections/HeroSection';
import { RealTimeReportsSection } from '@/sections/RealTimeReportsSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { CommunityVoicesSection } from '@/sections/CommunityVoicesSection';
import { PlatformArticlesSection } from '@/sections/PlatformArticlesSection';
import { PartnersSection } from '@/sections/PartnersSection';

function App() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-ms-dark">
      <LoadingScreen onComplete={handleLoadComplete} />
      <Header />
      <main>
        <HeroSection loaded={loaded} />
        <RealTimeReportsSection />
        <HowItWorksSection />
        <CommunityVoicesSection />
        <PlatformArticlesSection />
        <PartnersSection />
      </main>
      <Footer />
      <EmergencyPopup />
    </div>
  );
}

export default App;
