import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

// Mevcut tema yapılandırmanızı koruyarak gece modu desteği ekleyelim
const App = () => {
  const [mode, setMode] = useState('light');
  
  // Kullanıcı tercihini localStorage'dan al
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) {
        setMode(savedMode);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setMode('dark');
      }
    } catch (error) {
      console.error('Tema tercihi alınırken hata oluştu:', error);
    }
  }, []);
  
  // Tema değiştirme fonksiyonu
  const toggleThemeMode = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      localStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Tema değiştirilirken hata oluştu:', error);
    }
  };
  
  // Tema yapılandırması
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#7E57C2',
        light: '#B085F5',
        dark: '#4D2C91',
      },
      secondary: {
        main: '#64B5F6',
        light: '#9BE7FF',
        dark: '#2286C3',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
  });
  
  // ThemeContext'i App bileşenine ekleyelim
  const themeContextValue = {
    mode,
    toggleThemeMode,
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login themeContext={themeContextValue} />} />
          <Route path="/register" element={<Register themeContext={themeContextValue} />} />
          <Route path="/dashboard" element={<Dashboard themeContext={themeContextValue} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;