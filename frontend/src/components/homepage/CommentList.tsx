import { Box, Typography } from '@mui/material';

type Comment = { 
  text: string; 
  createdAt?: string;
  user: { id: number; username: string };
};

type Props = {
  comments: Comment[];
};

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 1 }}>
      {comments.map((comment, idx) => (
        <Typography key={idx} variant="body2" sx={{ fontSize: '14px', mb: 0.5 }}>
          <span style={{ fontWeight: 600, marginRight: 8 }}>{comment.user.username}</span>
          {comment.text}
        </Typography>
      ))}
    </Box>
  );
} 