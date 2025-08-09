import React from 'react';
import { Paper, IconButton, useTheme } from '@mui/material';
import { DarkMode as DarkIcon, LightMode as LightIcon } from '@mui/icons-material';
import { useThemeMode } from '../providers/ThemeModeProvider';
import { glassStyle } from '../../styles/glassStyle';

export const ThemeToggleFAB: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        ...glassStyle(theme),
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        p: 0.5,
      }}
    >
      <IconButton onClick={toggleDarkMode} sx={{ p: 1 }}>
        {darkMode ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Paper>
  );
};
