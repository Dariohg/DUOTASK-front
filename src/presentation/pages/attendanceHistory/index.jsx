import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    SimpleGrid,
    useDisclosure,
    Card,
    CardBody,
    Icon,
    HStack,
    Badge,
    Divider,
    VStack,
    Spinner,
    useToast,
    InputGroup,
    Input,
    InputLeftElement,
    Select,
} from '@chakra-ui/react';
import {
    FiPlus,
    FiUsers,
    FiSearch,
    FiFilter,
} from 'react-icons/fi';
import ClassService from '../../../services/ClassService';
import {useNavigate} from "react-router-dom";

const AttendanceIndex = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();


    const navigateToGroupDetail = (groupId) => {
        navigate(`/app/attendance/${groupId}`);
    };

    // Cargar grupos al montar el componente
    useEffect(() => {
        fetchGroups();
    }, []);

    // Filtrar grupos cuando cambian el término de búsqueda o el filtro de grado
    useEffect(() => {
        filterGroups();
    }, [searchTerm, gradeFilter, groups]);

    // Función para obtener todos los grupos
    const fetchGroups = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await ClassService.getGroups();
            setGroups(data);
            setFilteredGroups(data);
        } catch (err) {
            setError('Error al cargar los grupos');
            console.error('Error fetching groups:', err);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los grupos. Por favor, intenta de nuevo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Función para filtrar grupos según los criterios
    const filterGroups = () => {
        let result = [...groups];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            result = result.filter(group =>
                group.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (group.descripcion && group.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtrar por grado
        if (gradeFilter) {
            result = result.filter(group => group.grado.toString() === gradeFilter);
        }

        setFilteredGroups(result);
    };

    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para manejar cambios en el filtro de grado
    const handleGradeFilterChange = (e) => {
        setGradeFilter(e.target.value);
    };

    // Función para limpiar todos los filtros
    const clearFilters = () => {
        setSearchTerm('');
        setGradeFilter('');
    };

    return (
        <Box p={4}>
            <Flex direction="column" mb={6}>
                <Heading as="h1" size="xl" mb={2}>
                Historial de Asistencia
                </Heading>
                <Text color="text.secondary">
                Revisa y administra la asistencia de los estudiantes
                </Text>
            </Flex>

            {/* Barra de herramientas */}
            <Flex
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
                        placeholder="Buscar grupos..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </InputGroup>

                <HStack spacing={4}>
                    <Select
                        placeholder="Filtrar por grado"
                        maxW="200px"
                        icon={<FiFilter />}
                        value={gradeFilter}
                        onChange={handleGradeFilterChange}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={(i+1).toString()}>
                                Grado {i+1}
                            </option>
                        ))}
                    </Select>

                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        isDisabled={!searchTerm && !gradeFilter}
                    >
                        Limpiar filtros
                    </Button>
                </HStack>
            </Flex>

            {/* Lista de grupos */}
            {isLoading ? (
                <Flex justify="center" align="center" py={12}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                </Flex>
            ) : error ? (
                <Card>
                    <CardBody>
                        <VStack spacing={4} align="center" py={8}>
                            <Text color="red.400">{error}</Text>
                            <Button
                                colorScheme="brand"
                                onClick={fetchGroups}
                            >
                                Intentar de nuevo
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            ) : filteredGroups.length === 0 ? (
                <Card>
                    <CardBody>
                        <VStack spacing={4} align="center" py={12}>
                            <Icon as={FiUsers} boxSize={12} color="gray.500" />
                            <Text fontSize="lg" fontWeight="medium">
                                {groups.length === 0
                                    ? "No tienes grupos creados todavía"
                                    : "No se encontraron grupos con los filtros aplicados"}
                            </Text>
                            <Text color="text.secondary" textAlign="center" maxW="600px">
                                {groups.length === 0
                                    ? "Crea tu primer grupo para comenzar a gestionar tus clases y estudiantes"
                                    : "Intenta cambiar tus criterios de búsqueda o eliminar los filtros"}
                            </Text>
                            <Button
                                colorScheme="brand"
                                leftIcon={<FiPlus />}
                                onClick={groups.length === 0 ? onOpen : clearFilters}
                            >
                                {groups.length === 0 ? "Crear tu primer grupo" : "Limpiar filtros"}
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredGroups.map((group) => (
                        <Card
                            key={group.id}
                            bg="background.card"
                            boxShadow="sm"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                            transition="all 0.2s"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "md",
                                borderColor: "whiteAlpha.300"
                            }}
                            cursor="pointer"
                            onClick={() => navigateToGroupDetail(group.id)}
                        >
                            <CardBody>
                                <Flex justify="space-between" align="flex-start" mb={3}>
                                    <HStack>
                                        <Flex
                                            w="48px"
                                            h="48px"
                                            bg="brand.500"
                                            color="white"
                                            borderRadius="lg"
                                            justify="center"
                                            align="center"
                                            fontSize="xl"
                                            fontWeight="bold"
                                        >
                                            {group.nombre}
                                        </Flex>
                                        <Box>
                                            <Heading size="md">{group.nombre}</Heading>
                                            <Badge colorScheme="purple" mt={1}>Grado {group.grado}</Badge>
                                        </Box>
                                    </HStack>
                                </Flex>

                                {group.descripcion && (
                                    <Text color="text.secondary" fontSize="sm" mb={4}>
                                        {group.descripcion}
                                    </Text>
                                )}

                                <Divider mb={4} />

                                <Flex justify="space-between" fontSize="sm">
                                    <HStack>
                                        <Icon as={FiUsers} />
                                        <Text>0 estudiantes</Text>
                                    </HStack>
                                </Flex>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            )}

    
        </Box>
    );
};

export default AttendanceIndex;