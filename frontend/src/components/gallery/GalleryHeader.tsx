import { Typography } from '@mui/material';

export default function GalleryHeader() {
  return (
    <Typography 
      align="center" 
      variant="h4" 
      fontWeight={700} 
      sx={{ 
        mb: 3, 
        background: 'linear-gradient(45deg, #0575E6, #021B79)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent' 
      }}
    >
      Image Gallery
    </Typography>
  );
} 