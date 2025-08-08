import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import DropZone from '../components/upload/DropZone';
import PreviewCard from '../components/upload/PreviewCard';
import GalleryHeader from '../components/homepage/GalleryHeader';

export default function UploadPage() {
  const theme = useTheme();
  
  // State for file upload process
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle file selection and create preview
  const handleFileSelect = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Trigger hidden file input
  const handleSelectFile = () => {
    document.getElementById('file-input')?.click();
  };

  // Upload file to server
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

    // Clear file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    alert('Upload successful!');
  };

  return (
    <Box 
      maxWidth={600} 
      mx="auto" 
      mt={8}
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: 2,
        userSelect: 'none',
      }}
    >
      <GalleryHeader />
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
          background: theme.palette.background.paper,
          userSelect: 'none',
        }}
      >
        {/* Page title */}
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

        {/* User info */}
        {user && (
          <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            Posting as <strong>{user.username}</strong>
          </Typography>
        )}

        {/* File drop zone */}
        <DropZone 
          onFileSelect={handleFileSelect} 
          file={file} 
          uploading={uploading}
          onSelectFile={handleSelectFile}
          onUpload={uploadImage}
        />

        {/* Image preview */}
        <PreviewCard preview={preview} file={file} />

        {/* Description input */}
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
    </Box>
  );
}
