import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import WeatherMapSection from '../components/home/WeatherMapSection';
import HistorySection from '../components/home/HistorySection';
import LeadershipSection from '../components/home/LeadershipSection';
import ContactSection from '../components/home/ContactSection';
import SEO from '../components/SEO';
import RecordsSection from '../components/home/RecordsSection';
import TourismSection from '../components/home/TourismSection';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        description="BetterTagaytay is a community transparency portal for Tagaytay City, Cavite. Find government services, officials, budgets, and public information."
        keywords="Tagaytay City, Cavite, government, services, transparency, officials, budget"
      />
      <div>
        <Hero />
        <ServicesSection compact />
        <RecordsSection />
        <TourismSection />
        <StatsSection />
        <WeatherMapSection />
        <HistorySection />
        <LeadershipSection />
        <ContactSection />
      </div>
    </>
  );
};

export default Home;
