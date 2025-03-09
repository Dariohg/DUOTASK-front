import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Button,
    Image,
    Icon,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { AnimatedBox } from './utils/AnimationUtils';

const ShowcaseSection = () => {
    const screenshots = [
        {
            title: "Panel de control docente",
            description: "Vista general de clases, tareas pendientes y calendario de actividades.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            animation: "slideRight",
            delay: 0.1
        },
        {
            title: "Seguimiento de estudiantes",
            description: "Visualización del progreso académico y métricas de rendimiento.",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            animation: "slideLeft",
            delay: 0.3
        },
        {
            title: "Creación de tareas",
            description: "Interfaz para diseñar y asignar actividades con múltiples opciones.",
            image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            animation: "slideRight",
            delay: 0.5
        },
        {
            title: "Análisis y reportes",
            description: "Herramientas analíticas para evaluar el desempeño del grupo y estudiantes.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            animation: "slideLeft",
            delay: 0.7
        }
    ];

    return (
        <Box py={20} bg="background.secondary" position="relative" id="showcase">
            <Container maxW="container.xl">
                <AnimatedBox animation="slideUp" textAlign="center" mb={16}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Explora nuestra plataforma
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Descubre la interfaz intuitiva y las potentes funcionalidades que DUOTASK ofrece para optimizar tu trabajo
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {screenshots.map((screenshot, index) => (
                        <AnimatedBox
                            key={index}
                            animation={screenshot.animation}
                            delay={screenshot.delay}
                        >
                            <Box
                                bg="background.card"
                                borderRadius="xl"
                                overflow="hidden"
                                boxShadow="xl"
                                borderWidth="1px"
                                borderColor="rgba(255, 255, 255, 0.05)"
                                transition="all 0.3s ease"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    boxShadow: "2xl",
                                }}
                            >
                                <Box p={4} bg="background.tertiary">
                                    <Heading size="md">{screenshot.title}</Heading>
                                </Box>
                                <Image
                                    src={screenshot.image}
                                    alt={`${screenshot.title} Screenshot`}
                                    w="full"
                                />
                                <Box p={4}>
                                    <Text color="text.secondary">{screenshot.description}</Text>
                                </Box>
                            </Box>
                        </AnimatedBox>
                    ))}
                </SimpleGrid>

                <AnimatedBox animation="slideUp" delay={0.5} textAlign="center" mt={12}>
                    <Button
                        as={RouterLink}
                        to="/tour"
                        size="lg"
                        rightIcon={<Icon as={FiArrowRight} />}
                        bg="brand.500"
                        color="white"
                        _hover={{
                            bg: "brand.600",
                            transform: "translateY(-3px)",
                            boxShadow: "lg",
                        }}
                        px={8}
                    >
                        Ver tour completo
                    </Button>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default ShowcaseSection;