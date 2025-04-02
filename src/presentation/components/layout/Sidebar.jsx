import { Box, Flex, Stack, Icon, Text, VStack, Divider } from '@chakra-ui/react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiClipboard,
    FiBook,
    FiCalendar,
    FiMessageSquare,
    FiSettings,
    FiHelpCircle,
    FiCheckSquare
} from 'react-icons/fi';

// Define los elementos de navegación
const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/app/dashboard' },
    // { name: 'Estudiantes', icon: FiUsers, path: '/app/students' },
    { name: 'Tareas', icon: FiClipboard, path: '/app/tasks' },
    { name: 'Clases', icon: FiBook, path: '/app/classes' },
    { name: 'Calendario', icon: FiCalendar, path: '/app/calendar' },
    { name: 'Mensajes', icon: FiMessageSquare, path: '/app/messages' },
    { name: 'Asistencia', icon: FiCheckSquare, path: '/app/attendance' },
];

// Enlaces secundarios
const secondaryNavItems = [
    // { name: 'Configuración', icon: FiSettings, path: '/app/settings' },
    // { name: 'Ayuda', icon: FiHelpCircle, path: '/app/help' },
];

// Componente de un elemento de navegación
const NavItem = ({ item, onClose }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path ||
        (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));

    const handleClick = () => {
        if (onClose) onClose();
    };

    return (
        <Box
            as={RouterLink}
            to={item.path}
            display="block"
            w="100%"
            py={2}
            px={4}
            borderRadius="md"
            color={isActive ? 'brand.500' : 'text.secondary'}
            bg={isActive ? 'rgba(33, 150, 243, 0.08)' : 'transparent'}
            _hover={{
                textDecoration: 'none',
                bg: 'rgba(255, 255, 255, 0.06)',
                color: isActive ? 'brand.500' : 'text.primary',
            }}
            onClick={handleClick}
        >
            <Flex align="center">
                <Icon as={item.icon} fontSize="lg" mr={3} />
                <Text fontSize="sm" fontWeight={isActive ? 'medium' : 'normal'}>
                    {item.name}
                </Text>
            </Flex>
        </Box>
    );
};

const Sidebar = ({ onClose }) => {
    return (
        <Box h="100%">
            <VStack align="start" spacing={1} mt={4} px={3}>
                {navItems.map((item) => (
                    <NavItem key={item.name} item={item} onClose={onClose} />
                ))}
            </VStack>

            <Divider my={4} borderColor="rgba(255, 255, 255, 0.08)" />

            <VStack align="start" spacing={1} px={3}>
                {secondaryNavItems.map((item) => (
                    <NavItem key={item.name} item={item} onClose={onClose} />
                ))}
            </VStack>
        </Box>
    );
};

export default Sidebar;