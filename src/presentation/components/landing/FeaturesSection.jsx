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
    FiFileText,
    FiBell,
    FiGrid,
    FiBook,
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
            icon: FiUsers,
            iconBg: "brand.500",
            title: "Control de asistencia",
            description: "Registra fácilmente la asistencia diaria de tus alumnos de primaria. Genera reportes mensuales automáticamente para la dirección escolar."
        },
        {
            icon: FiClipboard,
            iconBg: "accent.500",
            title: "Planeación de clases",
            description: "Organiza tus planes de clase semanales según el programa oficial de educación primaria. Accede a una biblioteca de recursos didácticos por grado."
        },
        {
            icon: FiBook,
            iconBg: "#4CAF50",
            title: "Calificaciones simplificadas",
            description: "Sistema intuitivo para registrar calificaciones por evaluación, bimestre y proyecto. Cálculo automático de promedios y generación de boletas."
        },
        {
            icon: FiBarChart2,
            iconBg: "#FF9800",
            title: "Reportes para padres",
            description: "Genera informes personalizados del desempeño de cada alumno para compartir en juntas de padres de familia. Incluye gráficos de progreso."
        },
        {
            icon: FiGrid,
            iconBg: "#E91E63",
            title: "Organización por materias",
            description: "Administra las distintas asignaturas de primaria: Español, Matemáticas, Ciencias Naturales, Historia, Geografía, Formación Cívica y más."
        },
        {
            icon: FiBell,
            iconBg: "#00BCD4",
            title: "Recordatorios personalizados",
            description: "Configura alertas para fechas importantes como entregas de evaluaciones, juntas escolares, eventos o actividades extracurriculares."
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
                            Herramientas exclusivas para docentes de primaria
                        </Heading>
                        <Divider width="100px" borderColor="brand.500" opacity={0.3} mx="auto" my={5} />
                        <Text color="text.secondary" fontSize="lg">
                            DUOTASK está diseñado específicamente para profesores de primaria, optimizando el trabajo administrativo para que puedas dedicar más tiempo a lo que realmente importa: la enseñanza de tus alumnos.
                        </Text>
                        <Text color="text.secondary" fontSize="md" mt={4} fontStyle="italic">
                            Plataforma exclusiva para uso docente - Los estudiantes no necesitan acceder al sistema
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