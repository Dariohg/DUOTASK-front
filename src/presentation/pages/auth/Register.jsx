import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    InputGroup,
    InputRightElement,
    IconButton,
    FormErrorMessage,
    Alert,
    AlertIcon,
    ScaleFade,
    useBreakpointValue,
    Divider,
    Link,
    Grid,
    GridItem,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../../services/api/registrationService';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        username: '',
        password: '',
        confirmPassword: '',
        correoElectronico: '',
        numeroTelefono: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();
    const { register } = useAuth();

    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    // Manejador para los cambios en los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Validar el formulario
    const validateForm = () => {
        const errors = {};

        if (!formData.nombre) {
            errors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido) {
            errors.apellido = 'El apellido es requerido';
        }

        if (!formData.username) {
            errors.username = 'El nombre de usuario es requerido';
        }

        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.correoElectronico) {
            errors.correoElectronico = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
            errors.correoElectronico = 'El correo electrónico no es válido';
        }

        if (!formData.numeroTelefono) {
            errors.numeroTelefono = 'El número de teléfono es requerido';
        } else if (!/^\d+$/.test(formData.numeroTelefono)) {
            errors.numeroTelefono = 'Ingresa solo números';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        setIsLoading(true);
        setError('');
    
        try {
            // Intentar registrar el usuario en localStorage
            const result = registerUser({
                nombre: formData.nombre,
                apellido: formData.apellido,
                username: formData.username,
                password: formData.password,
                correoElectronico: formData.correoElectronico,
                numeroTelefono: formData.numeroTelefono,
            });
    
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Ocurrió un error durante el registro');
            console.error('Register error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="background.primary">
            <Flex
                minH="100vh"
                align="center"
                justify="center"
                p={4}
            >
                <ScaleFade initialScale={0.9} in={true}>
                    <Box
                        bg="background.card"
                        p={8}
                        borderRadius="xl"
                        boxShadow="md"
                        w={{ base: "full", sm: "550px", md: "650px" }}
                        maxW="100%"
                        borderWidth="1px"
                        borderColor="rgba(255, 255, 255, 0.05)"
                    >
                        <HStack mb={6} spacing={4}>
                            <IconButton
                                icon={<FiArrowLeft />}
                                aria-label="Volver"
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/login')}
                            />
                            <Stack spacing={0}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    bgGradient="linear(to-r, brand.500, accent.500)"
                                    bgClip="text"
                                >
                                    DUOTASK
                                </Text>
                                <Heading as="h1" size="md">
                                    Crear cuenta
                                </Heading>
                            </Stack>
                        </HStack>

                        {error && (
                            <Alert status="error" borderRadius="md" variant="subtle" mb={6}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6}>
                                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} w="full">
                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.nombre}>
                                            <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                            <Input
                                                id="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Tu nombre"
                                            />
                                            <FormErrorMessage>{formErrors.nombre}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.apellido}>
                                            <FormLabel htmlFor="apellido">Apellido</FormLabel>
                                            <Input
                                                id="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                placeholder="Tu apellido"
                                            />
                                            <FormErrorMessage>{formErrors.apellido}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.username}>
                                            <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                                            <Input
                                                id="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="ej. usuario123"
                                            />
                                            <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.correoElectronico}>
                                            <FormLabel htmlFor="correoElectronico">Correo electrónico</FormLabel>
                                            <Input
                                                id="correoElectronico"
                                                type="email"
                                                value={formData.correoElectronico}
                                                onChange={handleChange}
                                                placeholder="tu@correo.com"
                                            />
                                            <FormErrorMessage>{formErrors.correoElectronico}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.password}>
                                            <FormLabel htmlFor="password">Contraseña</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Crea una contraseña"
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isInvalid={!!formErrors.confirmPassword}>
                                            <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Confirma tu contraseña"
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem colSpan={{ base: 1, md: 2 }}>
                                        <FormControl isInvalid={!!formErrors.numeroTelefono}>
                                            <FormLabel htmlFor="numeroTelefono">Número de teléfono</FormLabel>
                                            <Input
                                                id="numeroTelefono"
                                                value={formData.numeroTelefono}
                                                onChange={handleChange}
                                                placeholder="Ej. 1234567890"
                                            />
                                            <FormErrorMessage>{formErrors.numeroTelefono}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <Button
                                    type="submit"
                                    colorScheme="brand"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={isLoading}
                                    mt={2}
                                    w="full"
                                >
                                    Registrarse
                                </Button>
                            </VStack>
                        </form>

                        <Divider borderColor="whiteAlpha.200" my={6} />

                        <Flex justifyContent="center" fontSize="sm">
                            <Text color="text.secondary">¿Ya tienes una cuenta?</Text>
                            <Link
                                as={RouterLink}
                                to="/login"
                                color="brand.500"
                                _hover={{ color: 'brand.400' }}
                                fontWeight="semibold"
                                ml={1}
                            >
                                Inicia sesión
                            </Link>
                        </Flex>
                    </Box>
                </ScaleFade>
            </Flex>
        </Box>
    );
};

export default Register;