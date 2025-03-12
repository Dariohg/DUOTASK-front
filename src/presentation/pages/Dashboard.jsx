import { useState, useEffect } from 'react';
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
    useDisclosure,
    useToast,
    Spinner,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from '@chakra-ui/react';
import { FiUsers, FiCheckSquare, FiBook, FiCalendar, FiPlus, FiExternalLink, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CreateGroupModal from '../components/classes/CreateGroupModal';
import CreateStudentModal from '../components/students/CreateStudentModal';
import groupService from '../../services/api/groupService';
import studentService from '../../services/api/studentService';

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
    const toast = useToast();
    const {
        isOpen: isGroupModalOpen,
        onOpen: openGroupModal,
        onClose: closeGroupModal
    } = useDisclosure();
    const {
        isOpen: isStudentModalOpen,
        onOpen: openStudentModal,
        onClose: closeStudentModal
    } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);

    // Obtener el nombre del usuario de manera segura, con valor por defecto
    const userName = user?.name ? user.name.split(' ')[0] : 'Profesor';

    // Cargar grupos y estudiantes al montar el componente
    useEffect(() => {
        fetchGroups();
        fetchStudents();
    }, []);

    // Función para obtener los grupos
    const fetchGroups = async () => {
        setIsLoadingGroups(true);
        try {
            const fetchedGroups = await groupService.getGroups();
            setGroups(fetchedGroups);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los grupos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoadingGroups(false);
        }
    };

    // Función para obtener los estudiantes
    const fetchStudents = async () => {
        setIsLoadingStudents(true);
        try {
            const fetchedStudents = await studentService.getStudents();
            setStudents(fetchedStudents);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los estudiantes',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoadingStudents(false);
        }
    };

    // Función para crear un grupo
    const handleCreateGroup = async (groupData) => {
        setIsLoading(true);

        try {
            const newGroup = await groupService.createGroup(groupData);

            // Actualizar la lista de grupos
            setGroups(prevGroups => [...prevGroups, newGroup]);

            toast({
                title: 'Grupo creado',
                description: `El grupo "${groupData.nombre}" ha sido creado exitosamente.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            return newGroup;
        } catch (error) {
            console.error('Error al crear grupo:', error);
            throw new Error('Error al crear el grupo');
        } finally {
            setIsLoading(false);
        }
    };

    // Función para crear un estudiante
    const handleCreateStudent = async (studentData) => {
        setIsLoading(true);

        try {
            const newStudent = await studentService.createStudent(studentData);

            // Actualizar la lista de estudiantes
            setStudents(prevStudents => [...prevStudents, newStudent]);

            // También actualizar los grupos para reflejar el nuevo estudiante
            fetchGroups();

            toast({
                title: 'Estudiante agregado',
                description: `${studentData.nombre} ${studentData.apellido} ha sido agregado exitosamente.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            return newStudent;
        } catch (error) {
            console.error('Error al agregar estudiante:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

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
                    value={students.length.toString()}
                    helpText="Total activos"
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
                    title="Grupos"
                    value={groups.length.toString()}
                    helpText="Total activos"
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
                    {/* Tabs para Grupos y Estudiantes */}
                    <Card bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                        <CardBody p={0}>
                            <Tabs colorScheme="brand" variant="enclosed">
                                <TabList px={4} pt={4}>
                                    <Tab>Grupos</Tab>
                                    <Tab>Estudiantes</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* Tab Panel: Grupos */}
                                    <TabPanel p={4}>
                                        <Flex justify="space-between" align="center" mb={4}>
                                            <Heading as="h3" size="md">
                                                Mis Grupos
                                            </Heading>
                                            <Button
                                                size="sm"
                                                colorScheme="brand"
                                                leftIcon={<Icon as={FiPlus} />}
                                                onClick={openGroupModal}
                                            >
                                                Crear Grupo
                                            </Button>
                                        </Flex>

                                        {isLoadingGroups ? (
                                            <Flex justify="center" align="center" py={6}>
                                                <Spinner size="lg" color="brand.500" />
                                            </Flex>
                                        ) : groups.length === 0 ? (
                                            <VStack spacing={4} align="center" justify="center" py={4} bg="whiteAlpha.50" borderRadius="md">
                                                <Icon as={FiBook} boxSize={8} color="gray.500" />
                                                <Text color="text.secondary" textAlign="center">
                                                    Crea tu primer grupo para comenzar<br />a gestionar tus clases
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    colorScheme="brand"
                                                    leftIcon={<Icon as={FiPlus} />}
                                                    onClick={openGroupModal}
                                                    variant="outline"
                                                >
                                                    Crear Grupo
                                                </Button>
                                            </VStack>
                                        ) : (
                                            <VStack spacing={3} align="stretch">
                                                {groups.slice(0, 3).map((group) => (
                                                    <Box
                                                        key={group.id}
                                                        p={3}
                                                        borderRadius="md"
                                                        borderWidth="1px"
                                                        borderColor="rgba(255, 255, 255, 0.08)"
                                                        _hover={{ bg: "rgba(255, 255, 255, 0.03)" }}
                                                    >
                                                        <Flex justify="space-between" align="center">
                                                            <Box>
                                                                <Flex align="center">
                                                                    <Text fontWeight="medium">{group.nombre}</Text>
                                                                    <Badge ml={2} colorScheme="purple">Grado {group.grado}</Badge>
                                                                </Flex>
                                                                <Flex align="center" mt={1}>
                                                                    <Icon as={FiUsers} size="sm" color="gray.500" mr={1} />
                                                                    <Text fontSize="sm" color="text.secondary">
                                                                        {group.alumnos ? group.alumnos.length : 0} estudiantes
                                                                    </Text>
                                                                </Flex>
                                                            </Box>
                                                        </Flex>
                                                    </Box>
                                                ))}

                                                {groups.length > 3 && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        colorScheme="brand"
                                                        rightIcon={<Icon as={FiExternalLink} />}
                                                        w="full"
                                                    >
                                                        Ver todos los grupos ({groups.length})
                                                    </Button>
                                                )}
                                            </VStack>
                                        )}
                                    </TabPanel>

                                    {/* Tab Panel: Estudiantes */}
                                    <TabPanel p={4}>
                                        <Flex justify="space-between" align="center" mb={4}>
                                            <Heading as="h3" size="md">
                                                Mis Estudiantes
                                            </Heading>
                                            <Button
                                                size="sm"
                                                colorScheme="brand"
                                                leftIcon={<Icon as={FiUserPlus} />}
                                                onClick={openStudentModal}
                                                isDisabled={groups.length === 0}
                                            >
                                                Agregar Estudiante
                                            </Button>
                                        </Flex>

                                        {isLoadingStudents ? (
                                            <Flex justify="center" align="center" py={6}>
                                                <Spinner size="lg" color="brand.500" />
                                            </Flex>
                                        ) : groups.length === 0 ? (
                                            <VStack spacing={4} align="center" justify="center" py={4} bg="whiteAlpha.50" borderRadius="md">
                                                <Icon as={FiUsers} boxSize={8} color="gray.500" />
                                                <Text color="text.secondary" textAlign="center">
                                                    Necesitas crear un grupo primero<br />antes de agregar estudiantes
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    colorScheme="brand"
                                                    leftIcon={<Icon as={FiPlus} />}
                                                    onClick={openGroupModal}
                                                    variant="outline"
                                                >
                                                    Crear Grupo
                                                </Button>
                                            </VStack>
                                        ) : students.length === 0 ? (
                                            <VStack spacing={4} align="center" justify="center" py={4} bg="whiteAlpha.50" borderRadius="md">
                                                <Icon as={FiUsers} boxSize={8} color="gray.500" />
                                                <Text color="text.secondary" textAlign="center">
                                                    No hay estudiantes registrados<br />Agrega tu primer estudiante
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    colorScheme="brand"
                                                    leftIcon={<Icon as={FiUserPlus} />}
                                                    onClick={openStudentModal}
                                                    variant="outline"
                                                >
                                                    Agregar Estudiante
                                                </Button>
                                            </VStack>
                                        ) : (
                                            <VStack spacing={3} align="stretch">
                                                {students.slice(0, 3).map((student) => {
                                                    // Encontrar el grupo al que pertenece el estudiante
                                                    const group = groups.find(g => g.id === student.idGrupo);

                                                    return (
                                                        <Box
                                                            key={student.id}
                                                            p={3}
                                                            borderRadius="md"
                                                            borderWidth="1px"
                                                            borderColor="rgba(255, 255, 255, 0.08)"
                                                            _hover={{ bg: "rgba(255, 255, 255, 0.03)" }}
                                                        >
                                                            <Flex justify="space-between" align="center">
                                                                <Box>
                                                                    <Text fontWeight="medium">
                                                                        {student.nombre} {student.apellido}
                                                                    </Text>
                                                                    <Flex align="center" mt={1}>
                                                                        <Icon as={FiBook} size="sm" color="gray.500" mr={1} />
                                                                        <Text fontSize="sm" color="text.secondary">
                                                                            {group ? `${group.nombre} (Grado ${group.grado})` : 'Grupo no disponible'}
                                                                        </Text>
                                                                    </Flex>
                                                                </Box>
                                                            </Flex>
                                                        </Box>
                                                    );
                                                })}

                                                {students.length > 3 && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        colorScheme="brand"
                                                        rightIcon={<Icon as={FiExternalLink} />}
                                                        w="full"
                                                    >
                                                        Ver todos los estudiantes ({students.length})
                                                    </Button>
                                                )}
                                            </VStack>
                                        )}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </CardBody>
                    </Card>

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
                </VStack>
            </Grid>

            {/* Modal para crear grupos */}
            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={closeGroupModal}
                onCreateGroup={handleCreateGroup}
            />

            {/* Modal para agregar estudiantes */}
            <CreateStudentModal
                isOpen={isStudentModalOpen}
                onClose={closeStudentModal}
                onCreateStudent={handleCreateStudent}
            />
        </Box>
    );
};

export default Dashboard;