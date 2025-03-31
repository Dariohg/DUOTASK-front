import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    HStack,
    Icon,
    useToast,
    Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const ContactSection = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulación de envío
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Mensaje enviado",
                description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 1500);
    };

    const contactInfo = [
        {
            icon: FiMail,
            title: "Email",
            detail: "info@duotask.com",
            color: "brand.500"
        },
        {
            icon: FiPhone,
            title: "Teléfono",
            detail: "+52 555 123 4567",
            color: "accent.500"
        },
        {
            icon: FiMapPin,
            title: "Dirección",
            detail: "Av. Tecnológica 2075, Ciudad de México",
            color: "green.500"
        }
    ];

    return (
        <Box py={20} bg="background.card" position="relative" id="contacto">
            <Container maxW="container.xl" position="relative" zIndex={1}>
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Contáctanos
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        ¿Tienes preguntas o necesitas ayuda? Estamos aquí para ti. Contáctanos y te responderemos a la brevedad.
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
                    <AnimatedBox animation="slideRight">
                        <VStack spacing={8} align="start">
                            <Heading size="lg">Información de Contacto</Heading>

                            <Text color="text.secondary" fontSize="md" lineHeight="1.8">
                                Nos encantaría saber de ti. Ya sea que tengas una pregunta sobre funcionalidades,
                                precios, necesites una demostración o cualquier otra cosa, nuestro equipo está
                                listo para responder todas tus preguntas.
                            </Text>

                            <VStack spacing={6} align="stretch" width="100%">
                                {contactInfo.map((item, index) => (
                                    <HStack
                                        key={index}
                                        bg="background.secondary"
                                        p={4}
                                        borderRadius="md"
                                        borderLeftWidth="4px"
                                        borderLeftColor={item.color}
                                        spacing={4}
                                        _hover={{
                                            transform: "translateX(5px)",
                                            transition: "transform 0.3s ease"
                                        }}
                                    >
                                        <Flex
                                            w="50px"
                                            h="50px"
                                            justify="center"
                                            align="center"
                                            bg={`${item.color}20`}
                                            borderRadius="lg"
                                        >
                                            <Icon as={item.icon} color={item.color} boxSize={5} />
                                        </Flex>
                                        <Box>
                                            <Text fontWeight="bold" fontSize="md">{item.title}</Text>
                                            <Text color="text.secondary">{item.detail}</Text>
                                        </Box>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    </AnimatedBox>

                    <AnimatedBox animation="slideLeft" delay={0.2}>
                        <Box
                            bg="background.secondary"
                            p={8}
                            borderRadius="xl"
                            boxShadow="lg"
                            borderWidth="1px"
                            borderColor="rgba(255, 255, 255, 0.05)"
                        >
                            <Heading size="md" mb={6}>Envíanos un mensaje</Heading>

                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel htmlFor="name">Nombre completo</FormLabel>
                                        <Input
                                            id="name"
                                            placeholder="Tu nombre"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel htmlFor="subject">Asunto</FormLabel>
                                        <Input
                                            id="subject"
                                            placeholder="¿Sobre qué quieres hablar?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel htmlFor="message">Mensaje</FormLabel>
                                        <Textarea
                                            id="message"
                                            placeholder="Escribe tu mensaje aquí..."
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="brand"
                                        size="lg"
                                        width="full"
                                        mt={4}
                                        isLoading={isSubmitting}
                                        loadingText="Enviando..."
                                        leftIcon={<FiSend />}
                                    >
                                        Enviar mensaje
                                    </Button>
                                </VStack>
                            </form>
                        </Box>
                    </AnimatedBox>
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default ContactSection;