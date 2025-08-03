import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import DropZone from '../components/upload/DropZone';
import PreviewCard from '../components/upload/PreviewCard';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

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

    await axios.post('/images/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setUploading(false);
    setPreview('');
    setFile(null);

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    alert('Upload successful!');
  };

  return (
    <Box maxWidth={600} mx="auto" mt={8}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
          backgroundColor: '#fcfcfc',
          userSelect: 'none',
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

        <DropZone 
          onFileSelect={handleFileSelect} 
          file={file} 
          uploading={uploading}
          onSelectFile={handleSelectFile}
          onUpload={uploadImage}
        />

        <PreviewCard preview={preview} file={file} />
      </Paper>
    </Box>
  );
}
