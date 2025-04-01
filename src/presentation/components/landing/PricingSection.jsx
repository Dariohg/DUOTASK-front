import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    Flex,
    Button,
    List,
    ListItem,
    ListIcon,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const PriceCard = ({ plan, isPopular }) => {
    return (
        <AnimatedBox
            animation="slideUp"
            delay={plan.delay}
            bg="background.secondary"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={isPopular ? "brand.500" : "rgba(255, 255, 255, 0.05)"}
            position="relative"
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-8px)",
                boxShadow: "xl",
            }}
            height="100%"
        >
            {isPopular && (
                <Badge
                    colorScheme="brand"
                    position="absolute"
                    top="-4"
                    right="50%"
                    transform="translateX(50%)"
                    fontSize="sm"
                    py={2}
                    px={3}
                    borderRadius="full"
                    boxShadow="md"
                >
                    Más Popular
                </Badge>
            )}

            <VStack spacing={5} align="flex-start" height="100%">
                <Text color="text.secondary" fontWeight="medium">
                    {plan.type}
                </Text>
                <Heading size="xl">{plan.name}</Heading>
                <Flex align="baseline" mt={2}>
                    <Heading size="2xl">${plan.price}</Heading>
                    <Text fontSize="xl" color="text.secondary" ml={2}>
                        / mes
                    </Text>
                </Flex>
                <Text color="text.secondary">
                    {plan.description}
                </Text>

                <Button
                    mt={6}
                    colorScheme={isPopular ? "brand" : "gray"}
                    variant={isPopular ? "solid" : "outline"}
                    size="lg"
                    width="full"
                >
                    {plan.buttonText}
                </Button>

                <Box py={6} flexGrow={1}>
                    <List spacing={3}>
                        {plan.features.map((feature, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                                <ListIcon
                                    as={feature.included ? FiCheck : FiX}
                                    color={feature.included ? "green.400" : "red.400"}
                                    fontSize="1.25em"
                                    mr={3}
                                />
                                <Text color={feature.included ? "text.primary" : "text.secondary"}>
                                    {feature.text}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </VStack>
        </AnimatedBox>
    );
};

const PricingSection = () => {
    const plans = [
        {
            type: "PLAN BÁSICO",
            name: "Starter",
            price: 0,
            description: "Ideal para educadores individuales o que inician.",
            buttonText: "Comenzar Gratis",
            features: [
                { text: "Hasta 30 estudiantes", included: true },
                { text: "5 grupos o clases", included: true },
                { text: "Gestión básica de tareas", included: true },
                { text: "1 GB almacenamiento", included: true },
                { text: "Soporte por email", included: true },
                { text: "Reportes básicos", included: false },
                { text: "Integración con calendarios", included: false },
                { text: "API para extensiones", included: false },
            ],
            delay: 0.1
        },
        {
            type: "PLAN PROFESIONAL",
            name: "Pro",
            price: 15,
            description: "Para profesores con necesidades avanzadas.",
            buttonText: "Suscribirse",
            features: [
                { text: "Hasta 150 estudiantes", included: true },
                { text: "15 grupos o clases", included: true },
                { text: "Gestión avanzada de tareas", included: true },
                { text: "10 GB almacenamiento", included: true },
                { text: "Soporte prioritario", included: true },
                { text: "Reportes avanzados", included: true },
                { text: "Integración con calendarios", included: true },
                { text: "API para extensiones", included: false },
            ],
            delay: 0.2
        },
        {
            type: "PLAN INSTITUCIONAL",
            name: "Enterprise",
            price: 49,
            description: "Para instituciones y centros educativos.",
            buttonText: "Contactar Ventas",
            features: [
                { text: "Estudiantes ilimitados", included: true },
                { text: "Grupos ilimitados", included: true },
                { text: "Gestión completa de tareas", included: true },
                { text: "100 GB almacenamiento", included: true },
                { text: "Soporte dedicado 24/7", included: true },
                { text: "Reportes personalizados", included: true },
                { text: "Integración total", included: true },
                { text: "API completa y extensiones", included: true },
            ],
            delay: 0.3
        }
    ];

    return (
        <Box py={20} bg="background.primary" position="relative" id="precios">
            <Container maxW="container.xl" position="relative" zIndex={1}>
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={5}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Planes y Precios
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Elige el plan que mejor se adapte a tus necesidades educativas
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} alignItems="stretch">
                    {plans.map((plan, index) => (
                        <PriceCard
                            key={index}
                            plan={plan}
                            isPopular={index === 1}
                        />
                    ))}
                </SimpleGrid>

                <Box mt={12} p={6} bg="background.secondary" borderRadius="xl" textAlign="center">
                    <Heading size="md" mb={4}>
                        ¿Necesitas un plan personalizado?
                    </Heading>
                    <Text color="text.secondary" mb={4}>
                        Contacta con nuestro equipo de ventas para crear un plan adaptado a tus necesidades específicas.
                    </Text>
                    <Button colorScheme="brand" size="lg" variant="outline">
                        Contactar ventas
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PricingSection;