import {
    Avatar,
    Box,
    CardMedia,
    Divider,
    Typography,
    Paper
  } from '@mui/material';
  import CommentList from './CommentList';
  import CommentInput from './CommentInput';
  import LikeButton from './LikeButton';

  type Comment = { text: string; createdAt?: string };
  
  type Image = {
    id: number;
    filename: string;
    originalName?: string;
    url: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
  };
  
  type Props = {
    image: Image;
    liked: boolean;
    newComment: string;
    onLike: (id: number) => void;
    onCommentChange: (id: number, text: string) => void;
    onCommentSubmit: (id: number) => void;
    formatTimeAgo: (dateString: string) => string;
  };
  
  export default function ImageCard({
    image,
    liked,
    newComment,
    onLike,
    onCommentChange,
    onCommentSubmit,
    formatTimeAgo,
  }: Props) {
    return (
      <Paper 
        elevation={3} 
        sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#ffffff' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#0095f6', fontSize: '14px', fontWeight: 600 }}>
              {image.originalName?.charAt(0).toUpperCase() || 'I'}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
              {image.originalName?.split('.')[0] || 'image'}
            </Typography>
          </Box>
        </Box>
  
        <Box sx={{ width: '100%', height: 0, paddingBottom: '133.33%', position: 'relative', bgcolor: '#fafafa' }}>
          <CardMedia
            component="img"
            image={image.url}
            alt={image.originalName || image.filename}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
  
                  <Box sx={{ p: 1.5 }}>
            <LikeButton
              isLiked={liked}
              likeCount={image.likes}
              onLike={() => onLike(image.id)}
            />
  
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600, marginRight: 8 }}>
                  {image.originalName?.split('.')[0] || 'image'}
                </span>
                {image.originalName ? `Uploaded as ${image.originalName}` : 'Shared image'}
              </Typography>
            </Box>
  
                      <CommentList comments={image.comments} />  
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '10px', textTransform: 'uppercase' }}>
              {formatTimeAgo(image.createdAt)}
            </Typography>
          </Box>
  
        <Divider />
        <CommentInput
          value={newComment}
          onChange={(text) => onCommentChange(image.id, text)}
          onSubmit={() => onCommentSubmit(image.id)}
        />
    
      </Paper>
    );
  } 