import { Box, Typography } from '@mui/material';

export default function EmptyState() {
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Typography variant="h6" color="textSecondary">
        No images yet. Upload one!
      </Typography>
    </Box>
  );
} 