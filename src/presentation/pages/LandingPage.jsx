import { useState, useEffect } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FiArrowUp } from 'react-icons/fi';

// Importar todas las secciones existentes
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ShowcaseSection from '../components/landing/ShowcaseSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CtaSection from '../components/landing/CtaSection';

// Importar las nuevas secciones
import AboutUsSection from '../components/landing/AboutUsSection';
import VideoSection from '../components/landing/VideoSection';
import PricingSection from '../components/landing/PricingSection';
import ContactSection from '../components/landing/ContactSection';

const LandingPage = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Controlador para el botón "volver arriba"
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Box minH="100vh" bg="background.primary" position="relative">
            {/* Hero Section */}
            <HeroSection />

            {/* Stats Section */}
            <StatsSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* About Us Section - NUEVA */}
            <AboutUsSection />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Videos Section - NUEVA */}
            <VideoSection />

            {/* Showcase Section */}
            <ShowcaseSection />

            {/* Pricing Section - NUEVA */}
            <PricingSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Contact Section - NUEVA */}
            <ContactSection />

            {/* CTA Section */}
            <CtaSection />

            {/* Scroll to Top Button */}
            <IconButton
                aria-label="Volver arriba"
                icon={<FiArrowUp />}
                size="lg"
                colorScheme="brand"
                borderRadius="full"
                position="fixed"
                bottom="20px"
                right="20px"
                opacity={showScrollTop ? 1 : 0}
                visibility={showScrollTop ? "visible" : "hidden"}
                transition="all 0.3s"
                onClick={scrollToTop}
                zIndex={999}
                boxShadow="lg"
            />
        </Box>
    );
};

export default LandingPage;