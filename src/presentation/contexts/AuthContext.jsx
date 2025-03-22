import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verificar si hay una sesión activa al cargar la página
    useEffect(() => {
        const checkAuth = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Función para iniciar sesión
    const login = async (username, password) => {
        try {
            // Simulación de login para desarrollo
            // En producción, esto haría una petición a un API
            if (username === 'admin123' && password === '123456') {
                const userData = {
                    id: '1',
                    name: 'Administrador',
                    username: username,
                    role: 'admin',
                    avatar: null
                };

                // Guardar en localStorage para persistencia
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                return { success: true };
            }

            return {
                success: false,
                message: 'Credenciales incorrectas. Intenta con admin123 / 123456'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Error al iniciar sesión'
            };
        }
    };

    // Función para registrar un nuevo usuario
    const register = async (userData) => {
        try {
            // Simulación de registro para desarrollo
            // En producción, esto haría una petición a un API

            // Verificar si ya existe un usuario con ese username (para fines de demostración)
            if (userData.username === 'admin123') {
                return {
                    success: false,
                    message: 'Este nombre de usuario ya está registrado'
                };
            }

            // Simular un registro exitoso
            console.log('Usuario registrado:', userData);

            return {
                success: true,
                message: 'Usuario registrado correctamente'
            };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.message || 'Error al registrar usuario'
            };
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return !!user;
    };

    // Valor del contexto
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};