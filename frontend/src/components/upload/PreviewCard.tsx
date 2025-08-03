import { Box, Typography } from '@mui/material';

type Props = {
  preview: string;
  file: File | null;
};

export default function PreviewCard({ preview, file }: Props) {
  if (!preview || !file) return null;

  return (
    <Box
      mt={4}
      sx={{
        display: 'inline-block',
        maxWidth: 200,
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
        bgcolor: 'white',
      }}
    >
      <Box
        component="img"
        src={preview}
        alt="Preview"
        sx={{
          width: '100%',
          height: 140,
          objectFit: 'cover',
        }}
      />

      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="body2"
          noWrap
          sx={{ fontWeight: 500 }}
          title={file.name}
        >
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(file.size / 1024).toFixed(2)} KB
        </Typography>
      </Box>
    </Box>
  );
} 