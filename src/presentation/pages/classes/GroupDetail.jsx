// Crear src/presentation/pages/classes/GroupDetail.jsx
import { useState, useEffect } from 'react';
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
    Badge,
    Card,
    CardBody,
    HStack,
    VStack,
    Spinner,
    useToast,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiUserPlus,
    FiEdit2,
    FiTrash2,
    FiMoreVertical,
    FiUsers,
} from 'react-icons/fi';
import ClassService from '../../../services/ClassService';
import studentService from '../../../services/api/studentService';
import CreateStudentModal from '../../components/students/CreateStudentModal';

const GroupDetail = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [group, setGroup] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Modal para agregar estudiantes
    const {
        isOpen: isAddStudentOpen,
        onOpen: openAddStudent,
        onClose: closeAddStudent
    } = useDisclosure();

    // Dialog para confirmar eliminación
    const {
        isOpen: isDeleteAlertOpen,
        onOpen: openDeleteAlert,
        onClose: closeDeleteAlert
    } = useDisclosure();

    // Obtener datos del grupo y sus estudiantes
    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const fetchGroupData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Obtener datos del grupo
            const groupData = await ClassService.getGroupById(groupId);
            setGroup(groupData);

            // Obtener estudiantes del grupo
            const groupStudents = await studentService.getStudentsByGroup(groupId);
            setStudents(groupStudents);
        } catch (err) {
            console.error('Error al cargar datos del grupo:', err);
            setError('No se pudo cargar la información del grupo');
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información del grupo',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar la creación de un nuevo estudiante
    const handleCreateStudent = async (studentData) => {
        try {
            // Asegurar que el estudiante pertenezca a este grupo
            const newStudentData = {
                ...studentData,
                idGrupo: groupId,
            };

            // Crear el estudiante
            const newStudent = await studentService.createStudent(newStudentData);

            // Actualizar la lista de estudiantes
            setStudents(prev => [...prev, newStudent]);

            toast({
                title: 'Estudiante agregado',
                description: `${newStudentData.nombre} ${newStudentData.apellido} ha sido agregado al grupo`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            return newStudent;
        } catch (error) {
            console.error('Error al agregar estudiante:', error);
            throw error;
        }
    };

    // Preparar para eliminar un estudiante
    const handleDeleteStudent = (student) => {
        setStudentToDelete(student);
        openDeleteAlert();
    };

    // Confirmar eliminación de estudiante
    const confirmDeleteStudent = async () => {
        if (!studentToDelete) return;

        try {
            await studentService.deleteStudent(studentToDelete.id);

            // Actualizar la lista de estudiantes
            setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));

            toast({
                title: 'Estudiante eliminado',
                description: `${studentToDelete.nombre} ${studentToDelete.apellido} ha sido eliminado del grupo`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            toast({
                title: 'Error',
                description: 'No se pudo eliminar al estudiante',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setStudentToDelete(null);
            closeDeleteAlert();
        }
    };

    // Manejar la edición de un estudiante (se implementará en otro componente)
    const handleEditStudent = (student) => {
        // Aquí se implementaría la navegación a la edición de estudiante
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
                            leftIcon={<FiArrowLeft />}
                            onClick={() => navigate('/app/classes')}
                        >
                            Volver a grupos
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        );
    }

    if (!group) {
        return (
            <Card>
                <CardBody>
                    <VStack spacing={4} py={10}>
                        <Heading size="md">Grupo no encontrado</Heading>
                        <Button
                            colorScheme="brand"
                            leftIcon={<FiArrowLeft />}
                            onClick={() => navigate('/app/classes')}
                        >
                            Volver a grupos
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
                    onClick={() => navigate('/app/classes')}
                    variant="ghost"
                />
                <Box>
                    <Heading as="h1" size="xl" mb={1}>
                        Grupo: {group.nombre}
                    </Heading>
                    <HStack>
                        <Badge colorScheme="purple" fontSize="sm">Grado {group.grado}</Badge>
                        <Badge colorScheme="blue" fontSize="sm">{students.length} estudiantes</Badge>
                    </HStack>
                </Box>
            </HStack>

            {/* Descripción del grupo si existe */}
            {group.descripcion && (
                <Card mb={6}>
                    <CardBody>
                        <Text>{group.descripcion}</Text>
                    </CardBody>
                </Card>
            )}

            {/* Sección de estudiantes */}
            <Card>
                <CardBody>
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading size="md">
                            Estudiantes
                        </Heading>
                        <Button
                            leftIcon={<FiUserPlus />}
                            colorScheme="brand"
                            onClick={openAddStudent}
                        >
                            Agregar Estudiante
                        </Button>
                    </Flex>

                    {students.length === 0 ? (
                        <VStack py={10} spacing={4}>
                            <Icon as={FiUsers} boxSize={12} color="gray.500" />
                            <Text fontSize="lg" fontWeight="medium">
                                No hay estudiantes en este grupo
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="500px">
                                Comienza agregando estudiantes a este grupo para gestionarlos
                            </Text>
                            <Button
                                leftIcon={<FiUserPlus />}
                                colorScheme="brand"
                                onClick={openAddStudent}
                            >
                                Agregar Primer Estudiante
                            </Button>
                        </VStack>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Nombre</Th>
                                        <Th>Apellido</Th>
                                        <Th width="100px" textAlign="center">Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {students.map(student => (
                                        <Tr key={student.id}>
                                            <Td>{student.nombre}</Td>
                                            <Td>{student.apellido}</Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        icon={<FiMoreVertical />}
                                                        variant="ghost"
                                                        size="sm"
                                                    />
                                                    <MenuList>
                                                        <MenuItem
                                                            icon={<FiEdit2 />}
                                                            onClick={() => handleEditStudent(student)}
                                                        >
                                                            Editar
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<FiTrash2 />}
                                                            color="red.500"
                                                            onClick={() => handleDeleteStudent(student)}
                                                        >
                                                            Eliminar
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Modal para agregar estudiante */}
            <CreateStudentModal
                isOpen={isAddStudentOpen}
                onClose={closeAddStudent}
                onCreateStudent={handleCreateStudent}
                preSelectedGroupId={groupId}
            />

            {/* Alerta de confirmación para eliminar estudiante */}
            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={undefined}
                onClose={closeDeleteAlert}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="background.card">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Estudiante
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {studentToDelete && (
                                <Text>
                                    ¿Estás seguro de eliminar a {studentToDelete.nombre} {studentToDelete.apellido} del grupo?
                                    Esta acción no se puede deshacer.
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
                                onClick={confirmDeleteStudent}
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

export default GroupDetail;