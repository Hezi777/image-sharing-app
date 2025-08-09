import { Theme } from '@mui/material/styles';

export const glassStyle = (theme: Theme) => ({
  borderRadius: 4,
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.6)'
    : 'rgba(255, 255, 255, 0.4)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(12px) saturate(150%)',
  WebkitBackdropFilter: 'blur(12px) saturate(150%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
});
