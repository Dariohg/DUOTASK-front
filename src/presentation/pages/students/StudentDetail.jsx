import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    SimpleGrid,
    Card,
    CardBody,
    HStack,
    VStack,
    Icon,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    useToast,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiEdit2,
    FiBook,
    FiBarChart2,
    FiCalendar,
    FiCheckCircle,
    FiInfo,
} from 'react-icons/fi';
import studentService from '../../../services/api/studentService';
import groupService from '../../../services/api/groupService';
import taskService from '../../../services/api/taskService';

const StudentDetail = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [student, setStudent] = useState(null);
    const [group, setGroup] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const groupId = location.state?.groupId || null;

    const handleGoBack = () => {
        if (groupId) {
            // Si tenemos el ID del grupo, volvemos a la página de detalles del grupo
            navigate(`/app/classes/${groupId}`);
        } else {
            // Si no tenemos el ID del grupo, volvemos a la página general de estudiantes
            navigate('/app/students');
        }
    };

    // Cargar datos del estudiante al montar el componente
    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Obtener datos del estudiante
            const studentData = await studentService.getStudentById(studentId);
            setStudent(studentData);

            // Obtener datos del grupo
            const groupData = await groupService.getGroupById(studentData.idGrupo);
            setGroup(groupData);

            try {
                // Obtener tareas y calificaciones del estudiante
                const tasksData = await taskService.getTasksByStudent(studentId);
                setTasks(tasksData);
            } catch (taskError) {
                console.error('Error al cargar tareas del estudiante:', taskError);
                // No establece error global, solo muestra un mensaje
                toast({
                    title: 'Advertencia',
                    description: 'No se pudieron cargar las tareas del estudiante',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
                setTasks([]); // Establecer array vacío
            }
        } catch (err) {
            console.error('Error al cargar datos básicos del estudiante:', err);
            setError('No se pudo cargar la información del estudiante');
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información del estudiante',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    // Obtener color de estado de tarea
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'blue';
            case 'completed':
                return 'green';
            case 'archived':
                return 'gray';
            default:
                return 'gray';
        }
    };

    // Calcular promedio de calificaciones
    const calculateAverageGrade = () => {
        const gradesWithValues = tasks.filter(task => task.calificacion !== null);

        if (gradesWithValues.length === 0) return 'N/A';

        const sum = gradesWithValues.reduce((acc, task) => acc + task.calificacion, 0);
        return (sum / gradesWithValues.length).toFixed(1);
    };

    // Navegar a la vista de calificación de una tarea específica
    const navigateToTaskGrades = (taskId) => {
        navigate(`/app/tasks/${taskId}/grades`);
    };

    // Manejar la edición del estudiante
    const handleEditStudent = () => {
        toast({
            title: 'Función en desarrollo',
            description: 'La edición de estudiantes estará disponible próximamente',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    if (isLoading) {
        return (
            <Flex h="300px" align="center" justify="center">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Card>
                <CardBody>
                    <VStack spacing={4} py={10}>
                        <Heading size="md" color="red.500">{error}</Heading>
                        <Button
                            colorScheme="brand"
                            leftIcon={<Icon as={FiArrowLeft} />}
                            onClick={handleGoBack}
                        >
                            Volver a estudiantes
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    if (!student || !group) {
        return (
            <Card>
                <CardBody>
                    <VStack spacing={4} py={10}>
                        <Heading size="md">Estudiante no encontrado</Heading>
                        <Button
                            colorScheme="brand"
                            leftIcon={<Icon as={FiArrowLeft} />}
                            onClick={() => navigate('/app/students')}
                        >
                            Volver a estudiantes
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    return (
        <Box p={4}>
            {/* Cabecera */}
            <HStack mb={6} spacing={4}>
                <IconButton
                    icon={<FiArrowLeft />}
                    aria-label="Volver"
                    onClick={() => navigate('/app/students')}
                    variant="ghost"
                />
                <Box>
                    <Heading as="h1" size="xl" mb={1}>
                        {student.nombre} {student.apellido}
                    </Heading>
                    <HStack>
                        <Badge colorScheme="purple">
                            Grupo: {group.nombre}
                        </Badge>
                        <Badge colorScheme="blue">
                            Grado {group.grado}
                        </Badge>
                        <Tooltip label="Editar información del estudiante">
                            <IconButton
                                icon={<FiEdit2 />}
                                aria-label="Editar estudiante"
                                size="sm"
                                variant="ghost"
                                colorScheme="brand"
                                onClick={handleEditStudent}
                            />
                        </Tooltip>
                    </HStack>
                </Box>
            </HStack>

            {/* Resumen de calificaciones */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
                <Card bg="background.card">
                    <CardBody>
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                                <Text color="text.secondary" fontSize="sm">Promedio</Text>
                                <Heading size="xl">{calculateAverageGrade()}</Heading>
                            </VStack>
                            <Box
                                p={2}
                                bg="green.500"
                                color="white"
                                borderRadius="lg"
                            >
                                <Icon as={FiBarChart2} boxSize={6} />
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>

                <Card bg="background.card">
                    <CardBody>
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                                <Text color="text.secondary" fontSize="sm">Tareas Entregadas</Text>
                                <Heading size="xl">
                                    {tasks.filter(task => task.calificacion !== null).length}
                                </Heading>
                                <Text color="green.400" fontSize="sm">
                                    de {tasks.length} tareas
                                </Text>
                            </VStack>
                            <Box
                                p={2}
                                bg="blue.500"
                                color="white"
                                borderRadius="lg"
                            >
                                <Icon as={FiCheckCircle} boxSize={6} />
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>

                <Card bg="background.card">
                    <CardBody>
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                                <Text color="text.secondary" fontSize="sm">Ultima Tarea</Text>
                                <Heading size="md" noOfLines={1}>
                                    {tasks.length > 0
                                        ? tasks[tasks.length - 1].titulo
                                        : 'Sin tareas'}
                                </Heading>
                                {tasks.length > 0 && (
                                    <Text color="text.secondary" fontSize="sm">
                                        {formatDate(tasks[tasks.length - 1].createdAt)}
                                    </Text>
                                )}
                            </VStack>
                            <Box
                                p={2}
                                bg="orange.500"
                                color="white"
                                borderRadius="lg"
                            >
                                <Icon as={FiCalendar} boxSize={6} />
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>

                <Card bg="background.card">
                    <CardBody>
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                                <Text color="text.secondary" fontSize="sm">Estado</Text>
                                <Badge colorScheme={
                                    calculateAverageGrade() >= 6
                                        ? 'green'
                                        : calculateAverageGrade() !== 'N/A'
                                            ? 'red'
                                            : 'gray'
                                }>
                                    {calculateAverageGrade() >= 6
                                        ? 'Aprobado'
                                        : calculateAverageGrade() !== 'N/A'
                                            ? 'En riesgo'
                                            : 'Sin calificar'}
                                </Badge>
                            </VStack>
                            <Box
                                p={2}
                                bg="red.500"
                                color="white"
                                borderRadius="lg"
                            >
                                <Icon as={FiInfo} boxSize={6} />
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>
            </SimpleGrid>

            {/* Tabla de tareas y calificaciones */}
            <Card>
                <CardBody>
                    <Heading size="md" mb={6}>
                        Historial de Tareas
                    </Heading>

                    {tasks.length === 0 ? (
                        <VStack py={10} spacing={4}>
                            <Icon as={FiBook} boxSize={12} color="gray.500" />
                            <Text fontSize="lg" fontWeight="medium">
                                No hay tareas registradas
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="500px">
                                Este estudiante aún no tiene tareas asignadas o entregadas.
                            </Text>
                        </VStack>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Tarea</Th>
                                        <Th>Grupo</Th>
                                        <Th>Fecha de creación</Th>
                                        <Th>Fecha de entrega</Th>
                                        <Th>Calificación</Th>
                                        <Th textAlign="center">Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {tasks.map(task => (
                                        <Tr key={task.id}>
                                            <Td>
                                                <Text fontWeight="medium">{task.titulo}</Text>
                                                <Badge
                                                    colorScheme={getStatusColor(task.status)}
                                                    size="sm"
                                                >
                                                    {task.status === 'active'
                                                        ? 'Activa'
                                                        : task.status === 'completed'
                                                            ? 'Completada'
                                                            : 'Archivada'}
                                                </Badge>
                                            </Td>
                                            <Td>{group.nombre}</Td>
                                            <Td>{formatDate(task.createdAt)}</Td>
                                            <Td>
                                                {task.fechaEntrega
                                                    ? formatDate(task.fechaEntrega)
                                                    : 'No establecida'}
                                            </Td>
                                            <Td>
                                                {task.calificacion !== null
                                                    ? task.calificacion.toFixed(1)
                                                    : '—'}
                                            </Td>
                                            <Td textAlign="center">
                                                <Tooltip label="Ver detalles de calificación">
                                                    <IconButton
                                                        icon={<FiBarChart2 />}
                                                        aria-label="Ver calificación"
                                                        size="sm"
                                                        colorScheme="brand"
                                                        variant="ghost"
                                                        onClick={() => navigateToTaskGrades(task.id)}
                                                    />
                                                </Tooltip>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </CardBody>
            </Card>
        </Box>
    );
};

export default StudentDetail;