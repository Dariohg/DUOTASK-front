import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Textarea,
    Badge,
    Card,
    CardBody,
    HStack,
    VStack,
    Spinner,
    useToast,
    Icon,
    Tooltip,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Divider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiSave,
    FiEdit,
    FiCheck,
    FiX,
    FiInfo,
    FiCalendar,
    FiClock,
    FiFilePlus,
    FiDownload,
    FiRotateCcw,
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import taskService from '../../../services/api/taskService';
import groupService from '../../../services/api/groupService';

const TaskGrades = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const cancelRef = useRef();

    const [task, setTask] = useState(null);
    const [group, setGroup] = useState(null);
    const [grades, setGrades] = useState([]);
    const [editingGrade, setEditingGrade] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    // Datos para editar calificación
    const [tempGrade, setTempGrade] = useState({
        calificacion: '',
        comentario: ''
    });

    // Cargar datos de la tarea y calificaciones
    useEffect(() => {
        fetchTaskData();
    }, [taskId]);

    const fetchTaskData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Obtener datos de la tarea
            const taskData = await taskService.getTaskById(taskId);
            setTask(taskData);

            // Obtener datos del grupo
            const groupData = await groupService.getGroupById(taskData.idGrupo);
            setGroup(groupData);

            // Obtener calificaciones
            const gradesData = await taskService.getGradesByTask(taskId);
            setGrades(gradesData);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('No se pudo cargar la información de la tarea y calificaciones');
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información de la tarea',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar edición de una calificación
    const startEditing = (grade) => {
        setEditingGrade(grade.id);
        setTempGrade({
            calificacion: grade.calificacion !== null ? grade.calificacion.toString() : '',
            comentario: grade.comentario || ''
        });
    };

    // Cancelar edición
    const cancelEditing = () => {
        setEditingGrade(null);
        setTempGrade({
            calificacion: '',
            comentario: ''
        });
    };

    // Guardar cambios en una calificación
    const saveGrade = async () => {
        if (editingGrade === null) return;

        setIsSaving(true);

        // Validar la calificación
        let calificacion = null;
        if (tempGrade.calificacion !== '') {
            const numberValue = parseFloat(tempGrade.calificacion);
            if (isNaN(numberValue) || numberValue < 0 || numberValue > 10) {
                toast({
                    title: 'Error',
                    description: 'La calificación debe ser un número entre 0 y 10',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setIsSaving(false);
                return;
            }
            calificacion = numberValue;
        }

        try {
            // Preparar datos para actualizar
            const updateData = {
                calificacion,
                comentario: tempGrade.comentario,
                entregada: calificacion !== null,
                fechaEntrega: new Date().toISOString()
            };

            // Actualizar la calificación
            const updatedGrade = await taskService.updateGrade(editingGrade, updateData);

            // Actualizar el estado local
            setGrades(prevGrades =>
                prevGrades.map(grade =>
                    grade.id === editingGrade ? { ...grade, ...updatedGrade } : grade
                )
            );

            toast({
                title: 'Calificación guardada',
                description: 'La calificación se ha guardado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Terminar la edición
            cancelEditing();
        } catch (error) {
            console.error('Error al guardar calificación:', error);
            toast({
                title: 'Error',
                description: 'No se pudo guardar la calificación',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Reiniciar todas las calificaciones
    const resetAllGrades = async () => {
        setShowConfirmReset(false);

        const confirmed = window.confirm(
            "¿Estás seguro de reiniciar todas las calificaciones? Esta acción no se puede deshacer."
        );

        if (!confirmed) return;

        setIsLoading(true);

        try {
            // Actualizar cada calificación a null
            for (const grade of grades) {
                await taskService.updateGrade(grade.id, {
                    calificacion: null,
                    comentario: '',
                    entregada: false,
                    fechaEntrega: null
                });
            }

            // Recargar datos
            fetchTaskData();

            toast({
                title: 'Calificaciones reiniciadas',
                description: 'Todas las calificaciones han sido reiniciadas',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error al reiniciar calificaciones:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron reiniciar las calificaciones',
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
            return format(parseISO(dateString), "d 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    // Calcular promedio de calificaciones
    const calculateAverage = () => {
        const gradesWithValues = grades.filter(grade => grade.calificacion !== null);

        if (gradesWithValues.length === 0) return 'N/A';

        const sum = gradesWithValues.reduce((acc, grade) => acc + grade.calificacion, 0);
        return (sum / gradesWithValues.length).toFixed(1);
    };

    // Calcular porcentaje de alumnos calificados
    const calculateGradedPercentage = () => {
        if (grades.length === 0) return '0%';

        const gradedCount = grades.filter(grade => grade.calificacion !== null).length;
        return `${Math.round((gradedCount / grades.length) * 100)}%`;
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
                            onClick={() => navigate('/app/tasks')}
                        >
                            Volver a tareas
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    if (!task || !group) {
        return (
            <Card>
                <CardBody>
                    <VStack spacing={4} py={10}>
                        <Heading size="md">Tarea no encontrada</Heading>
                        <Button
                            colorScheme="brand"
                            leftIcon={<Icon as={FiArrowLeft} />}
                            onClick={() => navigate('/app/tasks')}
                        >
                            Volver a tareas
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
                    icon={<Icon as={FiArrowLeft} />}
                    aria-label="Volver"
                    onClick={() => navigate('/app/tasks')}
                    variant="ghost"
                />
                <Box>
                    <Heading as="h1" size="xl" mb={1}>
                        {task.titulo}
                    </Heading>
                    <HStack>
                        <Badge colorScheme="purple">
                            Grupo: {group.nombre}
                        </Badge>
                        <Badge colorScheme="blue">
                            {grades.length} estudiantes
                        </Badge>
                    </HStack>
                </Box>
            </HStack>

            {/* Detalles de la tarea */}
            <Card mb={6}>
                <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                            {task.descripcion && (
                                <Box mb={4}>
                                    <Text fontWeight="medium" mb={1}>Descripción:</Text>
                                    <Text color="text.secondary">{task.descripcion}</Text>
                                </Box>
                            )}

                            <HStack mb={2}>
                                <Icon as={FiCalendar} color="gray.500" />
                                <Text fontSize="sm" color="text.secondary">
                                    Creada: {formatDate(task.createdAt)}
                                </Text>
                            </HStack>

                            {task.fechaEntrega && (
                                <HStack mb={2}>
                                    <Icon as={FiClock} color="gray.500" />
                                    <Text fontSize="sm" color="text.secondary">
                                        Fecha de entrega: {formatDate(task.fechaEntrega)}
                                    </Text>
                                </HStack>
                            )}
                        </Box>

                        <Box>
                            <VStack
                                align="start"
                                bg="background.secondary"
                                p={4}
                                borderRadius="md"
                                spacing={2}
                            >
                                <Text fontWeight="medium">Estadísticas</Text>
                                <Divider />
                                <HStack justify="space-between" w="full">
                                    <Text color="text.secondary">Promedio de la clase:</Text>
                                    <Badge colorScheme="green" fontSize="md">
                                        {calculateAverage()}
                                    </Badge>
                                </HStack>
                                <HStack justify="space-between" w="full">
                                    <Text color="text.secondary">Estudiantes calificados:</Text>
                                    <Badge colorScheme="blue" fontSize="md">
                                        {calculateGradedPercentage()}
                                    </Badge>
                                </HStack>
                                <HStack justify="space-between" w="full">
                                    <Text color="text.secondary">Estudiantes totales:</Text>
                                    <Text fontWeight="medium">{grades.length}</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* Tabla de calificaciones */}
            <Card>
                <CardBody>
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading size="md">
                            Calificaciones
                        </Heading>
                        <HStack>
                            <Tooltip label="Reiniciar todas las calificaciones">
                                <IconButton
                                    icon={<Icon as={FiRotateCcw} />}
                                    aria-label="Reiniciar calificaciones"
                                    variant="outline"
                                    colorScheme="red"
                                    onClick={() => setShowConfirmReset(true)}
                                />
                            </Tooltip>
                            <Button
                                leftIcon={<Icon as={FiDownload} />}
                                colorScheme="brand"
                                variant="outline"
                                onClick={() => {
                                    toast({
                                        title: 'Función en desarrollo',
                                        description: 'La exportación de calificaciones estará disponible próximamente',
                                        status: 'info',
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                }}
                            >
                                Exportar calificaciones
                            </Button>
                        </HStack>
                    </Flex>

                    {grades.length === 0 ? (
                        <VStack py={10} spacing={4}>
                            <Icon as={FiFilePlus} boxSize={12} color="gray.500" />
                            <Text fontSize="lg" fontWeight="medium">
                                No hay estudiantes en este grupo
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="500px">
                                Este grupo no tiene estudiantes asignados. Agrega estudiantes al grupo para poder calificarlos.
                            </Text>
                        </VStack>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th width="40%">Estudiante</Th>
                                        <Th width="15%">Calificación</Th>
                                        <Th width="35%">Comentarios</Th>
                                        <Th width="10%" textAlign="center">Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {grades.map(grade => (
                                        <Tr key={grade.id}>
                                            <Td>
                                                {grade.estudiante.nombre} {grade.estudiante.apellido}
                                            </Td>
                                            <Td>
                                                {editingGrade === grade.id ? (
                                                    <NumberInput
                                                        size="sm"
                                                        min={0}
                                                        max={10}
                                                        step={0.1}
                                                        value={tempGrade.calificacion}
                                                        onChange={(value) =>
                                                            setTempGrade(prev => ({ ...prev, calificacion: value }))
                                                        }
                                                    >
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                ) : (
                                                    <Text>
                                                        {grade.calificacion !== null
                                                            ? grade.calificacion.toFixed(1)
                                                            : '—'}
                                                    </Text>
                                                )}
                                            </Td>
                                            <Td>
                                                {editingGrade === grade.id ? (
                                                    <Textarea
                                                        size="sm"
                                                        rows={2}
                                                        value={tempGrade.comentario}
                                                        onChange={(e) =>
                                                            setTempGrade(prev => ({ ...prev, comentario: e.target.value }))
                                                        }
                                                        placeholder="Comentario opcional..."
                                                    />
                                                ) : (
                                                    <Text noOfLines={2}>
                                                        {grade.comentario || '—'}
                                                    </Text>
                                                )}
                                            </Td>
                                            <Td textAlign="center">
                                                {editingGrade === grade.id ? (
                                                    <HStack spacing={1} justify="center">
                                                        <IconButton
                                                            icon={<Icon as={FiCheck} />}
                                                            aria-label="Guardar"
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={saveGrade}
                                                            isLoading={isSaving}
                                                        />
                                                        <IconButton
                                                            icon={<Icon as={FiX} />}
                                                            aria-label="Cancelar"
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={cancelEditing}
                                                            isDisabled={isSaving}
                                                        />
                                                    </HStack>
                                                ) : (
                                                    <IconButton
                                                        icon={<Icon as={FiEdit} />}
                                                        aria-label="Editar"
                                                        size="sm"
                                                        colorScheme="brand"
                                                        variant="ghost"
                                                        onClick={() => startEditing(grade)}
                                                    />
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Diálogo de confirmación para reiniciar calificaciones */}
            <AlertDialog
                isOpen={showConfirmReset}
                leastDestructiveRef={cancelRef}
                onClose={() => setShowConfirmReset(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Reiniciar Calificaciones
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de reiniciar todas las calificaciones? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setShowConfirmReset(false)}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={resetAllGrades} ml={3}>
                                Reiniciar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default TaskGrades;