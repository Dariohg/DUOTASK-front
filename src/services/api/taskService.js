/**
 * Servicio para gestionar tareas y calificaciones - Simulación
 *
 * Este servicio simula las operaciones de backend mientras se implementa
 * la API real. Utiliza localStorage para persistir datos entre sesiones.
 */

import groupService from './groupService';
import studentService from './studentService';

// Clave para almacenar tareas en localStorage
const TASKS_STORAGE_KEY = 'duotask_tasks';
const GRADES_STORAGE_KEY = 'duotask_grades';

// Función para generar un ID único
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Obtener tareas del almacenamiento local
const getStoredTasks = () => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
};

// Guardar tareas en el almacenamiento local
const saveTasks = (tasks) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

// Obtener calificaciones del almacenamiento local
const getStoredGrades = () => {
    const storedGrades = localStorage.getItem(GRADES_STORAGE_KEY);
    return storedGrades ? JSON.parse(storedGrades) : [];
};

// Guardar calificaciones en el almacenamiento local
const saveGrades = (grades) => {
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(grades));
};


/**
 * Servicio para gestionar tareas y calificaciones
 */
const taskService = {
    /**
     * Crear una nueva tarea
     * @param {Object} taskData - Datos de la tarea
     * @returns {Promise<Object>} - Tarea creada
     */
    createTask: async (taskData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validar que exista el grupo
        try {
            const groups = await groupService.getGroups();
            const group = groups.find(g => g.id === taskData.idGrupo);

            if (!group) {
                throw new Error('El grupo seleccionado no existe');
            }

            // Obtener tareas existentes
            const tasks = getStoredTasks();

            // Crear una nueva tarea con ID generado
            const newTask = {
                id: generateId(),
                ...taskData,
                createdAt: new Date().toISOString(),
                status: 'active' // active, completed, archived
            };

            // Guardar tarea
            saveTasks([...tasks, newTask]);

            // Crear calificaciones vacías para todos los estudiantes del grupo
            const students = await studentService.getStudentsByGroup(taskData.idGrupo);
            const grades = getStoredGrades();

            // Crear entrada de calificación para cada estudiante
            const newGrades = students.map(student => ({
                id: generateId(),
                idTarea: newTask.id,
                idEstudiante: student.id,
                calificacion: null, // Inicialmente sin calificación
                comentario: '',
                fechaCalificacion: null,
                entregada: false,
                fechaEntrega: null,
                createdAt: new Date().toISOString()
            }));

            // Guardar nuevas calificaciones
            saveGrades([...grades, ...newGrades]);

            return newTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    /**
     * Obtener todas las tareas
     * @returns {Promise<Array>} - Lista de tareas
     */
    getTasks: async () => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener tareas almacenadas
        return getStoredTasks();
    },

    /**
     * Obtener todas las tareas de un grupo específico
     * @param {string} groupId - ID del grupo
     * @returns {Promise<Array>} - Lista de tareas del grupo
     */
    getTasksByGroup: async (groupId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener todas las tareas
        const tasks = getStoredTasks();

        // Filtrar por grupo
        return tasks.filter(task => task.idGrupo === groupId);
    },

    /**
     * Obtener una tarea por ID
     * @param {string} taskId - ID de la tarea
     * @returns {Promise<Object>} - Datos de la tarea
     */
    getTaskById: async (taskId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 300));

        // Buscar tarea por ID
        const tasks = getStoredTasks();
        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            throw new Error('Tarea no encontrada');
        }

        return task;
    },

    /**
     * Actualizar una tarea
     * @param {string} taskId - ID de la tarea a actualizar
     * @param {Object} taskData - Nuevos datos de la tarea
     * @returns {Promise<Object>} - Tarea actualizada
     */
    updateTask: async (taskId, taskData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 800));

        // Obtener tareas existentes
        const tasks = getStoredTasks();

        // Buscar índice de la tarea
        const index = tasks.findIndex(task => task.id === taskId);

        if (index === -1) {
            throw new Error('Tarea no encontrada');
        }

        // Actualizar tarea
        const updatedTask = {
            ...tasks[index],
            ...taskData,
            updatedAt: new Date().toISOString()
        };

        // Guardar tareas actualizadas
        tasks[index] = updatedTask;
        saveTasks(tasks);

        return updatedTask;
    },

    /**
     * Eliminar una tarea
     * @param {string} taskId - ID de la tarea a eliminar
     * @returns {Promise<boolean>} - true si se eliminó correctamente
     */
    deleteTask: async (taskId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 600));

        // Obtener tareas existentes
        const tasks = getStoredTasks();

        // Filtrar tareas para eliminar la especificada
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        // Si no se eliminó ninguna tarea, el ID no existía
        if (updatedTasks.length === tasks.length) {
            throw new Error('Tarea no encontrada');
        }

        // Guardar tareas actualizadas
        saveTasks(updatedTasks);

        // Eliminar todas las calificaciones asociadas a esta tarea
        const grades = getStoredGrades();
        const updatedGrades = grades.filter(grade => grade.idTarea !== taskId);
        saveGrades(updatedGrades);

        return true;
    },

    /**
     * Obtener todas las calificaciones de una tarea
     * @param {string} taskId - ID de la tarea
     * @returns {Promise<Array>} - Lista de calificaciones con datos de estudiantes
     */
    getGradesByTask: async (taskId) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener todas las calificaciones
        const grades = getStoredGrades();

        // Filtrar por tarea
        const taskGrades = grades.filter(grade => grade.idTarea === taskId);

        // Obtener datos de estudiantes para enriquecer las calificaciones
        const studentIds = taskGrades.map(grade => grade.idEstudiante);
        const students = await studentService.getStudents();

        // Combinar datos de calificaciones con datos de estudiantes
        return taskGrades.map(grade => {
            const student = students.find(s => s.id === grade.idEstudiante);
            return {
                ...grade,
                estudiante: student || { nombre: 'Desconocido', apellido: 'Desconocido' }
            };
        });
    },

    /**
     * Actualizar la calificación de un estudiante en una tarea
     * @param {string} gradeId - ID de la calificación
     * @param {Object} gradeData - Nuevos datos de la calificación
     * @returns {Promise<Object>} - Calificación actualizada
     */
    updateGrade: async (gradeId, gradeData) => {
        // Simular una demora en la respuesta
        await new Promise(resolve => setTimeout(resolve, 400));

        // Obtener calificaciones existentes
        const grades = getStoredGrades();

        // Buscar índice de la calificación
        const index = grades.findIndex(grade => grade.id === gradeId);

        if (index === -1) {
            throw new Error('Calificación no encontrada');
        }

        // Actualizar calificación
        const updatedGrade = {
            ...grades[index],
            ...gradeData,
            fechaCalificacion: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Guardar calificaciones actualizadas
        grades[index] = updatedGrade;
        saveGrades(grades);

        return updatedGrade;
    },

    getTasksByStudent: async (studentId) => {
        try {
            // Simular una demora en la respuesta
            await new Promise(resolve => setTimeout(resolve, 500));

            // Obtener todas las tareas
            const tasks = getStoredTasks();

            // Obtener todas las calificaciones
            const grades = getStoredGrades();

            // Filtrar las calificaciones del estudiante
            const studentGrades = grades.filter(grade => grade.idEstudiante === studentId);

            // Mapear los IDs de tareas que tienen calificaciones para este estudiante
            const taskIds = studentGrades.map(grade => grade.idTarea);

            // Obtener las tareas correspondientes a esas calificaciones
            const studentTasks = tasks.filter(task => taskIds.includes(task.id));

            // Combinar las tareas con sus calificaciones
            return studentTasks.map(task => {
                const grade = studentGrades.find(g => g.idTarea === task.id);
                return {
                    ...task,
                    calificacion: grade?.calificacion,
                    comentario: grade?.comentario,
                    fechaEntrega: grade?.fechaEntrega,
                    entregada: grade?.entregada
                };
            });
        } catch (error) {
            console.error('Error al obtener tareas del estudiante:', error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas de tareas y calificaciones
     * @param {string} groupId - ID del grupo (opcional)
     * @returns {Promise<Object>} - Estadísticas
     */
    getTaskStats: async (groupId = null) => {
        // Obtener tareas y calificaciones
        const tasks = await taskService.getTasks();
        const grades = getStoredGrades();

        // Filtrar por grupo si se especifica
        const filteredTasks = groupId ? tasks.filter(task => task.idGrupo === groupId) : tasks;

        // Calcular estadísticas
        const taskCount = filteredTasks.length;
        const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;

        // Calificaciones asignadas vs. pendientes
        let gradesAssigned = 0;
        let gradesPending = 0;

        filteredTasks.forEach(task => {
            const taskGrades = grades.filter(grade => grade.idTarea === task.id);

            gradesAssigned += taskGrades.filter(grade => grade.calificacion !== null).length;
            gradesPending += taskGrades.filter(grade => grade.calificacion === null).length;
        });

        return {
            taskCount,
            completedTasks,
            activeTasksPercent: taskCount ? Math.round((taskCount - completedTasks) / taskCount * 100) : 0,
            gradesAssigned,
            gradesPending,
            gradesAssignedPercent: (gradesAssigned + gradesPending) ? Math.round(gradesAssigned / (gradesAssigned + gradesPending) * 100) : 0

        };
    }
};

export default taskService;