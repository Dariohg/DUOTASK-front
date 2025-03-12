import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    useToast,
    Stack,
    Select,
    Spinner,
    Text,
    Box,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import groupService from '../../../services/api/groupService';

/**
 * Modal component for creating a new student
 */
const CreateStudentModal = ({ isOpen, onClose, onCreateStudent }) => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [groups, setGroups] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        idGrupo: ''
    });

    // Cargar grupos al abrir el modal
    useEffect(() => {
        if (isOpen) {
            fetchGroups();
        }
    }, [isOpen]);

    // Función para obtener los grupos
    const fetchGroups = async () => {
        setIsLoadingGroups(true);
        try {
            const fetchedGroups = await groupService.getGroups();
            setGroups(fetchedGroups);

            // Si solo hay un grupo, seleccionarlo automáticamente
            if (fetchedGroups.length === 1) {
                setFormData(prev => ({
                    ...prev,
                    idGrupo: fetchedGroups[0].id
                }));
            }
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

    // Handle form field changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del estudiante es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido del estudiante es requerido';
        }

        if (!formData.idGrupo) {
            newErrors.idGrupo = 'Debe seleccionar un grupo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Call the passed function to create the student
            await onCreateStudent(formData);

            // Reset form and close modal on success
            setFormData({
                nombre: '',
                apellido: '',
                idGrupo: ''
            });

            toast({
                title: 'Estudiante creado',
                description: 'El estudiante se ha creado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Error al crear el estudiante',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal closes
    const handleCloseModal = () => {
        setFormData({
            nombre: '',
            apellido: '',
            idGrupo: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                <ModalHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    Agregar Nuevo Estudiante
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody py={4}>
                    {isLoadingGroups ? (
                        <Box textAlign="center" py={8}>
                            <Spinner size="lg" mb={4} color="brand.500" />
                            <Text>Cargando grupos...</Text>
                        </Box>
                    ) : groups.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Text mb={4}>No hay grupos disponibles para agregar estudiantes.</Text>
                            <Text>Por favor, cree un grupo primero.</Text>
                        </Box>
                    ) : (
                        <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.nombre} isRequired>
                                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                <Input
                                    id="nombre"
                                    placeholder="Ej. Juan"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.apellido} isRequired>
                                <FormLabel htmlFor="apellido">Apellido</FormLabel>
                                <Input
                                    id="apellido"
                                    placeholder="Ej. Pérez"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.apellido}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.idGrupo} isRequired>
                                <FormLabel htmlFor="idGrupo">Grupo</FormLabel>
                                <Select
                                    id="idGrupo"
                                    placeholder="Selecciona un grupo"
                                    value={formData.idGrupo}
                                    onChange={handleChange}
                                >
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.nombre} (Grado {group.grado})
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.idGrupo}</FormErrorMessage>
                            </FormControl>
                        </Stack>
                    )}
                </ModalBody>

                <ModalFooter borderTopWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    <Button variant="outline" mr={3} onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        loadingText="Creando..."
                        isDisabled={isLoadingGroups || groups.length === 0}
                    >
                        Agregar Estudiante
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateStudentModal;