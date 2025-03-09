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
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();
    const { login } = useAuth();

    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    // Validar el formulario
    const validateForm = () => {
        const errors = {};

        if (!username) {
            errors.username = 'El nombre de usuario es requerido';
        }

        if (!password) {
            errors.password = 'La contraseña es requerida';
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
            // Llamar a la función login con username y password
            const result = await login(username, password);

            if (result.success) {
                navigate('/app/dashboard');
            } else {
                setError(result.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setError('Ocurrió un error al iniciar sesión');
            console.error('Login error:', error);
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
                        w={{ base: "full", sm: "450px" }}
                        maxW="100%"
                        borderWidth="1px"
                        borderColor="rgba(255, 255, 255, 0.05)"
                        position="relative"
                    >
                        <IconButton
                            icon={<FiArrowLeft />}
                            aria-label="Volver al inicio"
                            position="absolute"
                            top={4}
                            left={4}
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                        />

                        <Stack spacing={6}>
                            <Stack align="center" spacing={2}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="bold"
                                    bgGradient="linear(to-r, brand.500, accent.500)"
                                    bgClip="text"
                                >
                                    DUOTASK
                                </Text>
                                <Heading as="h1" size="lg" textAlign="center">
                                    Iniciar Sesión
                                </Heading>
                                <Text color="text.secondary" fontSize="sm" textAlign="center">
                                    Ingresa tus credenciales para acceder a tu cuenta
                                </Text>
                            </Stack>

                            {error && (
                                <Alert status="error" borderRadius="md" variant="subtle">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={4}>
                                    <FormControl isInvalid={!!formErrors.username}>
                                        <FormLabel htmlFor="username">Nombre de Usuario</FormLabel>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Tu nombre de usuario"
                                        />
                                        <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!formErrors.password}>
                                        <Flex align="baseline" justify="space-between">
                                            <FormLabel htmlFor="password">Contraseña</FormLabel>
                                            <Text
                                                color="brand.500"
                                                fontSize="xs"
                                                cursor="pointer"
                                                _hover={{ textDecoration: "underline" }}
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Text>
                                        </Flex>
                                        <InputGroup>
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Tu contraseña"
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

                                    <Button
                                        type="submit"
                                        colorScheme="brand"
                                        size="lg"
                                        fontSize="md"
                                        isLoading={isLoading}
                                        mt={4}
                                    >
                                        Iniciar Sesión
                                    </Button>

                                    <Text fontSize="sm" color="text.secondary" textAlign="center" mt={4}>
                                        Para fines de demostración, usa:
                                        <br />
                                        <Text as="span" fontWeight="medium" color="text.primary">
                                            admin123 / 123456
                                        </Text>
                                    </Text>
                                </Stack>
                            </form>

                            <Divider borderColor="whiteAlpha.200" my={2} />

                            <Flex justifyContent="center" fontSize="sm">
                                <Text color="text.secondary">¿No tienes una cuenta?</Text>
                                <Link
                                    as={RouterLink}
                                    to="/register"
                                    color="brand.500"
                                    _hover={{ color: 'brand.400' }}
                                    fontWeight="semibold"
                                    ml={1}
                                >
                                    Regístrate
                                </Link>
                            </Flex>
                        </Stack>
                    </Box>
                </ScaleFade>
            </Flex>
        </Box>
    );
};

export default Login;