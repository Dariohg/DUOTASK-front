const attendanceService = {
    // Obtener todas las asistencias de un alumno en un grupo específico
    getAttendancesByStudent: async (groupId, studentId, filterMonth = "all") => {
        const attendances = JSON.parse(localStorage.getItem('attendances')) || [];

        let filteredAttendances = attendances.filter(attendance => 
            String(attendance.idGrupo) === String(groupId) && String(attendance.idAlumno) === String(studentId)
        );

        if (filterMonth !== "all") {
            filteredAttendances = filteredAttendances.filter(attendance => {
                const attendanceDate = new Date(attendance.fecha);
        
                return attendanceDate.getMonth() + 1 === parseInt(filterMonth);
            });
        }

        filteredAttendances.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        return filteredAttendances;
    },

    getAttendanceCountsByStudent: async (groupId, studentId) => {
        const attendances = await attendanceService.getAttendancesByStudent(groupId, studentId);

        // Contadores de Asistencias, Faltas y Permisos
        let asistencias = 0;
        let faltas = 0;
        let permisos = 0;

        attendances.forEach(attendance => {
            if (attendance.asistencia === 'asistencia') asistencias++;
            if (attendance.asistencia === 'falta') faltas++;
            if (attendance.asistencia === 'permiso') permisos++;
        });

        return { asistencias, faltas, permisos };
    },  
    
    updateAttendance: async (attendanceId, newStatusObj) => {
        // Obtener asistencias desde localStorage
        const attendances = JSON.parse(localStorage.getItem('attendances')) || [];
        
        // Buscar el índice del registro a actualizar
        const attendanceIndex = attendances.findIndex(attendance => attendance.id === attendanceId);
    
        if (attendanceIndex !== -1) {
            // Asignar el nuevo estado de asistencia correctamente
            attendances[attendanceIndex].asistencia = newStatusObj.status;
    
            // Guardar la lista actualizada en localStorage
            localStorage.setItem('attendances', JSON.stringify(attendances));
    
            // Retornar el objeto actualizado
            return { ...attendances[attendanceIndex] };
        }
    
        throw new Error('⚠️ Asistencia no encontrada');
    },
    

    // Crear o actualizar una asistencia
    createOrUpdateAttendance: async (groupId, studentId, attendanceStatus, date) => {
        const attendances = JSON.parse(localStorage.getItem('attendances')) || [];

        // Buscar si ya existe una asistencia para este estudiante en la misma fecha
        const existingAttendanceIndex = attendances.findIndex(attendance => 
            attendance.idGrupo === groupId && 
            attendance.idAlumno === studentId && 
            attendance.fecha.split('T')[0] === date
        );

        if (existingAttendanceIndex !== -1) {
            // Si ya existe, actualizamos el estado de asistencia
            attendances[existingAttendanceIndex].asistencia = attendanceStatus;
        } else {
            // Si no existe, creamos una nueva asistencia
            const newAttendance = {
                id: generateId(),
                idGrupo: groupId,
                idAlumno: studentId,
                asistencia: attendanceStatus,
                fecha: date
            };
            attendances.push(newAttendance);
        }

        // Guardar los cambios en localStorage
        localStorage.setItem('attendances', JSON.stringify(attendances));

        return attendances;
    }
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default attendanceService;
