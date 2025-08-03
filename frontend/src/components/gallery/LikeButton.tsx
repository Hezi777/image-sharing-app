import { Box, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

type Props = {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
};

export default function LikeButton({ isLiked, likeCount, onLike }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <IconButton 
        onClick={onLike} 
        sx={{ p: 0.5 }} 
        color={isLiked ? "error" : "default"}
      >
        {isLiked ? 
          <Favorite sx={{ fontSize: 24 }} /> : 
          <FavoriteBorder sx={{ fontSize: 24 }} />
        }
      </IconButton>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '14px' }}>
        {likeCount} likes
      </Typography>
    </Box>
  );
} 