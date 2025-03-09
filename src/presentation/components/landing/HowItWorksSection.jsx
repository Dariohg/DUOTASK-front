import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    VStack,
} from '@chakra-ui/react';
import { AnimatedBox } from './utils/AnimationUtils';

const StepCard = ({ step, index }) => {
    return (
        <AnimatedBox
            animation={index % 2 === 0 ? "slideRight" : "slideLeft"}
            delay={0.2 * index}
            position="relative"
        >
            <Flex
                direction={{ base: "column", md: "row" }}
                bg="background.secondary"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.03)"
                _hover={{
                    boxShadow: "lg",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                }}
                transition="all 0.3s ease"
                align="center"
            >
                <Flex
                    justify="center"
                    align="center"
                    bg={step.iconBg || "brand.500"}
                    color="white"
                    borderRadius="full"
                    boxSize="60px"
                    flexShrink={0}
                    mr={{ base: 0, md: 6 }}
                    mb={{ base: 4, md: 0 }}
                    position="relative"
                    zIndex={1}
                >
                    <Text fontWeight="bold" fontSize="xl">{index + 1}</Text>
                </Flex>

                <Box>
                    <Heading size="md" mb={2}>{step.title}</Heading>
                    <Text color="text.secondary">{step.description}</Text>
                </Box>
            </Flex>

            {index < 3 && (
                <Box
                    display={{ base: "none", md: "block" }}
                    position="absolute"
                    bottom="-40px"
                    left="30px"
                    height="40px"
                    width="1px"
                    bg="rgba(255, 255, 255, 0.1)"
                    _after={{
                        content: '""',
                        position: "absolute",
                        bottom: "-6px",
                        left: "-3px",
                        width: "7px",
                        height: "7px",
                        borderRadius: "full",
                        bg: "brand.500",
                    }}
                />
            )}
        </AnimatedBox>
    );
};

const HowItWorksSection = () => {
    const steps = [
        {
            title: "Regístrate y configura tu perfil",
            description: "Crea tu cuenta en minutos y personaliza tu perfil docente con tus materias, niveles y preferencias.",
            iconBg: "brand.500"
        },
        {
            title: "Crea tus clases y grupos",
            description: "Organiza tus estudiantes en clases o grupos, importa listas o invítalos directamente con un código.",
            iconBg: "accent.500"
        },
        {
            title: "Gestiona tareas y actividades",
            description: "Diseña actividades educativas, asigna tareas, establece fechas de entrega y criterios de evaluación.",
            iconBg: "#4CAF50"
        },
        {
            title: "Evalúa y monitorea el progreso",
            description: "Califica entregas, proporciona retroalimentación y visualiza el avance individual y grupal con reportes detallados.",
            iconBg: "#FF9800"
        }
    ];

    return (
        <Box py={20} bg="background.primary" position="relative" id="how-it-works">
            <Container maxW="container.xl">
                <AnimatedBox animation="slideUp" textAlign="center" mb={16}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Cómo funciona DUOTASK
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Comienza a optimizar tu proceso educativo en solo 4 pasos sencillos
                    </Text>
                </AnimatedBox>

                <VStack spacing={12} align="stretch">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} index={index} />
                    ))}
                </VStack>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;