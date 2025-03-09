import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
    Box,
    Flex,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

// Componentes del layout
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const MainLayout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAuthenticated, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Determinar si el menú lateral debe mostrarse siempre o sólo en móvil
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    // Prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    // Mostrar un estado de carga o redirigir si no está autenticado
    if (!mounted || loading) {
        return null; // O un spinner de carga
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Flex h="100vh" flexDirection="column">
            {/* Header */}
            <Header onMenuOpen={onOpen} />

            <Flex flex="1" overflow="hidden">
                {/* Sidebar para escritorio */}
                {isDesktop ? (
                    <Box
                        w="250px"
                        bg="background.secondary"
                        h="100%"
                        transition="0.3s ease"
                        borderRight="1px solid"
                        borderColor="rgba(255, 255, 255, 0.08)"
                        display={{ base: 'none', lg: 'block' }}
                    >
                        <Sidebar />
                    </Box>
                ) : null}

                {/* Drawer para móvil */}
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                >
                    <DrawerOverlay />
                    <DrawerContent bg="background.secondary" maxW="250px">
                        <DrawerCloseButton color="text.primary" />
                        <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.08)">
                            DUOTASK
                        </DrawerHeader>
                        <DrawerBody p={0}>
                            <Sidebar onClose={onClose} />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Contenido principal */}
                <Box
                    flex="1"
                    p={4}
                    bg="background.primary"
                    overflowY="auto"
                >
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
};

export default MainLayout;