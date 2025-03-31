import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Image,
    Flex,
    VStack,
    HStack,
    Icon,
    Divider,
} from '@chakra-ui/react';
import { FiTarget, FiHeart, FiUsers } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const AboutUsSection = () => {
    const values = [
        {
            icon: FiTarget,
            title: "Misión",
            description: "Nuestra misión es transformar la gestión educativa proporcionando herramientas intuitivas que permitan a los docentes dedicar más tiempo a la enseñanza y menos a tareas administrativas."
        },
        {
            icon: FiHeart,
            title: "Valores",
            description: "Creemos en la innovación, la simplicidad y la accesibilidad. Trabajamos con pasión para crear tecnología que mejora la vida de educadores y estudiantes."
        },
        {
            icon: FiUsers,
            title: "Equipo",
            description: "Somos un equipo diverso de educadores, diseñadores y desarrolladores unidos por nuestra pasión por mejorar la experiencia educativa a través de la tecnología."
        }
    ];

    return (
        <Box py={20} bg="background.primary" position="relative" id="nosotros">
            <Container maxW="container.xl" position="relative" zIndex={1}>
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Sobre DUOTASK
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Conoce nuestra historia, valores y el equipo detrás de esta plataforma educativa
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={16}>
                    <AnimatedBox animation="slideRight">
                        <VStack align="start" spacing={6}>
                            <Heading size="lg">Nuestra Historia</Heading>
                            <Text color="text.secondary" fontSize="md" lineHeight="1.8">
                                DUOTASK nació en 2023 cuando un grupo de educadores y desarrolladores se unieron con una visión común:
                                simplificar la vida de los profesores. Tras años de experiencia en el aula, identificamos las dificultades que
                                enfrentan los educadores con las herramientas digitales existentes.
                            </Text>
                            <Text color="text.secondary" fontSize="md" lineHeight="1.8">
                                Creamos una plataforma que realmente entiende el flujo de trabajo educativo, diseñada por y para profesores.
                                Hoy, DUOTASK ayuda a miles de educadores a gestionar sus clases con eficacia, permitiéndoles enfocarse
                                en lo más importante: inspirar y educar a la próxima generación.
                            </Text>
                        </VStack>
                    </AnimatedBox>

                    <AnimatedBox animation="slideLeft" delay={0.2}>
                        <Box
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="xl"
                            position="relative"
                            h="100%"
                            minH="300px"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Equipo DUOTASK"
                                objectFit="cover"
                                w="100%"
                                h="100%"
                            />
                            <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                bg="rgba(0,0,0,0.7)"
                                p={4}
                            >
                                <Text color="white" fontWeight="medium">
                                    Equipo fundador de DUOTASK durante nuestro primer hackathon educativo
                                </Text>
                            </Box>
                        </Box>
                    </AnimatedBox>
                </SimpleGrid>

                <Divider mb={16} opacity={0.1} />

                <AnimatedBox animation="slideUp" delay={0.3}>
                    <Heading size="lg" textAlign="center" mb={10}>
                        Nuestros Valores
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        {values.map((value, index) => (
                            <Flex
                                key={index}
                                direction="column"
                                align="center"
                                bg="background.secondary"
                                p={8}
                                borderRadius="lg"
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor="rgba(255, 255, 255, 0.03)"
                                transition="all 0.3s ease"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    boxShadow: "lg",
                                }}
                            >
                                <Flex
                                    w="70px"
                                    h="70px"
                                    justify="center"
                                    align="center"
                                    bg={index === 0 ? "brand.500" : index === 1 ? "accent.500" : "green.500"}
                                    color="white"
                                    borderRadius="full"
                                    mb={6}
                                >
                                    <Icon as={value.icon} boxSize={7} />
                                </Flex>
                                <Heading size="md" mb={4} textAlign="center">
                                    {value.title}
                                </Heading>
                                <Text color="text.secondary" textAlign="center">
                                    {value.description}
                                </Text>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default AboutUsSection;