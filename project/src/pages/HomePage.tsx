import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import RiskSimulatorDemo from '../components/home/RiskSimulatorDemo';
import { useEffect } from 'react';

const HomePage = () => {
  // Update page title
  useEffect(() => {
    document.title = 'DiaTwin - Your Diabetes Twin Companion';
  }, []);

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <RiskSimulatorDemo />
      <TestimonialsSection />
      <div id="auth-section" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create your account today and take the first step towards a healthier future with personalized diabetes prevention.
            </p>
          </div>
          
          <div className="flex justify-center">
            <a 
              href="/auth?mode=signup" 
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1"
            >
              Create Free Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;