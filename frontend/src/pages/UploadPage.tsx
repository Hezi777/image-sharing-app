import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  useTheme,
  Container,
} from '@mui/material';
import DropZone from '../components/upload/DropZone';
import PreviewCard from '../components/upload/PreviewCard';
import GalleryHeader from '../components/homepage/GalleryHeader';

export default function UploadPage() {
  const theme = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSelectFile = () => {
    document.getElementById('file-input')?.click();
  };

  const uploadImage = async () => {
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append('file', file);
    if (description.trim()) {
      form.append('description', description.trim());
    }

    await axios.post('/images/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setUploading(false);
    setPreview('');
    setFile(null);
    setDescription('');

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    alert('Upload successful!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: 2,
        userSelect: 'none',
      }}
    >
      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <GalleryHeader />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 3,
              background: 'linear-gradient(45deg, #0575E6, #021B79)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Upload Your Image
          </Typography>

          {user && (
            <Typography
              variant="body1"
              sx={{ mb: 3, color: theme.palette.text.secondary }}
            >
              Posting as <strong>{user.username}</strong>
            </Typography>
          )}

          <DropZone
            onFileSelect={handleFileSelect}
            file={file}
            uploading={uploading}
            onSelectFile={handleSelectFile}
            onUpload={uploadImage}
          />

          <PreviewCard preview={preview} file={file} />

          {preview && (
            <Box mt={3}>
              <TextField
                label="Description"
                placeholder="Say something about this post..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
