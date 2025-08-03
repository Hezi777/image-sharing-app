import { Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useRef } from 'react';
import UploadButton from './UploadButton';

type Props = {
  onFileSelect: (file: File) => void;
  file: File | null;
  uploading: boolean;
  onSelectFile: () => void;
  onUpload: () => void;
};

export default function DropZone({ onFileSelect, file, uploading, onSelectFile, onUpload }: Props) {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = (f: File) => {
    onFileSelect(f);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add('dragover');
  };

  const handleDragLeave = () => {
    dropRef.current?.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box
      ref={dropRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: '3px dashed #e0e0e0',
        borderRadius: 2,
        p: 5,
        background: '#fafafa',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #e0ecff, #f5f7fa)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <ImageIcon sx={{ fontSize: 36, color: '#1976d2' }} />
      </Box>
             <Typography variant="h6">Drop your image here or click to browse</Typography>
       <Typography variant="body2">Supports JPG, PNG, GIF up to 10MB</Typography>

       <UploadButton
         file={file}
         uploading={uploading}
         onSelectFile={onSelectFile}
         onUpload={onUpload}
       />

       <input
         type="file"
         accept="image/*"
         id="file-input"
         style={{ display: 'none' }}
         onChange={handleFileSelect}
       />
     </Box>
   );
 } 