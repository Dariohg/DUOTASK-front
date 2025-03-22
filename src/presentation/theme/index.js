import { extendTheme } from "@chakra-ui/react";

// Paleta de colores para tema oscuro
const colors = {
    brand: {
        50: "#E3F2FD",
        100: "#BBDEFB",
        200: "#90CAF9",
        300: "#64B5F6",
        400: "#42A5F5",
        500: "#2196F3", // Color principal (azul)
        600: "#1E88E5",
        700: "#1976D2",
        800: "#1565C0",
        900: "#0D47A1",
    },
    accent: {
        50: "#F3E5F5",
        100: "#E1BEE7",
        200: "#CE93D8",
        300: "#BA68C8",
        400: "#AB47BC",
        500: "#9C27B0", // Color de acento (púrpura)
        600: "#8E24AA",
        700: "#7B1FA2",
        800: "#6A1B9A",
        900: "#4A148C",
    },
    background: {
        primary: "#121212", // Fondo principal
        secondary: "#1E1E1E", // Componentes y tarjetas
        tertiary: "#2D2D2D", // Elementos interactivos
        card: "#252525", // Fondo de tarjetas más oscuro
    },
    text: {
        primary: "#FFFFFF", // Texto principal
        secondary: "rgba(255, 255, 255, 0.7)", // Texto secundario
        disabled: "rgba(255, 255, 255, 0.5)", // Texto deshabilitado
        hint: "rgba(255, 255, 255, 0.5)", // Pistas/ayudas
    },
    success: {
        500: "#4CAF50", // Verde para éxito
    },
    error: {
        500: "#F44336", // Rojo para errores
    },
    warning: {
        500: "#FF9800", // Naranja para advertencias
    },
    info: {
        500: "#2196F3", // Azul para información
    },
};

const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    colors,
    fonts: {
        heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    },
    styles: {
        global: {
            body: {
                bg: "background.primary",
                color: "text.primary",
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "500",
                borderRadius: "md",
                _focus: {
                    boxShadow: "none",
                },
            },
            variants: {
                primary: {
                    bg: "brand.500",
                    color: "white",
                    _hover: {
                        bg: "brand.600",
                        _disabled: {
                            bg: "brand.500",
                        },
                    },
                    _active: { bg: "brand.700" },
                },
                secondary: {
                    bg: "transparent",
                    color: "brand.500",
                    border: "1px solid",
                    borderColor: "brand.500",
                    _hover: {
                        bg: "rgba(33, 150, 243, 0.08)",
                    },
                    _active: { bg: "rgba(33, 150, 243, 0.12)" },
                },
                accent: {
                    bg: "accent.500",
                    color: "white",
                    _hover: {
                        bg: "accent.600",
                        _disabled: {
                            bg: "accent.500",
                        },
                    },
                    _active: { bg: "accent.700" },
                },
                ghost: {
                    color: "text.primary",
                    _hover: {
                        bg: "rgba(255, 255, 255, 0.08)",
                    },
                    _active: {
                        bg: "rgba(255, 255, 255, 0.12)",
                    },
                },
            },
            defaultProps: {
                variant: "primary",
            },
        },
        Input: {
            variants: {
                outline: {
                    field: {
                        bg: "background.secondary",
                        borderColor: "rgba(255, 255, 255, 0.16)",
                        _hover: {
                            borderColor: "rgba(255, 255, 255, 0.24)",
                        },
                        _focus: {
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        },
                    },
                },
                filled: {
                    field: {
                        bg: "background.tertiary",
                        _hover: {
                            bg: "rgba(255, 255, 255, 0.08)",
                        },
                        _focus: {
                            bg: "rgba(255, 255, 255, 0.08)",
                            borderColor: "brand.500",
                        },
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    bg: "background.secondary",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                },
                item: {
                    bg: "background.secondary",
                    _hover: {
                        bg: "rgba(255, 255, 255, 0.08)",
                    },
                    _focus: {
                        bg: "rgba(255, 255, 255, 0.08)",
                    },
                },
            },
        },
        Modal: {
            baseStyle: {
                dialog: {
                    bg: "background.secondary",
                    borderRadius: "lg",
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: "background.card",
                    borderRadius: "lg",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    borderWidth: "1px",
                    borderColor: "rgba(255, 255, 255, 0.05)",
                },
            },
        },
        Drawer: {
            baseStyle: {
                dialog: {
                    bg: "background.secondary",
                },
            },
        },
        Tooltip: {
            baseStyle: {
                bg: "background.tertiary",
                color: "text.primary",
            },
        },
    },
});

export default theme;