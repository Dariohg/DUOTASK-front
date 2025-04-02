import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./presentation/theme";

import LandingPage from "./presentation/pages/LandingPage";
import Login from "./presentation/pages/auth/Login";
import Register from "./presentation/pages/auth/Register";
import Dashboard from "./presentation/pages/Dashboard.jsx";
import StudentDetail from "./presentation/pages/students/StudentDetail.jsx";

import MainLayout from "./presentation/layouts/MainLayout";

import { AuthProvider } from "./presentation/contexts/AuthContext";
import Calendar from "./presentation/pages/Calendar.jsx";
import ClassesPage from "./presentation/pages/classes/index.jsx";
import GroupDetail from "./presentation/pages/classes/GroupDetail.jsx";
import GroupAttendance from "./presentation/pages/classes/GroupAttendance.jsx"; // Nueva importación
import TaskGrades from "./presentation/pages/tasks/TaskGrades.jsx";
import TasksPage from "./presentation/pages/tasks/index.jsx";

import AttendanceIndex from "./presentation/pages/attendanceHistory/index.jsx";
import StudentList from "./presentation/pages/attendanceHistory/StudentList.jsx";
import StudentDetails from "./presentation/pages/attendanceHistory/StudentDetail.jsx";

function App() {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Router>
                    <AuthProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route path="/app" element={<MainLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="students" element={<div>Estudiantes (Próximamente)</div>} />
                                <Route path="students/:studentId" element={<StudentDetail />} />
                                <Route path="classes" element={<ClassesPage />} />
                                <Route path="classes/:groupId" element={<GroupDetail />} />
                                <Route path="classes/:groupId/attendance" element={<GroupAttendance />} /> {/* Nueva ruta */}
                                <Route path="tasks" element={<TasksPage />} />
                                <Route path="tasks/:taskId/grades" element={<TaskGrades />} />
                                <Route path="calendar" element={<Calendar />} />

                                <Route path="attendance" element={<AttendanceIndex />} />
                                <Route path="attendance/:groupId" element={<StudentList />} />
                                <Route path="attendance/:groupId/:studentId" element={<StudentDetails />} />

                                {/* Redirect to dashboard if no route matches */}
                                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                            </Route>
                        </Routes>
                    </AuthProvider>
                </Router>
            </ChakraProvider>
        </>
    );
}

export default App;