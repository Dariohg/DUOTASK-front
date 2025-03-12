import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    Heading,
    Text,
    Flex,
    HStack,
    VStack,
    Icon,
    Badge,
    Card,
    CardBody,
    SimpleGrid,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    IconButton,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiClock,
    FiPlus,
    FiInfo,
    FiTrash2,
    FiEdit2,
} from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Simular un servicio de eventos
const EventService = {
    getEvents: async () => {
        // Obtener eventos del localStorage o usar datos de ejemplo
        const storedEvents = localStorage.getItem('duotask_events');
        if (storedEvents) {
            return JSON.parse(storedEvents);
        }

        // Datos de ejemplo
        const demoEvents = [
            {
                id: '1',
                title: 'Reunión de padres',
                date: '2025-03-12',
                time: '18:00',
                description: 'Reunión general con padres de familia para discutir avances del semestre',
                type: 'meeting'
            },
            {
                id: '2',
                title: 'Entrega de calificaciones',
                date: '2025-03-15',
                time: '10:00',
                description: 'Publicación de calificaciones del primer parcial',
                type: 'deadline'
            },
            {
                id: '3',
                title: 'Feria de ciencias',
                date: '2025-03-20',
                time: '14:00',
                description: 'Presentación de proyectos de ciencias de todos los grupos',
                type: 'event'
            }
        ];

        // Guardar eventos de ejemplo en localStorage
        localStorage.setItem('duotask_events', JSON.stringify(demoEvents));

        return demoEvents;
    },

    createEvent: async (eventData) => {
        // Obtener eventos existentes
        const events = await EventService.getEvents();

        // Crear nuevo evento con ID generado
        const newEvent = {
            id: Date.now().toString(),
            ...eventData
        };

        // Guardar eventos actualizados
        const updatedEvents = [...events, newEvent];
        localStorage.setItem('duotask_events', JSON.stringify(updatedEvents));

        return newEvent;
    },

    updateEvent: async (eventId, eventData) => {
        // Obtener eventos existentes
        const events = await EventService.getEvents();

        // Buscar índice del evento
        const index = events.findIndex(event => event.id === eventId);

        if (index === -1) {
            throw new Error('Evento no encontrado');
        }

        // Actualizar evento
        const updatedEvent = {
            ...events[index],
            ...eventData
        };

        // Guardar eventos actualizados
        events[index] = updatedEvent;
        localStorage.setItem('duotask_events', JSON.stringify(events));

        return updatedEvent;
    },

    deleteEvent: async (eventId) => {
        // Obtener eventos existentes
        const events = await EventService.getEvents();

        // Filtrar eventos para eliminar el especificado
        const updatedEvents = events.filter(event => event.id !== eventId);

        // Si no se eliminó ningún evento, el ID no existía
        if (updatedEvents.length === events.length) {
            throw new Error('Evento no encontrado');
        }

        // Guardar eventos actualizados
        localStorage.setItem('duotask_events', JSON.stringify(updatedEvents));

        return true;
    }
};

