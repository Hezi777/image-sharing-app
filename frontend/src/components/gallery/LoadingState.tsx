import { Box, Skeleton, Paper } from '@mui/material';

export default function LoadingState() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {[1, 2, 3].map((index) => (
        <Paper 
          key={index}
          elevation={3} 
          sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#ffffff' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>
          
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={400}
            sx={{ bgcolor: '#fafafa' }}
          />
          
          <Box sx={{ p: 1.5 }}>
            <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
} 