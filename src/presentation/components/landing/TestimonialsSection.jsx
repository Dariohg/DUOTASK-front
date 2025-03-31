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
            name: "Isabel Ramírez",
            role: "Maestra de 2° de Primaria",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            avatarBg: "brand.500",
            rating: 5,
            text: "DUOTASK transformó mi trabajo diario. Ahora llevo el control de asistencia y calificaciones sin complicaciones. Puedo generar reportes para la dirección y para padres de familia en minutos."
        },
        {
            name: "Francisco Morales",
            role: "Director de Escuela Primaria",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            avatarBg: "accent.500",
            rating: 5,
            text: "Implementamos DUOTASK en los 18 grupos de nuestra primaria y ha sido un cambio radical. Los maestros están más organizados y tenemos toda la información académica centralizada y accesible."
        },
        {
            name: "Lucía Hernández",
            role: "Maestra de 4° de Primaria",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            avatarBg: "#4CAF50",
            rating: 4,
            text: "El sistema de evaluación por competencias me facilita identificar las áreas donde mis alumnos necesitan apoyo adicional. Las juntas con padres son más efectivas al mostrarles datos concretos del desempeño de sus hijos."
        },
        {
            name: "Javier Méndez",
            role: "Maestro de 6° de Primaria",
            avatar: "https://randomuser.me/api/portraits/men/46.jpg",
            avatarBg: "#FF9800",
            rating: 5,
            text: "La planeación semanal solía tomarme horas. Con DUOTASK puedo organizarla en 20 minutos y acceder a recursos didácticos por materia. La función de calendario me ayuda con las evaluaciones bimestrales y eventos escolares."
        },
        {
            name: "Adriana Vega",
            role: "Coordinadora Académica de Primaria",
            avatar: "https://randomuser.me/api/portraits/women/95.jpg",
            avatarBg: "#E91E63",
            rating: 5,
            text: "Gracias a DUOTASK, nuestros 12 maestros de primaria pueden gestionar su trabajo de manera autónoma y eficiente. La plataforma ha reducido significativamente el tiempo que dedicaban al papeleo, permitiéndoles concentrarse más en la enseñanza."
        },
        {
            name: "Miguel Ángel Torres",
            role: "Maestro de Educación Física en Primaria",
            avatar: "https://randomuser.me/api/portraits/men/29.jpg",
            avatarBg: "#00BCD4",
            rating: 4,
            text: "Aunque imparto educación física a todos los grados, DUOTASK me permite mantener un registro detallado del desarrollo de habilidades motrices de cada alumno y compartir esta información con sus maestros de grupo."
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
                        Testimonios de maestros de primaria
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Descubre cómo docentes de primaria optimizan su trabajo administrativo y mejoran su práctica educativa con DUOTASK
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