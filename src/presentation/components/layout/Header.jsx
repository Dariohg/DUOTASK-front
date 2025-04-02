import {
    Box,
    Flex,
    IconButton,
    Avatar,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    HStack,
    InputGroup,
    Input,
    InputLeftElement,
    Tooltip
} from '@chakra-ui/react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuOpen }) => {
    const { user, logout } = useAuth();

    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            py={2}
            px={4}
            bg="background.secondary"
            borderBottom="1px solid"
            borderColor="rgba(255, 255, 255, 0.08)"
            h="60px"
        >
            {/* Left section - Logo and hamburger menu */}
            <HStack spacing={4}>
                <IconButton
                    icon={<FiMenu />}
                    variant="ghost"
                    onClick={onMenuOpen}
                    display={{ base: 'flex', lg: 'none' }}
                    aria-label="Open menu"
                />
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, brand.500, accent.500)"
                    bgClip="text"
                >
                    DUOTASK
                </Text>
            </HStack>

            {/* Center section - Search */}
            {/* <Box display={{ base: 'none', md: 'block' }} mx={4} flex="1" maxW="500px">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FiSearch color="gray.500" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar..."
                        variant="filled"
                        bg="background.tertiary"
                        _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}
                        _focus={{ bg: "rgba(255, 255, 255, 0.06)" }}
                        borderRadius="full"
                    />
                </InputGroup>
            </Box> */}

            {/* Right section - Notifications and User menu */}
            <HStack spacing={4}>
                {/* <Tooltip label="Notificaciones">
                    <Box position="relative">
                        <IconButton
                            aria-label="Notifications"
                            icon={<FiBell />}
                            variant="ghost"
                        />
                        {/* Notification badge */}
                        {/* <Box
                            position="absolute"
                            top={1}
                            right={1}
                            px={1}
                            py={0.5}
                            fontSize="xs"
                            fontWeight="bold"
                            lineHeight="none"
                            color="white"
                            bg="red.500"
                            borderRadius="full"
                            transform="translate(25%, -25%)"
                        >
                            3
                        </Box>
                    </Box>
                </Tooltip> */}

                <Menu>
                    <MenuButton
                        as={Box}
                        rounded="full"
                        cursor="pointer"
                    >
                        <HStack>
                            <Avatar
                                size="sm"
                                name={user?.name || "Usuario"}
                                src={user?.avatar}
                                bg="brand.500"
                            />
                            <Text display={{ base: 'none', md: 'block' }}>
                                {user?.name || "Usuario"}
                            </Text>
                        </HStack>
                    </MenuButton>
                    <MenuList bg="background.secondary" borderColor="rgba(255, 255, 255, 0.08)">
                        <MenuItem _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}>Mi Perfil</MenuItem>
                        <MenuItem _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}>Configuración</MenuItem>
                        <MenuDivider borderColor="rgba(255, 255, 255, 0.08)" />
                        <MenuItem
                            onClick={logout}
                            _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}
                        >
                            Cerrar Sesión
                        </MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </Flex>
    );
};

export default Header;