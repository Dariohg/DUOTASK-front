import { useState, useEffect, useCallback } from 'react';
import { Box, keyframes } from '@chakra-ui/react';

// Definir animaciones comunes
export const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

export const glowPulse = keyframes`
    0% { box-shadow: 0 0 10px rgba(33, 150, 243, 0.3); }
    50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.5), 0 0 30px rgba(156, 39, 176, 0.3); }
    100% { box-shadow: 0 0 10px rgba(33, 150, 243, 0.3); }
`;

export const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
`;

// Hook personalizado para observar elementos en el viewport
export const useIntersectionObserver = (options = {}) => {
    const [ref, setRef] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const callbackFunction = useCallback(entries => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, options);
        const currentRef = ref;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options, callbackFunction]);

    return [setRef, isVisible];
};

// Componente que anima su contenido cuando entra en el viewport
export const AnimatedBox = ({
                                children,
                                animation = "fade",
                                delay = 0,
                                threshold = 0.1,
                                once = true,
                                ...props
                            }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold,
        triggerOnce: once
    });

    const animations = {
        fade: {
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.6s ease ${delay}s`
        },
        slideUp: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
        },
        slideRight: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-50px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
        },
        slideLeft: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(50px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
        },
        scale: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.8)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
        },
    };

    return (
        <Box
            ref={ref}
            style={animations[animation]}
            {...props}
        >
            {children}
        </Box>
    );
};

export default AnimatedBox;