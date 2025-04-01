/**
 * Mock API client para desarrollo
 *
 * Este cliente simula solicitudes al backend utilizando localStorage.
 * En un entorno real, se reemplazaría con Axios u otra biblioteca HTTP.
 */

import groupService from '../../services/api/groupService';
import studentService from '../../services/api/studentService';

// Simulación de retrasos de red para una experiencia más realista
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const apiClient = {
    /**
     * Simula una solicitud GET
     * @param {string} url - Ruta de la API
     * @returns {Promise<Object>} - Respuesta simulada
     */
    async get(url) {
        // Simular retraso de red
        await delay(300);

        // Analizar la URL para determinar el recurso solicitado
        if (url === '/grupos') {
            const groups = await groupService.getGroups();
            return { data: groups };
        }

        if (url.startsWith('/grupos/')) {
            const groupId = url.split('/')[2];
            const group = await groupService.getGroupById(groupId);
            return { data: group };
        }

        if (url === '/estudiantes') {
            const students = await studentService.getStudents();
            return { data: students };
        }

        if (url.startsWith('/estudiantes/')) {
            const studentId = url.split('/')[2];
            const student = await studentService.getStudentById(studentId);
            return { data: student };
        }

        // Si no se reconoce la URL, lanzar error
        throw new Error(`Recurso no encontrado: ${url}`);
    },

    /**
     * Simula una solicitud POST
     * @param {string} url - Ruta de la API
     * @param {Object} data - Datos a enviar
     * @returns {Promise<Object>} - Respuesta simulada
     */
    async post(url, data) {
        // Simular retraso de red
        await delay(500);

        // Analizar la URL para determinar el recurso al que se está enviando
        if (url === '/grupos') {
            const newGroup = await groupService.createGroup(data);
            return { data: newGroup };
        }

        if (url === '/estudiantes') {
            const newStudent = await studentService.createStudent(data);
            return { data: newStudent };
        }

        // Si no se reconoce la URL, lanzar error
        throw new Error(`No se puede crear en: ${url}`);
    },

    /**
     * Simula una solicitud PUT
     * @param {string} url - Ruta de la API
     * @param {Object} data - Datos actualizados
     * @returns {Promise<Object>} - Respuesta simulada
     */
    async put(url, data) {
        // Simular retraso de red
        await delay(400);

        // Analizar la URL para determinar qué recurso actualizar
        if (url.startsWith('/grupos/')) {
            const groupId = url.split('/')[2];
            const updatedGroup = await groupService.updateGroup(groupId, data);
            return { data: updatedGroup };
        }

        if (url.startsWith('/estudiantes/')) {
            const studentId = url.split('/')[2];
            const updatedStudent = await studentService.updateStudent(studentId, data);
            return { data: updatedStudent };
        }

        // Si no se reconoce la URL, lanzar error
        throw new Error(`No se puede actualizar: ${url}`);
    },

    /**
     * Simula una solicitud DELETE
     * @param {string} url - Ruta de la API
     * @returns {Promise<Object>} - Respuesta simulada
     */
    async delete(url) {
        // Simular retraso de red
        await delay(400);

        // Analizar la URL para determinar qué recurso eliminar
        if (url.startsWith('/grupos/')) {
            const groupId = url.split('/')[2];
            await groupService.deleteGroup(groupId);
            return { data: true };
        }

        if (url.startsWith('/estudiantes/')) {
            const studentId = url.split('/')[2];
            await studentService.deleteStudent(studentId);
            return { data: true };
        }

        // Si no se reconoce la URL, lanzar error
        throw new Error(`No se puede eliminar: ${url}`);
    }
};

export default apiClient;