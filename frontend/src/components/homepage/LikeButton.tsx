import { Box, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

type Props = {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
};

export default function LikeButton({ isLiked, likeCount, onLike }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <IconButton 
        onClick={onLike} 
        sx={{
          p: 0,
          m: 0,
          minWidth: 0,
          width: 24,
          height: 24,
          ml: 0,
          mr: 0,
        }}
        color={isLiked ? "error" : "default"}
      >
        {isLiked ? 
          <Favorite sx={{ fontSize: 24 }} /> : 
          <FavoriteBorder sx={{ fontSize: 24 }} />
        }
      </IconButton>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </Typography>
    </Box>
  );
} 