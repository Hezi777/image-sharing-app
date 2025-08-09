import React, { useEffect } from 'react';
import { Box, IconButton, Paper, Avatar, useTheme } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../providers/SearchProvider';
import { useAuth } from '../providers/AuthProvider';
import { glassStyle } from '../../styles/glassStyle';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSearch, setShowSearch } = useSearch();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  useEffect(() => setShowSearch(false), [location.pathname, setShowSearch]);

  const goHome = () => navigate('/');
  const goUpload = () => (isAuthenticated ? navigate('/upload') : navigate('/login'));
  const toggleSearch = () => setShowSearch(!showSearch);
  const goProfile = () => navigate(isAuthenticated ? '/profile' : '/login');

  return (
    <Paper
      elevation={0}
      sx={{
        ...glassStyle(theme),
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        px: 1,
        py: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={goHome} sx={{ color: location.pathname === '/' ? theme.palette.primary.main : theme.palette.text.secondary, p: 1 }}>
          <HomeIcon />
        </IconButton>

        <IconButton
          onMouseDown={(e) => { e.preventDefault(); toggleSearch(); }}
          sx={{ color: showSearch ? theme.palette.primary.main : theme.palette.text.secondary, p: 1 }}
        >
          <SearchIcon />
        </IconButton>

        <IconButton onClick={goUpload} sx={{ color: location.pathname === '/upload' ? theme.palette.primary.main : theme.palette.text.secondary, p: 1 }}>
          <AddIcon />
        </IconButton>

        <IconButton onClick={goProfile} sx={{ p: 0, borderRadius: '50%', border: location.pathname === '/profile' ? `2px solid ${theme.palette.primary.main}` : 'none' }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: isAuthenticated ? theme.palette.primary.main : theme.palette.text.secondary, fontSize: '14px', fontWeight: 600 }}>
            {isAuthenticated ? user?.username?.[0]?.toUpperCase() ?? '?' : '?'}
          </Avatar>
        </IconButton>
      </Box>
    </Paper>
  );
};
