import { Box, Button, TextField, Typography } from '@mui/material';

// Type definition for the props of CommentInput component
type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isAuthenticated?: boolean;
};

export default function CommentInput({ value, onChange, onSubmit, isAuthenticated = true }: Props) {
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ textAlign: 'center', fontStyle: 'italic' }}
        >
          Log in to add a comment
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="standard"
          placeholder="Add a comment..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          sx={{
            flexGrow: 1,
            '& .MuiInput-root': {
              fontSize: '14px',
              '&:before': { borderBottom: 'none' },
              '&:after': { borderBottom: 'none' },
              '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
            },
          }}
        />
        <Button
          onClick={onSubmit}
          disabled={!value}
          sx={{
            color: value ? '#0095f6' : '#b3dbf7',
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            minWidth: 'auto',
            p: 0,
          }}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
} 