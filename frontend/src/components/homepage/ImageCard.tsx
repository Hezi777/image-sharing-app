import {
    Avatar,
    Box,
    CardMedia,
    Divider,
    Typography,
    Paper,
    useTheme,
  } from '@mui/material';
  import CommentList from './CommentList';
  import CommentInput from './CommentInput';
  import LikeButton from './LikeButton';
  import Button from '@mui/material/Button';

  type Comment = { 
    text: string; 
    createdAt?: string;
    user: { id: number; username: string };
  };
  
  type Image = {
    id: number;
    filename: string;
    originalName?: string;
    url: string;
    description?: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
    uploader: { id: number; username: string };
  };
  
  type Props = {
    image: Image;
    liked: boolean;
    newComment: string;
    onLike: (id: number) => void;
    onCommentChange: (id: number, text: string) => void;
    onCommentSubmit: (id: number) => void;
    formatTimeAgo: (dateString: string) => string;
    onDelete: (id: number) => void;
    isAuthenticated: boolean;
    currentUserId?: number;
  };
  
  export default function ImageCard({
    image,
    liked,
    newComment,
    onLike,
    onCommentChange,
    onCommentSubmit,
    formatTimeAgo,
    onDelete,
    isAuthenticated,
    currentUserId,
  }: Props) {
    const theme = useTheme();
    const isOwner = isAuthenticated && currentUserId === image.uploader.id;
    
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          background: theme.palette.background.paper 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#0095f6', fontSize: '14px', fontWeight: 600 }}>
              {image.uploader.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
              {image.uploader.username}
            </Typography>
          </Box>

          {/* Only show delete button for the image owner */}
          {isOwner && (
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(image.id)}
            >
              Delete
            </Button>
          )}

        </Box>
  
        <Box sx={{ 
          width: '100%', 
          height: 0, 
          paddingBottom: '133.33%', 
          position: 'relative', 
          background: theme.palette.background.default 
        }}>
          <CardMedia
            component="img"
            image={image.url}
            alt={image.originalName || image.filename}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
  
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          {/* 1) Heart + count */}
          <LikeButton
            isLiked={liked}
            likeCount={image.likes}
            onLike={() => onLike(image.id)}
          />
          {/* 2) Uploader's username */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, fontSize: '14px' }}
          >
            {image.uploader.username}
          </Typography>

          {/* 3) Time-ago stamp */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              fontSize: '10px',
              textTransform: 'uppercase'
            }}
          >
            {formatTimeAgo(image.createdAt)}
          </Typography>

          {/* 4) Description & comments */}
          <Typography
            variant="body2"
            sx={{ fontSize: '14px', lineHeight: 1.4, textAlign: 'left', width: '100%' }}
          >
            {image.description ||
              (image.originalName
                ? `Uploaded as ${image.originalName}`
                : 'Shared image')}
          </Typography>

          <CommentList comments={image.comments} />
        </Box>
  
        <Divider />
        <CommentInput
          value={newComment}
          onChange={(text) => onCommentChange(image.id, text)}
          onSubmit={() => onCommentSubmit(image.id)}
          isAuthenticated={isAuthenticated}
        />
    
      </Paper>
    );
  } 