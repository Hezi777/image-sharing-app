import { Box, Button, TextField } from '@mui/material';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
};

export default function CommentInput({ value, onChange, onSubmit }: Props) {
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