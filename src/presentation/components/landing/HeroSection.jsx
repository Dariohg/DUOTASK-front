import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    Stack,
    Image,
    Icon,
    HStack,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { AnimatedBox, float, shimmer, glowPulse } from './utils/AnimationUtils';

const HeroSection = () => {
    const headingSize = useBreakpointValue({ base: '3xl', md: '4xl' });

    return (
        <Box
            position="relative"
            bgGradient="linear(to-br, background.primary, background.secondary, rgba(33, 150, 243, 0.2))"
            overflow="hidden"
            pt={{ base: '20', md: '32' }}
            pb={{ base: '20', md: '24' }}
            id="hero"
        >
            {/* Animated background grid */}
            <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
                bgGradient="radial(circle at 30px 30px, rgba(255, 255, 255, 0.08) 2px, transparent 0)"
                backgroundSize="60px 60px"
                opacity="0.2"
                zIndex={0}
                animation={`${shimmer} 60s linear infinite`}
            />

            {/* Animated glowing orbs in background */}
            <Box
                position="absolute"
                top="20%"
                left="5%"
                width="200px"
                height="200px"
                borderRadius="full"
                bg="brand.900"
                opacity="0.1"
                filter="blur(80px)"
                animation={`${float} 10s ease-in-out infinite`}
                zIndex={0}
            />

            <Box
                position="absolute"
                bottom="10%"
                right="5%"
                width="250px"
                height="250px"
                borderRadius="full"
                bg="accent.900"
                opacity="0.1"
                filter="blur(80px)"
                animation={`${float} 14s ease-in-out infinite`}
                zIndex={0}
            />

            <Container maxW="container.xl" position="relative" zIndex={1}>
                <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between">
                    <AnimatedBox
                        animation="slideRight"
                        maxW={{ base: "100%", lg: "50%" }}
                        mb={{ base: 12, lg: 0 }}
                    >
                        <Heading
                            as="h1"
                            size={headingSize}
                            mb={5}
                            bgGradient="linear(to-r, brand.400, accent.400)"
                            bgClip="text"
                            fontWeight="bold"
                            lineHeight="1.2"
                        >
                            Revoluciona la Gestión de tu Clase con DUOTASK
                        </Heading>

                        <Text fontSize="xl" color="text.secondary" mb={8} lineHeight="1.7">
                            Una plataforma <Text as="span" color="brand.400" fontWeight="bold">intuitiva</Text> y <Text as="span" color="accent.400" fontWeight="bold">potente</Text> que
                            te ayuda a organizar tareas, hacer seguimiento a tus estudiantes y simplificar la gestión de tus clases. Todo en un solo lugar.
                        </Text>

                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            spacing={4}
                        >
                            <Button
                                as={RouterLink}
                                to="/login"
                                size="lg"
                                height="60px"
                                px={10}
                                bg="brand.500"
                                color="white"
                                fontSize="lg"
                                _hover={{
                                    bg: "brand.600",
                                    transform: "translateY(-3px)",
                                    boxShadow: "lg",
                                }}
                                _active={{ bg: "brand.700" }}
                                animation={`${glowPulse} 3s infinite`}
                            >
                                Iniciar sesión
                            </Button>

                            <Button
                                as={RouterLink}
                                to="/register"
                                size="lg"
                                height="60px"
                                px={10}
                                variant="outline"
                                borderColor="brand.500"
                                color="brand.500"
                                fontSize="lg"
                                borderWidth="2px"
                                _hover={{
                                    bg: "rgba(33, 150, 243, 0.1)",
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 10px 15px -3px rgba(33, 150, 243, 0.2)",
                                }}
                            >
                                Crear cuenta
                            </Button>
                        </Stack>

                        <HStack mt={10} spacing={6} color="text.secondary">
                            <HStack>
                                <Icon as={FiCheckCircle} color="green.400" />
                                <Text>Fácil de usar</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FiCheckCircle} color="green.400" />
                                <Text>100% Seguro</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FiCheckCircle} color="green.400" />
                                <Text>Soporte 24/7</Text>
                            </HStack>
                        </HStack>
                    </AnimatedBox>

                    <AnimatedBox animation="slideLeft" delay={0.3}>
                        <Box
                            maxW={{ base: "90%", lg: "500px" }}
                            bg="background.card"
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="2xl"
                            p={1}
                            borderWidth="1px"
                            borderColor="rgba(255, 255, 255, 0.05)"
                            animation={`${float} 6s ease-in-out infinite`}
                            transition="all 0.3s ease"
                            transform="perspective(1000px) rotateY(-5deg)"
                            _hover={{
                                transform: "perspective(1000px) rotateY(0deg) scale(1.02)",
                            }}
                            mx="auto"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Dashboard Preview"
                                objectFit="cover"
                                borderRadius="lg"
                                opacity={0.9}
                                transition="all 0.5s ease"
                                _hover={{
                                    opacity: 1,
                                }}
                            />
                        </Box>
                    </AnimatedBox>
                </Flex>
            </Container>
        </Box>
    );
};

export default HeroSection;