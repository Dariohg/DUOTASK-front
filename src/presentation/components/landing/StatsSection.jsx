import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Icon,
} from '@chakra-ui/react';
import { FiTrendingUp } from 'react-icons/fi';
import { AnimatedBox } from './utils/AnimationUtils';

const StatCard = ({ stat, index }) => {
    return (
        <AnimatedBox
            animation="slideUp"
            delay={0.1 * index}
            bg="background.secondary"
            p={5}
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
            <Stat>
                <StatLabel fontSize="md" color="text.secondary">{stat.label}</StatLabel>
                <StatNumber
                    fontSize="4xl"
                    bgGradient="linear(to-r, brand.400, accent.400)"
                    bgClip="text"
                    fontWeight="bold"
                >
                    {stat.value}
                </StatNumber>
                {stat.helpText && (
                    <StatHelpText color="green.400">
                        <Icon as={FiTrendingUp} mr={1} /> {stat.helpText}
                    </StatHelpText>
                )}
            </Stat>
        </AnimatedBox>
    );
};

const StatsSection = () => {
    const stats = [
        { label: "Escuelas", value: "500+", helpText: "16% crecimiento anual" },
        { label: "Educadores", value: "10,000+", helpText: "24% aumento en 2023" },
        { label: "Tareas administradas", value: "5M+", helpText: "30% más eficiencia" },
        { label: "Horas ahorradas", value: "120K", helpText: "Por cada 100 maestros" },
    ];

    return (
        <Box py={16} bg="background.tertiary" position="relative">
            <Container maxW="container.xl">
                <AnimatedBox animation="slideUp" textAlign="center" mb={12}>
                    <Heading
                        size="xl"
                        mb={3}
                        bgGradient="linear(to-r, brand.400, accent.400)"
                        bgClip="text"
                    >
                        Impacto en números
                    </Heading>
                    <Text color="text.secondary" fontSize="lg" maxW="800px" mx="auto">
                        Miles de educadores confían en DUOTASK para optimizar sus procesos de enseñanza
                    </Text>
                </AnimatedBox>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} index={index} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default StatsSection;