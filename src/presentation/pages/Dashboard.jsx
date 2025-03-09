import {
    Box,
    Grid,
    Heading,
    Text,
    Flex,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Icon,
    SimpleGrid,
    Progress,
    HStack,
    VStack,
    Badge,
    Button,
} from '@chakra-ui/react';
import { FiUsers, FiCheckSquare, FiBook, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, icon, helpText, increase, color = "brand.500" }) => {
    return (
        <Card bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
            <CardBody>
                <Flex justify="space-between" align="center">
                    <Stat>
                        <StatLabel color="text.secondary">{title}</StatLabel>
                        <StatNumber fontSize="3xl">{value}</StatNumber>
                        {helpText && (
                            <StatHelpText>
                                {increase && <Badge colorScheme={increase >= 0 ? "green" : "red"} me={2}>
                                    {increase >= 0 ? `+${increase}%` : `${increase}%`}
                                </Badge>}
                                {helpText}
                            </StatHelpText>
                        )}
                    </Stat>
                    <Flex
                        w="56px"
                        h="56px"
                        align="center"
                        justify="center"
                        backgroundColor={`${color}20`}
                        borderRadius="lg"
                    >
                        <Icon as={icon} color={color} boxSize={6} />
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    );
};

const Dashboard = () => {
    const { user } = useAuth();

    // Obtener el nombre del usuario de manera segura, con valor por defecto
    const userName = user?.name ? user.name.split(' ')[0] : 'Profesor';

    return (
        <Box p={4}>
            {/* Cabecera */}
            <Box mb={8}>
                <Heading as="h1" size="xl" mb={2}>
                    Bienvenido, {userName}
                </Heading>
                <Text color="text.secondary">
                    Aquí tienes un resumen de tu actividad reciente
                </Text>
            </Box>

            {/* Tarjetas de estadísticas */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
                <StatCard
                    title="Estudiantes"
                    value="32"
                    helpText="Total activos"
                    increase={5}
                    icon={FiUsers}
                    color="brand.500"
                />
                <StatCard
                    title="Tareas Pendientes"
                    value="8"
                    helpText="Por calificar"
                    increase={-12}
                    icon={FiCheckSquare}
                    color="accent.500"
                />
                <StatCard
                    title="Clases"
                    value="4"
                    helpText="Este semestre"
                    icon={FiBook}
                    color="green.500"
                />
                <StatCard
                    title="Eventos"
                    value="2"
                    helpText="Esta semana"
                    icon={FiCalendar}
                    color="orange.500"
                />
            </SimpleGrid>

            {/* Contenido principal */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                {/* Panel izquierdo */}
                <Box>
                    {/* Progreso de tareas */}
                    <Card mb={6} bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                        <CardBody>
                            <Heading as="h3" size="md" mb={4}>
                                Progreso de Tareas
                            </Heading>

                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Flex justify="space-between" mb={1}>
                                        <Text fontSize="sm">Matemáticas - Fracciones</Text>
                                        <Text fontSize="sm" fontWeight="medium">
                                            75%
                                        </Text>
                                    </Flex>
                                    <Progress value={75} size="sm" colorScheme="brand" borderRadius="full" />
                                </Box>

                                <Box>
                                    <Flex justify="space-between" mb={1}>
                                        <Text fontSize="sm">Ciencias - Sistema Solar</Text>
                                        <Text fontSize="sm" fontWeight="medium">
                                            90%
                                        </Text>
                                    </Flex>
                                    <Progress value={90} size="sm" colorScheme="green" borderRadius="full" />
                                </Box>

                                <Box>
                                    <Flex justify="space-between" mb={1}>
                                        <Text fontSize="sm">Historia - Revolución Industrial</Text>
                                        <Text fontSize="sm" fontWeight="medium">
                                            40%
                                        </Text>
                                    </Flex>
                                    <Progress value={40} size="sm" colorScheme="orange" borderRadius="full" />
                                </Box>

                                <Box>
                                    <Flex justify="space-between" mb={1}>
                                        <Text fontSize="sm">Literatura - Análisis de Texto</Text>
                                        <Text fontSize="sm" fontWeight="medium">
                                            20%
                                        </Text>
                                    </Flex>
                                    <Progress value={20} size="sm" colorScheme="red" borderRadius="full" />
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Tareas recientes */}
                    <Card bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                        <CardBody>
                            <Flex justify="space-between" mb={4}>
                                <Heading as="h3" size="md">
                                    Tareas Recientes
                                </Heading>
                                <Button size="sm" variant="ghost" colorScheme="brand">
                                    Ver todas
                                </Button>
                            </Flex>

                            <VStack spacing={4} align="stretch">
                                {[
                                    {
                                        title: "Ejercicios de multiplicación",
                                        class: "Matemáticas",
                                        dueDate: "10/03/2025",
                                        status: "Pendiente"
                                    },
                                    {
                                        title: "Reporte de laboratorio",
                                        class: "Ciencias",
                                        dueDate: "15/03/2025",
                                        status: "En progreso"
                                    },
                                    {
                                        title: "Mapa conceptual",
                                        class: "Historia",
                                        dueDate: "08/03/2025",
                                        status: "Completada"
                                    },
                                    {
                                        title: "Ensayo literario",
                                        class: "Literatura",
                                        dueDate: "20/03/2025",
                                        status: "No iniciada"
                                    },
                                ].map((task, idx) => (
                                    <Box
                                        key={idx}
                                        p={3}
                                        borderRadius="md"
                                        borderWidth="1px"
                                        borderColor="rgba(255, 255, 255, 0.08)"
                                        _hover={{ bg: "rgba(255, 255, 255, 0.03)" }}
                                    >
                                        <Flex justify="space-between" align="center">
                                            <VStack spacing={0} align="start">
                                                <Text fontWeight="medium">{task.title}</Text>
                                                <Text fontSize="sm" color="text.secondary">
                                                    {task.class} • Fecha límite: {task.dueDate}
                                                </Text>
                                            </VStack>
                                            <Badge
                                                colorScheme={
                                                    task.status === "Completada"
                                                        ? "green"
                                                        : task.status === "En progreso"
                                                            ? "orange"
                                                            : task.status === "Pendiente"
                                                                ? "purple"
                                                                : "gray"
                                                }
                                            >
                                                {task.status}
                                            </Badge>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </CardBody>
                    </Card>
                </Box>

                {/* Panel derecho */}
                <VStack spacing={6} align="stretch">
                    {/* Calendario */}
                    <Card bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                        <CardBody>
                            <Heading as="h3" size="md" mb={4}>
                                Próximos Eventos
                            </Heading>

                            <VStack spacing={3} align="stretch">
                                {[
                                    {
                                        title: "Reunión de padres",
                                        date: "12 Marzo",
                                        time: "18:00"
                                    },
                                    {
                                        title: "Entrega de calificaciones",
                                        date: "15 Marzo",
                                        time: "10:00"
                                    },
                                    {
                                        title: "Feria de ciencias",
                                        date: "20 Marzo",
                                        time: "14:00"
                                    },
                                ].map((event, idx) => (
                                    <Flex key={idx} align="center" py={2}>
                                        <Flex
                                            direction="column"
                                            align="center"
                                            justify="center"
                                            bg="background.tertiary"
                                            borderRadius="md"
                                            p={2}
                                            minW="50px"
                                            mr={3}
                                        >
                                            <Text fontSize="sm" fontWeight="bold">
                                                {event.date.split(' ')[0]}
                                            </Text>
                                            <Text fontSize="xs" color="text.secondary">
                                                {event.date.split(' ')[1]}
                                            </Text>
                                        </Flex>
                                        <Box>
                                            <Text fontWeight="medium">{event.title}</Text>
                                            <Text fontSize="sm" color="text.secondary">
                                                {event.time}
                                            </Text>
                                        </Box>
                                    </Flex>
                                ))}
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Estudiantes destacados */}
                    <Card bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                        <CardBody>
                            <Heading as="h3" size="md" mb={4}>
                                Estudiantes Destacados
                            </Heading>

                            <VStack spacing={3} align="stretch">
                                {[
                                    { name: "Ana García", grade: "A+", class: "Matemáticas" },
                                    { name: "Pedro Martínez", grade: "A", class: "Ciencias" },
                                    { name: "Laura Rodríguez", grade: "A", class: "Historia" },
                                ].map((student, idx) => (
                                    <Flex key={idx} align="center" py={2}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            bg={`${
                                                student.grade === "A+"
                                                    ? "green.500"
                                                    : student.grade === "A"
                                                        ? "brand.500"
                                                        : "orange.500"
                                            }30`}
                                            color={
                                                student.grade === "A+"
                                                    ? "green.500"
                                                    : student.grade === "A"
                                                        ? "brand.500"
                                                        : "orange.500"
                                            }
                                            borderRadius="full"
                                            p={2}
                                            boxSize="40px"
                                            mr={3}
                                            fontWeight="bold"
                                        >
                                            {student.name.charAt(0)}
                                        </Flex>
                                        <Box flex="1">
                                            <Text fontWeight="medium">{student.name}</Text>
                                            <Text fontSize="sm" color="text.secondary">
                                                {student.class}
                                            </Text>
                                        </Box>
                                        <Badge
                                            px={3}
                                            py={1}
                                            colorScheme={
                                                student.grade === "A+" ? "green" : student.grade === "A" ? "blue" : "orange"
                                            }
                                            fontSize="sm"
                                            borderRadius="full"
                                        >
                                            {student.grade}
                                        </Badge>
                                    </Flex>
                                ))}
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Grid>
        </Box>
    );
};

export default Dashboard;