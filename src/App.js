import React, { useEffect, useState } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { useStore } from '@nanostores/react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Analysis from './components/Analysis';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { authStore } from './stores/authStore';
import TourGuide from './components/TourGuide';
import { darkTheme, lightTheme } from './theme';
import SupportPage from './components/SupportPage';
import BudgetAlert from './components/BudgetAlert';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import TransactionList from './components/TransactionList';
import NotificationPopup from './components/NotificationPopup';
import ForgotPasswordPage from './components/ForgotPasswordPage';

import 'shepherd.js/dist/css/shepherd.css';
function App() {
  const auth = useStore(authStore); // Get authentication status from auth store

  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Use effect to apply theme on load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Apply the correct baseline for the theme */}
      <Router>
        <TourGuide />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Ensures footer is at the bottom
          }}
        >
          <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <Container sx={{ flex: 1, py: 4 }}>
            <BudgetAlert /> {/* Mostrar BudgetAlert aquí */}
            <NotificationPopup />
            <Routes>
              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute isAuthenticated={auth.isAuthenticated} />
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<SupportPage />} />
              </Route>

              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
          </Container>
          <Footer /> {/* Always stick footer to the bottom */}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
