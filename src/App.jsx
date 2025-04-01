import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./presentation/theme";

import LandingPage from "./presentation/pages/LandingPage";
import Login from "./presentation/pages/auth/Login";
import Register from "./presentation/pages/auth/Register";
import Dashboard from "./presentation/pages/Dashboard.jsx";

import MainLayout from "./presentation/layouts/MainLayout";

import { AuthProvider } from "./presentation/contexts/AuthContext";
import Calendar from "./presentation/pages/Calendar.jsx";
import ClassesPage from "./presentation/pages/classes/index.jsx";
import GroupDetail from "./presentation/pages/classes/GroupDetail.jsx";
import TaskGrades from "./presentation/pages/tasks/TaskGrades.jsx";
import TasksPage from "./presentation/pages/tasks/index.jsx";

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
                                <Route path="tasks" element={<div>Tareas (Próximamente)</div>} />
                                <Route path="classes" element={<ClassesPage />} />
                                <Route path="classes/:groupId" element={<GroupDetail />} />
                                <Route path="tasks" element={<TasksPage />} />
                                <Route path="tasks/:taskId/grades" element={<TaskGrades />} />
                                <Route path="calendar" element={<Calendar />} />


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