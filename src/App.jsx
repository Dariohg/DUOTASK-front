import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./presentation/theme";

// Pages
import LandingPage from "./presentation/pages/LandingPage";
import Login from "./presentation/pages/auth/Login";
import Register from "./presentation/pages/auth/Register";
import Dashboard from "./presentation/pages/Dashboard";

// Layouts
import MainLayout from "./presentation/layouts/MainLayout";

// Context
import { AuthProvider } from "./presentation/contexts/AuthContext";

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
                                <Route path="classes" element={<div>Clases (Próximamente)</div>} />

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