import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    HStack,
    Avatar,
    Icon,
} from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const TestimonialCard = ({ testimonial, index }) => {
    return (
        <AnimatedBox
            animation="scale"
            delay={0.15 * index}
            bg="background.secondary"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.03)"
            position="relative"
            _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                bgGradient: "linear(to-r, brand.400, accent.400)",
                borderTopLeftRadius: "lg",
                borderTopRightRadius: "lg",
            }}
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
            }}
            transition="all 0.3s ease"
        >
            <HStack spacing={4} mb={4}>
                <Avatar
                    src={testimonial.avatar}
                    size="md"
                    name={testimonial.name}
                    bg={testimonial.avatarBg || "brand.500"}
                />
                <Box>
                    <Heading size="sm">{testimonial.name}</Heading>
                    <Text fontSize="sm" color="text.secondary">{testimonial.role}</Text>
                </Box>
            </HStack>

            <Box mb={4}>
                <HStack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                        <Icon
                            key={i}
                            as={FiStar}
                            color={i < testimonial.rating ? "yellow.400" : "gray.500"}
                            fill={i < testimonial.rating ? "yellow.400" : "none"}
                        />
                    ))}
                </HStack>
            </Box>

            <Text color="text.secondary" fontSize="md" fontStyle="italic">
                "{testimonial.text}"
            </Text>
        </AnimatedBox>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Laura Mendoza",
            role: "Profesora de Secundaria",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            avatarBg: "brand.500",
            rating: 5,
            text: "DUOTASK revolucionó la forma en que organizo mis clases. Ahora puedo dedicar más tiempo a enseñar y menos a tareas administrativas. ¡Mis estudiantes también están más comprometidos!"
        },
        {
            name: "Carlos Ramírez",
            role: "Director Académico",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            avatarBg: "accent.500",
            rating: 5,
            text: "Implementamos DUOTASK en toda nuestra institución y los resultados han sido increíbles. La plataforma es intuitiva y el soporte técnico es excelente. Altamente recomendable."
        },
        {
            name: "María González",
            role: "Maestra de Primaria",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            avatarBg: "#4CAF50",
            rating: 4,
            text: "La función de seguimiento de progreso me permite identificar rápidamente a los estudiantes que necesitan ayuda adicional. Los padres también aprecian poder ver el avance de sus hijos."
        },
        {
            name: "Roberto Sánchez",
            role: "Profesor Universitario",
            avatar: "https://randomuser.me/api/portraits/men/46.jpg",
            avatarBg: "#FF9800",
            rating: 5,
            text: "Como profesor universitario, la gestión de múltiples cursos era un reto. DUOTASK ha simplificado enormemente mi trabajo, especialmente con los reportes automáticos de calificaciones."
        },
        {
            name: "Gabriela Ortiz",
            role: "Coordinadora de Tecnología Educativa",
            avatar: "https://randomuser.me/api/portraits/women/95.jpg",
            avatarBg: "#E91E63",
            rating: 5,
            text: "Lo que más me gusta es la facilidad de integración con otras herramientas educativas. La interfaz es moderna y los estudiantes se adaptan rápidamente a ella."
        },
        {
            name: "Alejandro Torres",
            role: "Profesor de Preparatoria",
            avatar: "https://randomuser.me/api/portraits/men/29.jpg",
            avatarBg: "#00BCD4",
            rating: 4,
            text: "DUOTASK me ha permitido implementar metodologías innovadoras en mi enseñanza. La comunicación directa con los estudiantes y la organización de materiales digitales es excepcional."
        }
    ];

    return (
        <Box py={20} bg="background.primary" position="relative" id="testimonials">
            <Container maxW="container.xl">
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Lo que dicen nuestros usuarios
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Historias de éxito de educadores que transformaron su enseñanza con DUOTASK
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default TestimonialsSection;