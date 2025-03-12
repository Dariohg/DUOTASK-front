/**
 * Servicio para gestionar estudiantes - Simulación
 *
 * Este servicio simula las operaciones de backend mientras se implementa
 * la API real. Utiliza localStorage para persistir datos entre sesiones.
 */

import groupService from './groupService';

// Clave para almacenar estudiantes en localStorage
const STUDENTS_STORAGE_KEY = 'duotask_students';

// Función para generar un ID único
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Obtener estudiantes del almacenamiento local
const getStoredStudents = () => {
    const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return storedStudents ? JSON.parse(storedStudents) : [];
};

// Guardar estudiantes en el almacenamiento local
const saveStudents = (students) => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
};

/**
 * Servicio para gestionar estudiantes
 */
const studentService = {
    /**
     * Crear un nuevo estudiante
     * @param {Object} studentData - Datos del estudiante
     * @returns {Promise<Object>} - Estudiante creado
     */
    createStudent: async (studentData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validar que exista el grupo
        try {
            const groups = await groupService.getGroups();
            const group = groups.find(g => g.id === studentData.idGrupo);

            if (!group) {
                throw new Error('El grupo seleccionado no existe');
            }

            // Obtener estudiantes existentes
            const students = getStoredStudents();

            // Crear un nuevo estudiante con ID generado
            const newStudentId = generateId();
            const newStudent = {
                id: newStudentId,
                ...studentData,
                createdAt: new Date().toISOString()
            };

            // Guardar estudiante
            saveStudents([...students, newStudent]);

            // Actualizar el grupo para agregar el ID del estudiante
            const updatedGroup = {
                ...group,
                alumnos: [...(group.alumnos || []), newStudentId]
            };

            // Guardar el grupo actualizado
            await groupService.updateGroup(group.id, updatedGroup);

            return newStudent;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    /**
     * Obtener todos los estudiantes
     * @returns {Promise<Array>} - Lista de estudiantes
     */
    getStudents: async () => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener estudiantes almacenados
        return getStoredStudents();
    },

    /**
     * Obtener todos los estudiantes de un grupo específico
     * @param {string} groupId - ID del grupo
     * @returns {Promise<Array>} - Lista de estudiantes del grupo
     */
    getStudentsByGroup: async (groupId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener todos los estudiantes
        const students = getStoredStudents();

        // Filtrar por grupo
        return students.filter(student => student.idGrupo === groupId);
    },

    /**
     * Obtener un estudiante por ID
     * @param {string} studentId - ID del estudiante
     * @returns {Promise<Object>} - Datos del estudiante
     */
    getStudentById: async (studentId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 300));

        // Buscar estudiante por ID
        const students = getStoredStudents();
        const student = students.find(student => student.id === studentId);

        if (!student) {
            throw new Error('Estudiante no encontrado');
        }

        return student;
    },

    /**
     * Actualizar un estudiante
     * @param {string} studentId - ID del estudiante a actualizar
     * @param {Object} studentData - Nuevos datos del estudiante
     * @returns {Promise<Object>} - Estudiante actualizado
     */
    updateStudent: async (studentId, studentData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Obtener estudiantes existentes
        const students = getStoredStudents();

        // Buscar índice del estudiante
        const index = students.findIndex(student => student.id === studentId);

        if (index === -1) {
            throw new Error('Estudiante no encontrado');
        }

        // Si cambia el grupo, actualizar las referencias en los grupos
        const oldGroupId = students[index].idGrupo;
        const newGroupId = studentData.idGrupo;

        if (newGroupId && oldGroupId !== newGroupId) {
            try {
                // Obtener grupos
                const groups = await groupService.getGroups();

                // Encontrar el grupo antiguo y nuevo
                const oldGroup = groups.find(g => g.id === oldGroupId);
                const newGroup = groups.find(g => g.id === newGroupId);

                if (!newGroup) {
                    throw new Error('El nuevo grupo seleccionado no existe');
                }

                // Actualizar el grupo antiguo para quitar el ID del estudiante
                if (oldGroup) {
                    const updatedOldGroup = {
                        ...oldGroup,
                        alumnos: (oldGroup.alumnos || []).filter(id => id !== studentId)
                    };
                    await groupService.updateGroup(oldGroup.id, updatedOldGroup);
                }

                // Actualizar el grupo nuevo para agregar el ID del estudiante
                const updatedNewGroup = {
                    ...newGroup,
                    alumnos: [...(newGroup.alumnos || []), studentId]
                };
                await groupService.updateGroup(newGroup.id, updatedNewGroup);
            } catch (error) {
                console.error('Error updating student groups:', error);
                throw error;
            }
        }

        // Actualizar estudiante
        const updatedStudent = {
            ...students[index],
            ...studentData,
            updatedAt: new Date().toISOString()
        };

        // Guardar estudiantes actualizados
        students[index] = updatedStudent;
        saveStudents(students);

        return updatedStudent;
    },

    /**
     * Eliminar un estudiante
     * @param {string} studentId - ID del estudiante a eliminar
     * @returns {Promise<boolean>} - true si se eliminó correctamente
     */
    deleteStudent: async (studentId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 600));

        // Obtener estudiantes existentes
        const students = getStoredStudents();

        // Buscar el estudiante para obtener su grupo
        const student = students.find(s => s.id === studentId);

        if (!student) {
            throw new Error('Estudiante no encontrado');
        }

        // Actualizar el grupo para quitar la referencia al estudiante
        try {
            const groupId = student.idGrupo;
            if (groupId) {
                const groups = await groupService.getGroups();
                const group = groups.find(g => g.id === groupId);

                if (group) {
                    const updatedGroup = {
                        ...group,
                        alumnos: (group.alumnos || []).filter(id => id !== studentId)
                    };
                    await groupService.updateGroup(groupId, updatedGroup);
                }
            }

            // Filtrar estudiantes para eliminar el especificado
            const updatedStudents = students.filter(student => student.id !== studentId);

            // Guardar estudiantes actualizados
            saveStudents(updatedStudents);

            return true;
        } catch (error) {
            console.error(`Error deleting student with ID ${studentId}:`, error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas de estudiantes
     * @returns {Promise<Object>} - Estadísticas de estudiantes
     */
    getStudentStats: async () => {
        // Obtener todos los estudiantes
        const students = await studentService.getStudents();

        // Obtener todos los grupos
        const groups = await groupService.getGroups();

        // Calcular estadísticas
        const stats = {
            totalStudents: students.length,
            studentsByGroup: {}
        };

        // Contabilizar estudiantes por grupo
        groups.forEach(group => {
            const groupId = group.id;
            const groupName = group.nombre;
            const studentsInGroup = students.filter(student => student.idGrupo === groupId);

            stats.studentsByGroup[groupId] = {
                groupName,
                count: studentsInGroup.length
            };
        });

        return stats;
    }
};

export default studentService;