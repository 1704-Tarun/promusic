import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {
        background: { default: '#181a20', paper: '#23272f' },
        primary: { main: '#1ed760' },
        text: { primary: '#fff' },
      } : {
        background: { default: '#f5f5f5', paper: '#fff' },
        primary: { main: '#1ed760' },
        text: { primary: '#181a20' },
      })
    },
    typography: {
      fontFamily: 'Inter, Arial, sans-serif',
    },
  }), [mode]);

  const toggleTheme = () => setMode(m => m === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
} 