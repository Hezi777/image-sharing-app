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

const AppShell: React.FC = () => {
  // mount axios auth interceptor once when app loads
  useAxiosAuth();
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
