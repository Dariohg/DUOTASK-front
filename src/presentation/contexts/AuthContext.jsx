import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../services/api/registrationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verificar si hay una sesión activa al cargar la página
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false);
    }, []);

    // Función para iniciar sesión
    const login = async (username, password) => {
        try {
            const result = loginUser(username, password);
            if (result.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                setUser(result.user);
                return { success: true };
            }
            return { success: false, message: 'Credenciales incorrectas' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Error al iniciar sesión' };
        }
    };

    // Función para registrar un nuevo usuario
    const register = async (userData) => {
        try {
            const result = registerUser(userData);
            return result;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Error al registrar usuario' };
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('currentUser');
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
