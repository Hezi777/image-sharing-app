// Upload page component that allows users to upload images to the server
// Provides drag-and-drop functionality, file preview, and upload progress feedback

import { useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Stack,
  Input,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Upload page component with drag-and-drop file upload functionality
// 
// Features:
// - Drag and drop file upload
// - File preview before upload
// - Upload progress indication
// - Form validation and error handling
// - Modern UI with Material-UI components
export default function UploadPage() {
  // State management for file upload process
  const [file, setFile] = useState<File | null>(null); // Currently selected file
  const [preview, setPreview] = useState<string>(''); // File preview URL
  const [uploading, setUploading] = useState(false); // Upload progress state
  const dropRef = useRef<HTMLDivElement>(null); // Reference to drop zone element

  // Handle file selection and create preview URL
  // Sets the selected file and creates an object URL for preview
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f)); // Create preview URL for the file
  };

  // Handle file selection from file input
  // Triggered when user clicks browse button or selects file from dialog
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle drag over event on drop zone
  // Prevents default behavior and adds visual feedback
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add('dragover'); // Add visual feedback class
  };

  // Handle drag leave event on drop zone
  // Removes visual feedback when file is dragged away
  const handleDragLeave = () => {
    dropRef.current?.classList.remove('dragover'); // Remove visual feedback class
  };

  // Handle file drop event on drop zone
  // Processes the dropped file and creates preview
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Upload the selected file to the server
  // Creates FormData, sends POST request, and handles response
  const uploadImage = async () => {
    if (!file) return;
    
    setUploading(true); // Start upload process
    
    // Create FormData for file upload
    const form = new FormData();
    form.append('file', file);
    
    // Send upload request to backend
    await axios.post('/images/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    setUploading(false); // End upload process
    
    // Reset form state after successful upload
    setPreview('');
    setFile(null);
    
    // Clear the file input to allow re-uploading the same file
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    alert('Upload successful!');
  };

  return (
    <Box maxWidth={600} mx="auto" mt={8}>
      {/* Main upload container with card styling */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 5, textAlign: 'center' }}>
        {/* Page title with gradient styling */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3, background: 'linear-gradient(45deg, #0575E6, #021B79)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Upload Your Image
        </Typography>

        {/* Drag and drop zone */}
        <Box
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          sx={{
            border: '3px dashed #e0e0e0',
            borderRadius: 2,
            p: 5,
            cursor: 'pointer',
            background: '#fafafa',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#667eea',
              background: 'hsla(212, 95%, 46%, 0.05)',
              transform: 'scale(1.02)', 
            },
          }}
        >
          {/* Drop zone content */}
          <Typography variant="h3" color="textSecondary">☁️</Typography>
          <Typography variant="h6">Drop your image here or click to browse</Typography>
          <Typography variant="body2">Supports JPG, PNG, GIF up to 10MB</Typography>
        </Box>

        {/* Hidden file input for programmatic file selection */}
        <Input
          type="file"
          inputProps={{ accept: 'image/*' }}
          id="file-input"
          sx={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* File preview section - shown when file is selected */}
        {preview && (
          <Box mt={4}>
            <Typography variant="h6">Preview:</Typography>
            <Box component="img" src={preview} alt="Preview" sx={{ width: '100%', maxHeight: 300, borderRadius: 2, boxShadow: 3, my: 2 }} />
            <Typography>{file?.name}</Typography>
          </Box>
        )}

        {/* Upload button with dynamic behavior */}
        <Stack direction="row" justifyContent="center" mt={4}>
        <Button
            variant="contained"
            color="primary"
            startIcon={!file ? <CloudUploadIcon /> : null}
            onClick={() =>
              !file
                ? document.getElementById('file-input')?.click() // Open file dialog if no file selected
                : uploadImage() // Upload file if file is selected
            }
            disabled={uploading}
            sx={{
              // Pill shape + sizing
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,

              // Initial gradient fill + shadow
              background: 'linear-gradient(45deg, #0575E6, #021B79)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(5,117,230,0.4)',

              // Smooth transitions
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',

              // Keep icon color in sync
              '& .MuiButton-startIcon': {
                color: 'inherit',
              },

              '&:hover': {
                // Flip gradient + lift up + stronger shadow
                background: 'linear-gradient(45deg, #021B79, #0575E6)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(2,27,121,0.5)',
              },
              '&:active': {
                // Slight press-down feedback
                transform: 'translateY(0)',
                boxShadow: '0 4px 14px rgba(2,27,121,0.4)',
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : !file ? (
              '📁 Select Image'
            ) : (
              '📤 Upload Image'
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
