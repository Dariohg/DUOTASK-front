/**
 * Servicio para gestionar grupos - Simulación
 *
 * Este servicio simula las operaciones de backend mientras se implementa
 * la API real. Utiliza localStorage para persistir datos entre sesiones.
 */

// Clave para almacenar grupos en localStorage
const GROUPS_STORAGE_KEY = 'duotask_groups';

// Función para generar un ID único
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Obtener grupos del almacenamiento local
const getStoredGroups = () => {
    const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
    return storedGroups ? JSON.parse(storedGroups) : [];
};

// Guardar grupos en el almacenamiento local
const saveGroups = (groups) => {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
};

/**
 * Servicio para gestionar grupos
 */
const groupService = {
    /**
     * Crear un nuevo grupo
     * @param {Object} groupData - Datos del grupo
     * @returns {Promise<Object>} - Grupo creado
     */
    createGroup: async (groupData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Obtener grupos existentes
        const groups = getStoredGroups();

        // Crear un nuevo grupo con ID generado
        const newGroup = {
            id: generateId(),
            ...groupData,
            createdAt: new Date().toISOString()
        };

        // Guardar grupos actualizados
        saveGroups([...groups, newGroup]);

        return newGroup;
    },

    /**
     * Obtener todos los grupos
     * @returns {Promise<Array>} - Lista de grupos
     */
    getGroups: async () => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener grupos almacenados
        return getStoredGroups();
    },

    /**
     * Obtener un grupo por ID
     * @param {string} groupId - ID del grupo
     * @returns {Promise<Object>} - Datos del grupo
     */
    getGroupById: async (groupId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 300));

        // Buscar grupo por ID
        const groups = getStoredGroups();
        const group = groups.find(group => group.id === groupId);

        if (!group) {
            throw new Error('Grupo no encontrado');
        }

        return group;
    },

    /**
     * Actualizar un grupo
     * @param {string} groupId - ID del grupo a actualizar
     * @param {Object} groupData - Nuevos datos del grupo
     * @returns {Promise<Object>} - Grupo actualizado
     */
    updateGroup: async (groupId, groupData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Obtener grupos existentes
        const groups = getStoredGroups();

        // Buscar índice del grupo
        const index = groups.findIndex(group => group.id === groupId);

        if (index === -1) {
            throw new Error('Grupo no encontrado');
        }

        // Actualizar grupo
        const updatedGroup = {
            ...groups[index],
            ...groupData,
            updatedAt: new Date().toISOString()
        };

        // Guardar grupos actualizados
        groups[index] = updatedGroup;
        saveGroups(groups);

        return updatedGroup;
    },

    /**
     * Eliminar un grupo
     * @param {string} groupId - ID del grupo a eliminar
     * @returns {Promise<boolean>} - true si se eliminó correctamente
     */
    deleteGroup: async (groupId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 600));

        // Obtener grupos existentes
        const groups = getStoredGroups();

        // Filtrar grupos para eliminar el especificado
        const updatedGroups = groups.filter(group => group.id !== groupId);

        // Si no se eliminó ningún grupo, el ID no existía
        if (updatedGroups.length === groups.length) {
            throw new Error('Grupo no encontrado');
        }

        // Guardar grupos actualizados
        saveGroups(updatedGroups);

        return true;
    }
};

export default groupService;