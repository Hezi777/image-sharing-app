// Main App component - sets up React context providers and routing for image sharing app
// Wraps app with theme, auth, search providers and React Router for navigation

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeModeProvider } from './components/providers/ThemeModeProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { SearchProvider } from './components/providers/SearchProvider';
import { BottomNav } from './components/layout/BottomNav';
import { ThemeToggleFAB } from './components/layout/ThemeToggleFAB';
import { AppRoutes } from './components/routes/AppRoutes';
import { useAxiosAuth } from './components/hooks/useAxiosAuth';

// App shell component - renders main layout with navigation and routes
const AppShell: React.FC = () => {
  useAxiosAuth(); // Set up axios interceptors for JWT token handling
  return (
    <>
      <BottomNav />
      <Box sx={{ pb: 8 }}>
        <AppRoutes />
      </Box>
      <ThemeToggleFAB />
    </>
  );
};

// Root App component - wraps everything in context providers
export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <SearchProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </SearchProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
