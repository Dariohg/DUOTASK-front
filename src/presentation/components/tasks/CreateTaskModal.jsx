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
    Textarea,
    FormErrorMessage,
    useToast,
    Stack,
    Select,
    Spinner,
    Text,
    Box,
    VStack,
    HStack,
    Icon,
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';
import { FiCalendar, FiInfo } from 'react-icons/fi';

const CreateTaskModal = ({ isOpen, onClose, onCreateTask, groups, preSelectedGroupId = null }) => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        idGrupo: preSelectedGroupId || '',
        fechaEntrega: ''
    });

    // Actualizar cuando cambia el preSelectedGroupId
    useEffect(() => {
        if (preSelectedGroupId) {
            setFormData(prev => ({
                ...prev,
                idGrupo: preSelectedGroupId
            }));
        }
    }, [preSelectedGroupId]);

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

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título de la tarea es requerido';
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
            // Call the passed function to create the task
            await onCreateTask(formData);

            // Reset form and close modal on success
            setFormData({
                titulo: '',
                descripcion: '',
                idGrupo: preSelectedGroupId || '',
                fechaEntrega: ''
            });

            toast({
                title: 'Tarea creada',
                description: 'La tarea se ha creado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Error al crear la tarea',
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
            titulo: '',
            descripcion: '',
            idGrupo: preSelectedGroupId || '',
            fechaEntrega: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                <ModalHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    Crear Nueva Tarea
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody py={4}>
                    {!groups || groups.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Text mb={4}>No hay grupos disponibles para crear tareas.</Text>
                            <Text>Por favor, cree un grupo primero.</Text>
                        </Box>
                    ) : (
                        <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.titulo} isRequired>
                                <FormLabel htmlFor="titulo">Título de la tarea</FormLabel>
                                <Input
                                    id="titulo"
                                    placeholder="Ej. Ejercicios de matemáticas"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.titulo}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                                <Textarea
                                    id="descripcion"
                                    placeholder="Descripción detallada de la tarea..."
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </FormControl>

                            {!preSelectedGroupId ? (
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
                            ) : (
                                <FormControl>
                                    <FormLabel htmlFor="idGrupo">Grupo</FormLabel>
                                    <Input
                                        value={groups.find(g => g.id === preSelectedGroupId)?.nombre || 'Grupo seleccionado'}
                                        isReadOnly
                                        bg="background.tertiary"
                                    />
                                </FormControl>
                            )}

                            <FormControl>
                                <FormLabel htmlFor="fechaEntrega">Fecha de entrega</FormLabel>
                                <Input
                                    id="fechaEntrega"
                                    type="date"
                                    value={formData.fechaEntrega}
                                    onChange={handleChange}
                                />
                                <Text fontSize="xs" color="text.secondary" mt={1}>
                                    <Icon as={FiInfo} mr={1} />
                                    Opcional. Si no se especifica, la tarea no tendrá fecha límite.
                                </Text>
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
                        isDisabled={!groups || groups.length === 0}
                    >
                        Crear Tarea
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTaskModal;