import { Button, CircularProgress, Stack } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
  file: File | null;
  uploading: boolean;
  onSelectFile: () => void;
  onUpload: () => void;
};

export default function UploadButton({ file, uploading, onSelectFile, onUpload }: Props) {
  return (
    <Stack direction="row" justifyContent="center" mt={4}>
      <Button
        variant="contained"
        color="primary"
        startIcon={!file ? <ImageIcon /> : null}
        onClick={() => (!file ? onSelectFile() : onUpload())}
        disabled={uploading}
        sx={{
          borderRadius: '50px',
          px: 4,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(45deg, #0575E6, #021B79)',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(5,117,230,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
          '& .MuiButton-startIcon': { color: 'inherit' },
          '&:hover': {
            background: 'linear-gradient(45deg, #021B79, #0575E6)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(2,27,121,0.5)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 14px rgba(2,27,121,0.4)',
          },
        }}
      >
        {uploading ? (
          <CircularProgress size={20} sx={{ color: 'white' }} />
        ) : !file ? (
          'Select Image'
        ) : (
          '📤 Upload Image'
        )}
      </Button>
    </Stack>
  );
} 