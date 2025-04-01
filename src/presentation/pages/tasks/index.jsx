import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Spinner,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Divider,
    Select,
    InputGroup,
    Input,
    InputLeftElement,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiClock,
    FiAlertCircle,
    FiFileText,
    FiCalendar,
    FiBarChart2,
} from 'react-icons/fi';
import groupService from '../../../services/api/groupService';
import taskService from '../../../services/api/taskService';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';

const TasksPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [stats, setStats] = useState(null);

    // Modales y diálogos
    const {
        isOpen: isCreateTaskOpen,
        onOpen: openCreateTask,
        onClose: closeCreateTask
    } = useDisclosure();

    const {
        isOpen: isDeleteAlertOpen,
        onOpen: openDeleteAlert,
        onClose: closeDeleteAlert
    } = useDisclosure();

    // Cargar datos iniciales
    useEffect(() => {
        fetchGroups();
        fetchTasks();
    }, []);

    // Filtrar tareas cuando cambian los filtros
    useEffect(() => {
        filterTasks();
    }, [tasks, selectedGroup, searchTerm, statusFilter]);

    // Función para obtener grupos
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

    // Función para obtener tareas
    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const fetchedTasks = await taskService.getTasks();
            setTasks(fetchedTasks);

            // Obtener estadísticas
            const taskStats = await taskService.getTaskStats();
            setStats(taskStats);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las tareas',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Función para filtrar tareas según criterios
    const filterTasks = () => {
        let filtered = [...tasks];

        // Filtrar por grupo
        if (selectedGroup) {
            filtered = filtered.filter(task => task.idGrupo === selectedGroup);
        }

        // Filtrar por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.titulo.toLowerCase().includes(term) ||
                (task.descripcion && task.descripcion.toLowerCase().includes(term))
            );
        }

        // Filtrar por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Ordenar por fecha (más recientes primero)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilteredTasks(filtered);
    };

    // Función para crear una nueva tarea
    const handleCreateTask = async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);

            // Actualizar lista de tareas
            setTasks(prevTasks => [...prevTasks, newTask]);

            toast({
                title: 'Tarea creada',
                description: 'La tarea se ha creado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Actualizar estadísticas
            const taskStats = await taskService.getTaskStats();
            setStats(taskStats);

            return newTask;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            toast({
                title: 'Error',
                description: error.message || 'Error al crear la tarea',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            throw error;
        }
    };

    // Función para eliminar una tarea
    const handleDeleteTask = (task) => {
        setTaskToDelete(task);
        openDeleteAlert();
    };

    // Confirmar eliminación de tarea
    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            await taskService.deleteTask(taskToDelete.id);

            // Actualizar lista de tareas
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDelete.id));

            toast({
                title: 'Tarea eliminada',
                description: 'La tarea ha sido eliminada exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Actualizar estadísticas
            const taskStats = await taskService.getTaskStats();
            setStats(taskStats);
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            toast({
                title: 'Error',
                description: 'No se pudo eliminar la tarea',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setTaskToDelete(null);
            closeDeleteAlert();
        }
    };

    // Función para navegar a la vista de calificaciones
    const navigateToGrades = (taskId) => {
        navigate(`/app/tasks/${taskId}/grades`);
    };

    // Función para mostrar la fecha en formato legible
    const formatDate = (dateString) => {
        try {
            return format(parseISO(dateString), "d 'de' MMMM, yyyy", { locale: es });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    // Función para obtener el color según el estado de la tarea
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

    // Función para obtener el texto del estado de la tarea
    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Activa';
            case 'completed':
                return 'Completada';
            case 'archived':
                return 'Archivada';
            default:
                return 'Desconocido';
        }
    };

    // Función para limpiar filtros
    const clearFilters = () => {
        setSelectedGroup('');
        setSearchTerm('');
        setStatusFilter('all');
    };

    return (
        <Box p={4}>
            <Flex direction="column" mb={6}>
                <Heading as="h1" size="xl" mb={2}>
                    Tareas y Calificaciones
                </Heading>
                <Text color="text.secondary">
                    Gestiona las tareas y calificaciones de tus grupos
                </Text>
            </Flex>

            {/* Tarjetas de estadísticas */}
            {stats && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
                    <Card bg="background.card">
                        <CardBody>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" spacing={0}>
                                    <Text color="text.secondary" fontSize="sm">Total de Tareas</Text>
                                    <Heading size="xl">{stats.taskCount}</Heading>
                                </VStack>
                                <Box
                                    p={2}
                                    bg="blue.500"
                                    color="white"
                                    borderRadius="lg"
                                >
                                    <Icon as={FiFileText} boxSize={6} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Card bg="background.card">
                        <CardBody>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" spacing={0}>
                                    <Text color="text.secondary" fontSize="sm">Tareas Activas</Text>
                                    <Heading size="xl">{stats.taskCount - stats.completedTasks}</Heading>
                                    <Text color="blue.400" fontSize="sm">
                                        {stats.activeTasksPercent}% del total
                                    </Text>
                                </VStack>
                                <Box
                                    p={2}
                                    bg="green.500"
                                    color="white"
                                    borderRadius="lg"
                                >
                                    <Icon as={FiCheck} boxSize={6} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Card bg="background.card">
                        <CardBody>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" spacing={0}>
                                    <Text color="text.secondary" fontSize="sm">Calificaciones Asignadas</Text>
                                    <Heading size="xl">{stats.gradesAssigned}</Heading>
                                    <Text color="green.400" fontSize="sm">
                                        {stats.gradesAssignedPercent}% completado
                                    </Text>
                                </VStack>
                                <Box
                                    p={2}
                                    bg="purple.500"
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
                                    <Text color="text.secondary" fontSize="sm">Calificaciones Pendientes</Text>
                                    <Heading size="xl">{stats.gradesPending}</Heading>
                                </VStack>
                                <Box
                                    p={2}
                                    bg="orange.500"
                                    color="white"
                                    borderRadius="lg"
                                >
                                    <Icon as={FiClock} boxSize={6} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            )}

            {/* Barra de herramientas */}
            <Flex
                bg="background.card"
                p={4}
                borderRadius="lg"
                mb={6}
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
                justify="space-between"
                gap={4}
            >
                <InputGroup maxW={{ base: "100%", md: "320px" }}>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar tareas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

                <HStack spacing={4}>
                    <Select
                        placeholder="Filtrar por grupo"
                        maxW="200px"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        isDisabled={isLoadingGroups}
                    >
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.nombre}
                            </option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Estado"
                        maxW="150px"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activas</option>
                        <option value="completed">Completadas</option>
                        <option value="archived">Archivadas</option>
                    </Select>

                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        isDisabled={!searchTerm && !selectedGroup && statusFilter === 'all'}
                    >
                        Limpiar
                    </Button>

                    <Button
                        colorScheme="brand"
                        leftIcon={<Icon as={FiPlus} />}
                        onClick={openCreateTask}
                    >
                        Nueva Tarea
                    </Button>
                </HStack>
            </Flex>

            {/* Lista de tareas */}
            {isLoading ? (
                <Flex justify="center" align="center" py={12}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Flex>
            ) : filteredTasks.length === 0 ? (
                <Card>
                    <CardBody>
                        <VStack spacing={4} align="center" py={12}>
                            <Icon as={FiFileText} boxSize={12} color="gray.500" />
                            <Text fontSize="lg" fontWeight="medium">
                                {tasks.length === 0
                                    ? "No has creado ninguna tarea todavía"
                                    : "No se encontraron tareas con los filtros aplicados"}
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="600px">
                                {tasks.length === 0
                                    ? "Crea tu primera tarea para comenzar a gestionar las calificaciones de tus estudiantes"
                                    : "Intenta cambiar tus criterios de búsqueda o eliminar los filtros"}
                            </Text>
                            <Button
                                colorScheme="brand"
                                leftIcon={<Icon as={FiPlus} />}
                                onClick={tasks.length === 0 ? openCreateTask : clearFilters}
                            >
                                {tasks.length === 0 ? "Crear tu primera tarea" : "Limpiar filtros"}
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredTasks.map(task => {
                        // Encontrar el grupo al que pertenece la tarea
                        const group = groups.find(g => g.id === task.idGrupo);

                        return (
                            <Card
                                key={task.id}
                                bg="background.card"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    boxShadow: "md",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <CardBody>
                                    <Flex justify="space-between" align="flex-start" mb={3}>
                                        <Badge colorScheme={getStatusColor(task.status)} mb={2}>
                                            {getStatusText(task.status)}
                                        </Badge>

                                        <Menu>
                                            <MenuButton
                                                as={Button}
                                                variant="ghost"
                                                size="sm"
                                                aria-label="Opciones"
                                            >
                                                <Icon as={FiMoreVertical} />
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem
                                                    icon={<Icon as={FiBarChart2} />}
                                                    onClick={() => navigateToGrades(task.id)}
                                                >
                                                    Ver calificaciones
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<Icon as={FiEdit2} />}
                                                    onClick={() => navigate(`/app/tasks/${task.id}/edit`)}
                                                >
                                                    Editar tarea
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem
                                                    icon={<Icon as={FiTrash2} />}
                                                    color="red.500"
                                                    onClick={() => handleDeleteTask(task)}
                                                >
                                                    Eliminar tarea
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>

                                    <Heading size="md" mb={2} cursor="pointer" onClick={() => navigateToGrades(task.id)}>
                                        {task.titulo}
                                    </Heading>

                                    {task.descripcion && (
                                        <Text color="text.secondary" fontSize="sm" mb={3} noOfLines={2}>
                                            {task.descripcion}
                                        </Text>
                                    )}

                                    <HStack mb={3}>
                                        <Icon as={FiCalendar} color="gray.500" />
                                        <Text fontSize="sm" color="text.secondary">
                                            Creada: {formatDate(task.createdAt)}
                                        </Text>
                                    </HStack>

                                    {task.fechaEntrega && (
                                        <HStack mb={3}>
                                            <Icon as={FiClock} color={new Date(task.fechaEntrega) < new Date() ? "red.500" : "gray.500"} />
                                            <Text fontSize="sm" color={new Date(task.fechaEntrega) < new Date() ? "red.500" : "text.secondary"}>
                                                Entrega: {formatDate(task.fechaEntrega)}
                                            </Text>
                                        </HStack>
                                    )}

                                    {group && (
                                        <Badge colorScheme="purple" mt={1}>
                                            Grupo: {group.nombre}
                                        </Badge>
                                    )}

                                    <Button
                                        mt={4}
                                        size="sm"
                                        width="full"
                                        colorScheme="brand"
                                        variant="outline"
                                        leftIcon={<Icon as={FiBarChart2} />}
                                        onClick={() => navigateToGrades(task.id)}
                                    >
                                        Ver calificaciones
                                    </Button>
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}

            {/* Modal para crear tarea */}
            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={closeCreateTask}
                onCreateTask={handleCreateTask}
                groups={groups}
            />

            {/* Alerta de confirmación para eliminar tarea */}
            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={undefined}
                onClose={closeDeleteAlert}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="background.card">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Tarea
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {taskToDelete && (
                                <Text>
                                    ¿Estás seguro de eliminar la tarea "{taskToDelete.titulo}"?
                                    Esta acción también eliminará todas las calificaciones asociadas y no se puede deshacer.
                                </Text>
                            )}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={closeDeleteAlert}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={confirmDeleteTask}
                            >
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default TasksPage;