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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
    useToast,
    Stack
} from '@chakra-ui/react';
import { useState } from 'react';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nombre: '',
        grado: 1,
        descripcion: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleGradoChange = (value) => {
        setFormData(prev => ({
            ...prev,
            grado: parseInt(value, 10)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del grupo es requerido';
        }

        if (formData.grado < 1 || formData.grado > 12) {
            newErrors.grado = 'El grado debe estar entre 1 y 12';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Call the passed function to create the group
            await onCreateGroup(formData);

            // Reset form and close modal on success
            setFormData({
                nombre: '',
                grado: 1,
                descripcion: ''
            });

            toast({
                title: 'Grupo creado',
                description: 'El grupo se ha creado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Error al crear el grupo',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            nombre: '',
            grado: 1,
            descripcion: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                <ModalHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    Crear Nuevo Grupo
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody py={4}>
                    <Stack spacing={4}>
                        <FormControl isInvalid={!!errors.nombre} isRequired>
                            <FormLabel htmlFor="nombre">Nombre del Grupo</FormLabel>
                            <Input
                                id="nombre"
                                placeholder="Ej. 1A, 2B, 3C"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.grado} isRequired>
                            <FormLabel htmlFor="grado">Grado</FormLabel>
                            <NumberInput
                                min={1}
                                max={12}
                                value={formData.grado}
                                onChange={handleGradoChange}
                            >
                                <NumberInputField id="grado" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>{errors.grado}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                            <Textarea
                                id="descripcion"
                                placeholder="Descripción opcional del grupo"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={3}
                            />
                        </FormControl>
                    </Stack>
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
                    >
                        Crear Grupo
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateGroupModal;