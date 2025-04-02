// registrationService.js

const STORAGE_KEY = 'usuarios';

/**
 * Obtiene la lista de usuarios almacenados en localStorage.
 * @returns {Array} Lista de usuarios.
 */
const getUsers = () => {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

/**
 * Guarda la lista de usuarios en localStorage.
 * @param {Array} users Lista de usuarios a almacenar.
 */
const saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/**
 * Registra un nuevo usuario en el almacenamiento local.
 * @param {Object} user Datos del usuario a registrar.
 * @returns {Object} Resultado del registro.
 */
export const registerUser = (user) => {
    const users = getUsers();

    // Verificar si el nombre de usuario o el correo ya existen
    const userExists = users.some(
        (u) => u.username === user.username || u.correoElectronico === user.correoElectronico
    );

    if (userExists) {
        return { success: false, message: 'El usuario o correo ya está registrado' };
    }

    // Agregar el nuevo usuario a la lista
    users.push(user);
    saveUsers(users);

    return { success: true, message: 'Usuario registrado con éxito' };
};

/**
 * Busca un usuario por su nombre de usuario y contraseña.
 * @param {string} username Nombre de usuario.
 * @param {string} password Contraseña.
 * @returns {Object|null} Retorna el usuario si es válido, de lo contrario, `null`.
 */
export const loginUser = (username, password) => {
    const users = getUsers();
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        return { success: true, user };
    } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
};
