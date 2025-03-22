import React from 'react';
import {
    FiSearch,
    FiMenu,
    FiBell,
    FiEye,
    FiEyeOff,
    FiChevronDown,
    FiChevronRight
} from 'react-icons/fi';

export const SearchIcon = FiSearch;
export const HamburgerIcon = FiMenu;
export const BellIcon = FiBell;
export const ViewIcon = FiEye;
export const ViewOffIcon = FiEyeOff;
export const ChevronDownIcon = FiChevronDown;
export const ChevronRightIcon = FiChevronRight;

export const Spinner = (props) => {
    return (
        <div
            style={{
                display: 'inline-block',
                borderRadius: '50%',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                animation: 'spin 0.6s linear infinite',
                width: '1em',
                height: '1em',
                ...props.style
            }}
        />
    );
};

if (!document.getElementById('spin-animation')) {
    const style = document.createElement('style');
    style.id = 'spin-animation';
    style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);
}

// Exportar un componente Icon genérico
export const Icon = ({ icon, ...props }) => {
    const IconComponent = icon;
    return <IconComponent {...props} />;
};

