import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    Flex,
    Icon,
    Divider,
} from '@chakra-ui/react';
import {
    FiClipboard,
    FiUsers,
    FiCalendar,
    FiBarChart2,
    FiCheckSquare,
    FiMessageSquare,
} from 'react-icons/fi';
import { AnimatedBox, float } from './utils/AnimationUtils';

const FeatureCard = ({ feature, index }) => {
    return (
        <AnimatedBox
            animation="slideUp"
            delay={0.1 * index}
            bg="background.secondary"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.03)"
            transition="all 0.4s ease"
            _hover={{
                transform: "translateY(-8px)",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                bg: "background.tertiary",
            }}
            height="100%"
        >
            <Flex
                w="60px"
                h="60px"
                justify="center"
                align="center"
                bg={feature.iconBg || "brand.500"}
                color="white"
                borderRadius="lg"
                mb={5}
                animation={`${float} 3s ease-in-out infinite`}
            >
                <Icon as={feature.icon} boxSize={6} />
            </Flex>
            <Heading size="md" mb={4} mt={2}>
                {feature.title}
            </Heading>
            <Text color="text.secondary" fontSize="md">
                {feature.description}
            </Text>
        </AnimatedBox>
    );
};

const FeaturesSection = () => {
    const features = [
        {
            icon: FiClipboard,
            iconBg: "brand.500",
            title: "Gestión de tareas",
            description: "Crea, asigna y califica tareas con facilidad. Establece fechas de entrega y recibe notificaciones automáticas."
        },
        {
            icon: FiUsers,
            iconBg: "accent.500",
            title: "Administración de estudiantes",
            description: "Lleva un registro completo de tus estudiantes, contactos, calificaciones y observaciones personalizadas."
        },
        {
            icon: FiCalendar,
            iconBg: "#4CAF50",
            title: "Planificación de clases",
            description: "Organiza tu horario de clases, exámenes y actividades con un calendario intuitivo y fácil de usar."
        },
        {
            icon: FiBarChart2,
            iconBg: "#FF9800",
            title: "Reportes y estadísticas",
            description: "Genera informes detallados sobre el rendimiento individual y grupal con gráficos y métricas avanzadas."
        },
        {
            icon: FiCheckSquare,
            iconBg: "#E91E63",
            title: "Seguimiento de progreso",
            description: "Visualiza el avance de tus estudiantes con indicadores de progreso y alertas de rendimiento en tiempo real."
        },
        {
            icon: FiMessageSquare,
            iconBg: "#00BCD4",
            title: "Comunicación directa",
            description: "Mantén contacto con tus estudiantes a través de la plataforma. Envía anuncios y recibe consultas."
        }
    ];

    return (
        <Box bg="background.card" py={20} position="relative" id="features">
            {/* Background decorative elements */}
            <Box
                position="absolute"
                top="10%"
                left="0"
                width="200px"
                height="200px"
                borderRadius="full"
                bg="brand.900"
                opacity="0.05"
                filter="blur(70px)"
                zIndex={0}
            />

            <Box
                position="absolute"
                bottom="20%"
                right="5%"
                width="300px"
                height="300px"
                borderRadius="full"
                bg="accent.800"
                opacity="0.07"
                filter="blur(100px)"
                zIndex={0}
            />

            <Container maxW="container.xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    <AnimatedBox animation="slideUp" textAlign="center" maxW="800px" mx="auto">
                        <Heading
                            size="xl"
                            mb={5}
                            bgGradient="linear(to-r, brand.400, accent.400)"
                            bgClip="text"
                        >
                            Todo lo que necesitas para administrar tu clase
                        </Heading>
                        <Divider width="100px" borderColor="brand.500" opacity={0.3} mx="auto" my={5} />
                        <Text color="text.secondary" fontSize="lg">
                            Diseñado especialmente para profesores y educadores que buscan optimizar su tiempo y mejorar el seguimiento de sus estudiantes.
                        </Text>
                    </AnimatedBox>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default FeaturesSection;