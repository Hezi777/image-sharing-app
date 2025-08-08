import { Typography, Box, useTheme } from '@mui/material';

interface GalleryHeaderProps {
  centered?: boolean;
}

export default function GalleryHeader({ centered = false }: GalleryHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...(centered
          ? {
              width: '100%',                // fill horizontal space
              display: 'flex',
              justifyContent: 'center',    // center horizontally
              alignItems: 'center',
              py: 2,                        // some vertical padding
            }
          : {
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
            }),
        gap: centered ? 2 : 1,
      }}
    >
      <img
        src="/Lumia-Logo.png"
        alt="Lumia Logo"
        style={{
          width: centered ? 48 : 32,
          height: centered ? 48 : 32,
        }}
      />
      <Typography
        variant={centered ? 'h3' : 'h5'}
        fontWeight={700}
        sx={{
          color: theme.palette.text.primary,
          textShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 4px rgba(255,255,255,0.1)'
              : '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        Lumia
      </Typography>
    </Box>
  );
}
