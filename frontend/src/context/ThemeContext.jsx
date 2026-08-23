import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // MUI Theme Configurations
  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'light' ? '#ff7a00' : '#ff9800',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#3d2314',
      },
      background: {
        default: themeMode === 'light' ? '#fdfbf7' : '#121212',
        paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: themeMode === 'light' ? '#222222' : '#e0e0e0',
        secondary: themeMode === 'light' ? '#666666' : '#aaaaaa',
      },
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
