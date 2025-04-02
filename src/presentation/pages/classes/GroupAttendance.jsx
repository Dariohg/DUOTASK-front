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
    Select,
    FormControl,
    Input,
} from '@chakra-ui/react';
import { FiArrowLeft, FiSave, FiCalendar } from 'react-icons/fi';
import ClassService from '../../../services/ClassService';
import studentService from '../../../services/api/studentService';
import attendanceService from '../../../services/api/attendanceService'; // Asegúrate de importar el servicio

const GroupAttendance = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [group, setGroup] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Opciones de asistencia
    const attendanceOptions = [
        { value: 'asistencia', label: 'A', color: 'green' },
        { value: 'falta', label: 'F', color: 'red' },
        { value: 'permiso', label: 'P', color: 'yellow' }
    ];

    // Cargar datos del grupo y estudiantes
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

            // Inicializar datos de asistencia (todos como presentes por defecto)
            const initialAttendance = {};
            groupStudents.forEach(student => {
                initialAttendance[student.id] = 'asistencia';
            });
            setAttendanceData(initialAttendance);
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

    // Cambiar el estado de asistencia de un estudiante
    const handleAttendanceChange = (studentId, value) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    // Guardar asistencia
    const saveAttendance = async () => {
        setIsSaving(true);

        try {
            // Preparar los datos para enviar al backend
            const attendancePayload = {
                idGrupo: groupId,
                fecha: date,
                asistencias: Object.entries(attendanceData).map(([idAlumno, asistencia]) => ({
                    idAlumno,
                    asistencia
                }))
            };

            // Llamar al servicio de creación de asistencia
            await Promise.all(attendancePayload.asistencias.map(attendance =>
                attendanceService.createOrUpdateAttendance(groupId, attendance.idAlumno, attendance.asistencia, date)
            ));

            toast({
                title: 'Asistencia guardada',
                description: 'La asistencia se ha registrado correctamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Opcionalmente, volver a la página de detalle del grupo
            // navigate(`/app/classes/${groupId}`);
        } catch (error) {
            console.error('Error al guardar asistencia:', error);
            toast({
                title: 'Error',
                description: 'No se pudo guardar la asistencia',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Obtener color según el estado de asistencia
    const getAttendanceColor = (value) => {
        const option = attendanceOptions.find(opt => opt.value === value);
        return option ? option.color : 'gray';
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
                            onClick={() => navigate(`/app/classes/${groupId}`)}
                        >
                            Volver al grupo
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
                    onClick={() => navigate(`/app/classes/${groupId}`)}
                    variant="ghost"
                />
                <Box>
                    <Heading as="h1" size="xl" mb={1}>
                        Asistencia: {group.nombre}
                    </Heading>
                    <HStack>
                        <Badge colorScheme="purple" fontSize="sm">Grado {group.grado}</Badge>
                        <Badge colorScheme="blue" fontSize="sm">{students.length} estudiantes</Badge>
                    </HStack>
                </Box>
            </HStack>

            {/* Selector de fecha */}
            <Card mb={6}>
                <CardBody>
                    <Flex justify="space-between" align="center">
                        <HStack>
                            <IconButton
                                icon={<FiCalendar />}
                                aria-label="Seleccionar fecha"
                                variant="ghost"
                            />
                            <FormControl maxW="200px">
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </FormControl>
                        </HStack>
                        <Button
                            colorScheme="brand"
                            leftIcon={<FiSave />}
                            onClick={saveAttendance}
                            isLoading={isSaving}
                            loadingText="Guardando..."
                        >
                            Guardar Asistencia
                        </Button>
                    </Flex>
                </CardBody>
            </Card>

            {/* Tabla de asistencia */}
            <Card>
                <CardBody>
                    <Heading size="md" mb={6}>
                        Registro de Asistencia
                    </Heading>

                    {students.length === 0 ? (
                        <VStack py={10} spacing={4}>
                            <Text fontSize="lg" fontWeight="medium">
                                No hay estudiantes en este grupo
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="500px">
                                Agrega estudiantes al grupo para poder registrar asistencia
                            </Text>
                            <Button
                                colorScheme="brand"
                                onClick={() => navigate(`/app/classes/${groupId}`)}
                            >
                                Volver al grupo
                            </Button>
                        </VStack>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Nombre</Th>
                                        <Th>Apellido</Th>
                                        <Th width="150px" textAlign="center">Asistencia</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {students.map(student => (
                                        <Tr key={student.id}>
                                            <Td>{student.nombre}</Td>
                                            <Td>{student.apellido}</Td>
                                            <Td>
                                                <Flex justify="center">
                                                    <Select
                                                        value={attendanceData[student.id] || 'asistencia'}
                                                        onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                                                        size="sm"
                                                        width="100px"
                                                        textAlign="center"
                                                        bg={`${getAttendanceColor(attendanceData[student.id])}.100`}
                                                        color={`${getAttendanceColor(attendanceData[student.id])}.700`}
                                                        fontWeight="bold"
                                                    >
                                                        {attendanceOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Botón flotante para guardar */}
            <Button
                position="fixed"
                bottom="24px"
                right="24px"
                colorScheme="brand"
                size="lg"
                boxShadow="lg"
                leftIcon={<FiSave />}
                onClick={saveAttendance}
                isLoading={isSaving}
                loadingText="Guardando..."
            >
                Guardar Asistencia
            </Button>
        </Box>
    );
};

export default GroupAttendance;