// Componente de formulario para crear/editar eventos
const EventForm = ({ isOpen, onClose, onSubmit, event, isEditing }) => {
    const initialData = {
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        description: '',
        type: 'event'
    };

    const [formData, setFormData] = useState(event || initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resetear el formulario cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setFormData(event || initialData);
        }
    }, [isOpen, event]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar evento:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                <ModalHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody py={4}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="title">Título</FormLabel>
                            <Input
                                id="title"
                                placeholder="Título del evento"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <Grid templateColumns="1fr 1fr" gap={4}>
                            <FormControl isRequired>
                                <FormLabel htmlFor="date">Fecha</FormLabel>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="time">Hora</FormLabel>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <FormControl>
                            <FormLabel htmlFor="description">Descripción</FormLabel>
                            <Textarea
                                id="description"
                                placeholder="Descripción del evento"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel htmlFor="type">Tipo de evento</FormLabel>
                            <Select
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="event">Evento general</option>
                                <option value="meeting">Reunión</option>
                                <option value="deadline">Fecha límite</option>
                                <option value="task">Tarea</option>
                            </Select>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter borderTopWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        loadingText="Guardando..."
                    >
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Componente para mostrar un día en el calendario
const CalendarDay = ({ day, currentMonth, events, onClickDate, onClickEvent }) => {
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isCurrentDay = isToday(day);
    const dayEvents = events.filter(event => isSameDay(parseISO(event.date), day));

    // Función para obtener el color según el tipo de evento
    const getEventColor = (type) => {
        switch (type) {
            case 'meeting':
                return 'blue';
            case 'deadline':
                return 'red';
            case 'task':
                return 'purple';
            default:
                return 'green';
        }
    };

    return (
        <Box
            p={2}
            h="110px"
            borderWidth="1px"
            borderColor={isCurrentDay ? "brand.500" : "whiteAlpha.200"}
            bg={isCurrentMonth ? "background.secondary" : "background.tertiary"}
            opacity={isCurrentMonth ? 1 : 0.6}
            position="relative"
            cursor="pointer"
            onClick={() => onClickDate(day)}
            _hover={{
                bg: "whiteAlpha.50",
            }}
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                },
            }}
        >
            <Text
                fontWeight={isCurrentDay ? "bold" : "normal"}
                color={isCurrentDay ? "brand.500" : "inherit"}
                fontSize="sm"
            >
                {format(day, 'd')}
            </Text>

            <VStack spacing={1} align="stretch" mt={2}>
                {dayEvents.slice(0, 3).map(event => (
                    <Box
                        key={event.id}
                        py={1}
                        px={2}
                        borderRadius="sm"
                        bg={`${getEventColor(event.type)}.700`}
                        fontSize="xs"
                        fontWeight="medium"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickEvent(event);
                        }}
                        _hover={{
                            bg: `${getEventColor(event.type)}.600`,
                        }}
                    >
                        {event.title}
                    </Box>
                ))}

                {dayEvents.length > 3 && (
                    <Text fontSize="xs" color="text.secondary" textAlign="center">
                        +{dayEvents.length - 3} más
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

// Componente principal del calendario
const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const {
        isOpen: isFormOpen,
        onOpen: openForm,
        onClose: closeForm
    } = useDisclosure();

    const {
        isOpen: isEventDetailOpen,
        onOpen: openEventDetail,
        onClose: closeEventDetail
    } = useDisclosure();

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Cargar eventos al montar el componente
    useEffect(() => {
        fetchEvents();
    }, []);

    // Función para cargar eventos
    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const data = await EventService.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error cargando eventos:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los eventos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Navegación entre meses
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    // Obtener días para mostrar en el calendario
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    // Días del mes
    const days = getDaysInMonth();

    // Manipulación de fechas para la vista del calendario
    const startDate = startOfMonth(currentMonth);
    const startDayOfWeek = startDate.getDay();
    const endDate = endOfMonth(currentMonth);

    // Calcular días del mes anterior para completar la primera semana
    const prevMonthDays = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(startDate);
        date.setDate(date.getDate() - i);
        prevMonthDays.push(date);
    }

    // Calcular días del mes siguiente para completar la última semana
    const nextMonthDays = [];
    const lastDayOfWeek = endDate.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const date = new Date(endDate);
        date.setDate(date.getDate() + i);
        nextMonthDays.push(date);
    }

    // Todos los días a mostrar
    const allDays = [...prevMonthDays, ...days, ...nextMonthDays];

    // Manejo de eventos
    const handleDateClick = (date) => {
        setSelectedDate(date);
        openForm();
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        openEventDetail();
    };

    const handleCreateEvent = async (eventData) => {
        try {
            await EventService.createEvent(eventData);
            fetchEvents();
            toast({
                title: 'Evento creado',
                description: 'El evento se ha creado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error creando evento:', error);
            toast({
                title: 'Error',
                description: 'No se pudo crear el evento',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdateEvent = async (eventData) => {
        try {
            await EventService.updateEvent(selectedEvent.id, eventData);
            fetchEvents();
            closeEventDetail();
            toast({
                title: 'Evento actualizado',
                description: 'El evento se ha actualizado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error actualizando evento:', error);
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el evento',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteEvent = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            return;
        }

        try {
            await EventService.deleteEvent(selectedEvent.id);
            fetchEvents();
            closeEventDetail();
            toast({
                title: 'Evento eliminado',
                description: 'El evento se ha eliminado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error eliminando evento:', error);
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el evento',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Función para obtener eventos del día actual
    const getTodayEvents = () => {
        const today = new Date();
        return events.filter(event => isSameDay(parseISO(event.date), today));
    };

    // Función para obtener eventos próximos (dentro de los próximos 7 días)
    const getUpcomingEvents = () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return events
            .filter(event => {
                const eventDate = parseISO(event.date);
                return eventDate >= today && eventDate <= nextWeek;
            })
            .sort((a, b) => parseISO(a.date) - parseISO(b.date));
    };

    // Obtener el color según el tipo de evento
    const getEventColor = (type) => {
        switch (type) {
            case 'meeting':
                return 'blue';
            case 'deadline':
                return 'red';
            case 'task':
                return 'purple';
            default:
                return 'green';
        }
    };

    // Obtener el texto del tipo de evento
    const getEventTypeText = (type) => {
        switch (type) {
            case 'meeting':
                return 'Reunión';
            case 'deadline':
                return 'Fecha límite';
            case 'task':
                return 'Tarea';
            default:
                return 'Evento';
        }
    };

    // Formatear fecha para mostrar
    const formatEventDate = (dateStr) => {
        const date = parseISO(dateStr);
        return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    };

    return (
        <Box p={4}>
            <Heading as="h1" size="xl" mb={6}>
                Calendario
            </Heading>

            <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                <Box>
                    {/* Barra de navegación del calendario */}
                    <Card bg="background.card" mb={6}>
                        <CardBody py={3}>
                            <Flex justify="space-between" align="center">
                                <HStack>
                                    <Button
                                        leftIcon={<FiCalendar />}
                                        size="sm"
                                        onClick={goToToday}
                                    >
                                        Hoy
                                    </Button>
                                    <HStack spacing={2}>
                                        <IconButton
                                            icon={<FiChevronLeft />}
                                            aria-label="Mes anterior"
                                            onClick={prevMonth}
                                            size="sm"
                                        />
                                        <IconButton
                                            icon={<FiChevronRight />}
                                            aria-label="Mes siguiente"
                                            onClick={nextMonth}
                                            size="sm"
                                        />
                                    </HStack>
                                </HStack>

                                <Heading size="md">
                                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                                </Heading>

                                <Button
                                    leftIcon={<FiPlus />}
                                    colorScheme="brand"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        openForm();
                                    }}
                                >
                                    Nuevo Evento
                                </Button>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Calendario */}
                    <Card bg="background.card">
                        <CardBody p={4}>
                            {isLoading ? (
                                <Flex justify="center" align="center" minH="400px">
                                    <Spinner size="xl" color="brand.500" />
                                </Flex>
                            ) : (
                                <Box>
                                    {/* Días de la semana */}
                                    <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={2}>
                                        {daysOfWeek.map((day, index) => (
                                            <Box
                                                key={index}
                                                p={2}
                                                fontWeight="bold"
                                                fontSize="sm"
                                                textAlign="center"
                                                color="text.secondary"
                                            >
                                                {day.substring(0, 3)}
                                            </Box>
                                        ))}
                                    </Grid>

                                    {/* Días del calendario */}
                                    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                                        {allDays.map((day, index) => (
                                            <CalendarDay
                                                key={index}
                                                day={day}
                                                currentMonth={currentMonth}
                                                events={events}
                                                onClickDate={handleDateClick}
                                                onClickEvent={handleEventClick}
                                            />
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </CardBody>
                    </Card>
                </Box>

                {/* Panel lateral de eventos */}
                <VStack spacing={6} align="stretch">
                    {/* Eventos de hoy */}
                    <Card bg="background.card">
                        <CardBody>
                            <Heading as="h3" size="md" mb={4}>
                                Eventos de hoy
                            </Heading>

                            {getTodayEvents().length > 0 ? (
                                <VStack spacing={3} align="stretch">
                                    {getTodayEvents().map(event => (
                                        <Box
                                            key={event.id}
                                            p={3}
                                            borderRadius="md"
                                            borderLeftWidth="4px"
                                            borderLeftColor={`${getEventColor(event.type)}.500`}
                                            bg="background.tertiary"
                                            cursor="pointer"
                                            onClick={() => handleEventClick(event)}
                                            _hover={{ bg: "background.secondary" }}
                                        >
                                            <Text fontWeight="medium">{event.title}</Text>
                                            <HStack fontSize="sm" color="text.secondary" mt={1}>
                                                <Icon as={FiClock} />
                                                <Text>{event.time}</Text>
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Text color="text.secondary">No hay eventos programados para hoy</Text>
                            )}
                        </CardBody>
                    </Card>

                    {/* Próximos eventos */}
                    <Card bg="background.card">
                        <CardBody>
                            <Heading as="h3" size="md" mb={4}>
                                Próximos eventos
                            </Heading>

                            {getUpcomingEvents().length > 0 ? (
                                <VStack spacing={3} align="stretch">
                                    {getUpcomingEvents().map(event => (
                                        <Box
                                            key={event.id}
                                            p={3}
                                            borderRadius="md"
                                            borderLeftWidth="4px"
                                            borderLeftColor={`${getEventColor(event.type)}.500`}
                                            bg="background.tertiary"
                                            cursor="pointer"
                                            onClick={() => handleEventClick(event)}
                                            _hover={{ bg: "background.secondary" }}
                                        >
                                            <Text fontWeight="medium">{event.title}</Text>
                                            <HStack fontSize="sm" color="text.secondary" mt={1}>
                                                <Icon as={FiCalendar} />
                                                <Text>{formatEventDate(event.date)}</Text>
                                            </HStack>
                                            <HStack fontSize="sm" color="text.secondary" mt={1}>
                                                <Icon as={FiClock} />
                                                <Text>{event.time}</Text>
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Text color="text.secondary">No hay próximos eventos programados</Text>
                            )}
                        </CardBody>
                    </Card>
                </VStack>
            </Grid>

            {/* Modal de formulario de evento */}
            <EventForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={handleCreateEvent}
                event={{
                    ...selectedEvent,
                    date: format(selectedDate, 'yyyy-MM-dd')
                }}
                isEditing={false}
            />

            {/* Modal de detalle de evento */}
            <Modal isOpen={isEventDetailOpen} onClose={closeEventDetail} isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent bg="background.card" borderColor="rgba(255, 255, 255, 0.05)">
                    <ModalHeader
                        borderBottomWidth="1px"
                        borderColor="rgba(255, 255, 255, 0.05)"
                        display="flex"
                        alignItems="center"
                    >
                        <Badge
                            colorScheme={selectedEvent && getEventColor(selectedEvent.type)}
                            mr={2}
                        >
                            {selectedEvent && getEventTypeText(selectedEvent.type)}
                        </Badge>
                        <Text>{selectedEvent && selectedEvent.title}</Text>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={4}>
                        {selectedEvent && (
                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Icon as={FiCalendar} color="text.secondary" />
                                    <Text>{formatEventDate(selectedEvent.date)}</Text>
                                </HStack>

                                <HStack>
                                    <Icon as={FiClock} color="text.secondary" />
                                    <Text>{selectedEvent.time}</Text>
                                </HStack>

                                {selectedEvent.description && (
                                    <Box>
                                        <Text fontWeight="medium" mb={1}>Descripción:</Text>
                                        <Text>{selectedEvent.description}</Text>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter borderTopWidth="1px" borderColor="rgba(255, 255, 255, 0.05)">
                        <Button
                            leftIcon={<FiTrash2 />}
                            colorScheme="red"
                            variant="ghost"
                            mr="auto"
                            onClick={handleDeleteEvent}
                        >
                            Eliminar
                        </Button>
                        <Button variant="outline" mr={3} onClick={closeEventDetail}>
                            Cerrar
                        </Button>
                        <Button
                            colorScheme="brand"
                            leftIcon={<FiEdit2 />}
                            onClick={() => {
                                closeEventDetail();
                                setSelectedDate(parseISO(selectedEvent.date));
                                setTimeout(() => openForm(), 100);
                            }}
                        >
                            Editar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Calendar;