import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Button,
    Icon,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { AnimatedBox, float, glowPulse } from './utils/AnimationUtils';

const CtaSection = () => {
    return (
        <Box py={20} position="relative" overflow="hidden" id="cta">
            {/* Animated gradient background */}
            <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
                bgGradient="linear(to-br, background.secondary, rgba(114, 56, 207, 0.05))"
                zIndex={0}
            />

            <Box
                position="absolute"
                top="40%"
                left="0"
                width="300px"
                height="300px"
                borderRadius="full"
                bg="brand.900"
                opacity="0.05"
                filter="blur(100px)"
                animation={`${float} 15s ease-in-out infinite`}
                zIndex={0}
            />

            <Container maxW="container.lg" position="relative" zIndex={1}>
                <AnimatedBox animation="scale">
                    <Box
                        bg="background.secondary"
                        p={{ base: 10, md: 14 }}
                        borderRadius="2xl"
                        boxShadow="lg"
                        borderWidth="1px"
                        borderColor="rgba(255, 255, 255, 0.05)"
                        position="relative"
                        overflow="hidden"
                    >
                        {/* Decorative glowing border */}
                        <Box
                            position="absolute"
                            top="-5px"
                            left="-5px"
                            right="-5px"
                            bottom="-5px"
                            borderRadius="2xl"
                            bg="transparent"
                            borderWidth="2px"
                            borderColor="transparent"
                            boxShadow="0 0 15px rgba(33, 150, 243, 0.3)"
                            opacity={0.6}
                            animation={`${glowPulse} 4s infinite`}
                            zIndex={0}
                            pointerEvents="none"
                        />

                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            align="center"
                            justify="space-between"
                            position="relative"
                            zIndex={1}
                        >
                            <Box mb={{ base: 8, md: 0 }} maxW={{ md: "60%" }}>
                                <Heading
                                    size="lg"
                                    mb={5}
                                    bgGradient="linear(to-r, brand.400, accent.400)"
                                    bgClip="text"
                                >
                                    Comienza a transformar tu forma de enseñar hoy mismo
                                </Heading>
                                <Text color="text.secondary" fontSize="lg" lineHeight="1.7">
                                    Únete a miles de educadores que ya han mejorado su productividad y la experiencia de sus estudiantes con DUOTASK.
                                </Text>
                            </Box>

                            <Button
                                as={RouterLink}
                                to="/register"
                                size="lg"
                                height="64px"
                                fontSize="lg"
                                rightIcon={<Icon as={FiArrowRight} />}
                                bg="brand.500"
                                color="white"
                                px={8}
                                _hover={{
                                    bg: "brand.600",
                                    transform: "translateY(-3px) scale(1.05)",
                                    boxShadow: "xl",
                                }}
                                transition="all 0.3s ease"
                                animation={`${glowPulse} 3s infinite`}
                            >
                                Empezar ahora
                            </Button>
                        </Flex>
                    </Box>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default CtaSection;