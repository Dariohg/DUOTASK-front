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
    Select,
    Textarea,
    Badge,
    Spinner,
    useToast,
    Icon,
    HStack,
    VStack,
    Divider
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit, FiCheck, FiX, FiCalendar } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import attendanceService from '../../../services/api/attendanceService'; // Servicio que gestionará la asistencia
import studentService from '../../../services/api/studentService';

const StudentDetails = () => {
    const { groupId, studentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [studentName, setStudentName] = useState([]);

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [monthFilter, setMonthFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAttendanceData();
    }, [groupId, studentId, monthFilter]);

    const fetchAttendanceData = async () => {
        setIsLoading(true);
        try {
            const data = await studentService.getStudentById(studentId);
            
            console.log("🔍 Fetching attendance with groupId:", groupId, "studentId:", studentId);
            const response = await attendanceService.getAttendancesByStudent(groupId, studentId, monthFilter);
            
            console.log("✅ Asistencias recibidas:", response);
            
            setStudentName(data);
            setAttendanceRecords(response);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo cargar la asistencia del estudiante.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (record) => {
        setEditingRecord(record.id);
    };

    const saveRecord = async (recordId, status) => {
        setIsSaving(true);
        try {
            const updatedRecord = await attendanceService.updateAttendance(recordId, { status });
            setAttendanceRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === recordId ? { ...record, status: updatedRecord.status } : record
                )
            );
            toast({
                title: 'Asistencia actualizada',
                description: 'El registro de asistencia ha sido actualizado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el registro de asistencia.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
            setEditingRecord(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        try {
            return format(parseISO(dateString), "d 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha no disponible';
        }
    };

    if (isLoading) {
        return (
            <Flex h="300px" align="center" justify="center">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Box p={4}>
            <HStack mb={6} spacing={4}>
                <IconButton
                    icon={<Icon as={FiArrowLeft} />}
                    aria-label="Volver"
                    onClick={() => navigate('/app/attendance')}
                    variant="ghost"
                />
                <Box>
                    <Heading as="h1" size="xl" mb={1}>
                        Asistencia del alumno {studentName.nombre} {studentName.apellido}
                    </Heading>
                </Box>
            </HStack>

            {/* Filtro por mes */}
            <Box mb={6}>
                <Select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} maxW="200px">
                    <option value="all">Todo</option>
                    <option value="01">Enero</option>
                    <option value="02">Febrero</option>
                    <option value="03">Marzo</option>
                    <option value="04">Abril</option>
                    <option value="05">Mayo</option>
                    <option value="06">Junio</option>
                    <option value="07">Julio</option>
                    <option value="08">Agosto</option>
                    <option value="09">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Select>
            </Box>

            {/* Tabla de asistencia */}
            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Fecha</Th>
                            <Th>Asistencia</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
    {attendanceRecords.length === 0 ? (
        <Tr>
            <Td colSpan={3} textAlign="center">No se encontraron registros</Td>
        </Tr>
    ) : (
        attendanceRecords.map(record => (
            <Tr key={record.id}>
                <Td>{formatDate(record.fecha)}</Td>
                <Td>
                    {editingRecord === record.id ? (
                        <HStack spacing={2}>
                            <Button size="sm" colorScheme="green" onClick={() => saveRecord(record.id, 'asistencia')}>Presente</Button>
                            <Button size="sm" colorScheme="red" onClick={() => saveRecord(record.id, 'falta')}>Ausente</Button>
                            <Button size="sm" colorScheme="yellow" onClick={() => saveRecord(record.id, 'permiso')}>Permiso</Button>
                        </HStack>
                    ) : (
                        <Text>
                            {record.asistencia === 'asistencia' ? 'Presente' :
                             record.asistencia === 'falta' ? 'Ausente' :
                             record.asistencia === 'permiso' ? 'Permiso' : 'Desconocido'}
                        </Text>
                    )}
                </Td>
                <Td>
                    {editingRecord === record.id ? (
                        <HStack spacing={1} justify="center">
                            <IconButton
                                icon={<Icon as={FiCheck} />}
                                aria-label="Guardar"
                                size="sm"
                                colorScheme="green"
                                onClick={() => saveRecord(record.id, record.asistencia)}
                                isLoading={isSaving}
                            />
                            <IconButton
                                icon={<Icon as={FiX} />}
                                aria-label="Cancelar"
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => setEditingRecord(null)}
                            />
                        </HStack>
                    ) : (
                        <IconButton
                            icon={<Icon as={FiEdit} />}
                            aria-label="Editar"
                            size="sm"
                            colorScheme="brand"
                            variant="ghost"
                            onClick={() => startEditing(record)}
                        />
                    )}
                </Td>
            </Tr>
        ))
    )}
</Tbody>

                </Table>
            </Box>
        </Box>
    );
};

export default StudentDetails;
