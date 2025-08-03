// Gallery page component that displays all uploaded images with social features
// Provides like, comment, and view functionality for uploaded images

import {
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Type definitions for TypeScript type safety
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

// Gallery page component that displays uploaded images with social features
// 
// Features:
// - Display all uploaded images in a feed format
// - Like/unlike images with visual feedback
// - Add comments to images
// - Real-time updates for likes and comments
// - Instagram-like UI design
// - Responsive layout with Material-UI components
export default function GalleryPage() {
  // State management for gallery functionality
  const [images, setImages] = useState<Image[]>([]); // All images from the server
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({}); // Comment text for each image
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set()); // Track which images user has liked

  // Load all images from the server when component mounts
  // Fetches images with their comments and metadata
  useEffect(() => {
    axios.get<Image[]>('/images').then(res => setImages(res.data));
  }, []);

  // Like an image by sending request to server and updating local state
  // Provides optimistic UI updates for better user experience
  const like = async (id: number) => {
    // Send like request to server
    await axios.post(`/images/${id}/like`);
    
    // Update local state optimistically
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, likes: img.likes + 1 } : img))
    );
    
    // Track that user has liked this image
    setLikedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  // Add a comment to an image by sending request to server and updating local state
  // Provides optimistic UI updates for better user experience
  const comment = async (id: number) => {
    const text = newComment[id];
    if (!text) return; // Don't send empty comments
    
    // Send comment request to server
    await axios.post(`/images/${id}/comment`, { text });
    
    // Update local state optimistically
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, comments: [...img.comments, { text }] } : img
      )
    );
    
    // Clear the comment input for this image
    setNewComment({ ...newComment, [id]: '' });
  };

  // Format timestamp to relative time (e.g., "2h", "3d")
  // Converts ISO date string to human-readable relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#fafafa',
      py: 2
    }}>
      <Container maxWidth="sm">
        {/* Page title with gradient styling */}
        <Typography align="center" variant="h4" fontWeight={700} sx={{ mb: 3, background: 'linear-gradient(45deg, #0575E6, #021B79)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Image Gallery
        </Typography>

        {/* Empty state when no images are available */}
        {images.length === 0 && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="h6" color="textSecondary">
              No images yet. Upload one!
            </Typography>
          </Box>
        )}

        {/* Image feed container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Render each image as a card */}
          {images.map(image => (
            <Paper 
              key={image.id} 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#ffffff'
              }}
            >
              {/* Image header with user avatar and name */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* User avatar with first letter of image name */}
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#0095f6',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    {image.originalName?.charAt(0).toUpperCase() || 'I'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                      {image.originalName?.split('.')[0] || 'image'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Image display with aspect ratio preservation */}
              <Box sx={{ 
                width: '100%',
                height: 0,
                paddingBottom: '133.33%', // 4/3 aspect ratio for consistent layout
                position: 'relative',
                bgcolor: '#fafafa'
              }}>
                <CardMedia
                  component="img"
                  image={image.url}
                  alt={image.originalName || image.filename}
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Maintain aspect ratio while filling container
                    objectPosition: 'center' // Center the image
                  }}
                />
              </Box>

              {/* Image actions and content section */}
              <Box sx={{ p: 1.5 }}>
                {/* Like button with visual feedback */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IconButton 
                    onClick={() => like(image.id)} 
                    sx={{ p: 0.5 }}
                    color={likedImages.has(image.id) ? "error" : "default"}
                  >
                    {likedImages.has(image.id) ? 
                      <Favorite sx={{ fontSize: 24 }} /> : 
                      <FavoriteBorder sx={{ fontSize: 24 }} />
                    }
                  </IconButton>
                </Box>

                {/* Like count display */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '14px' }}>
                  {image.likes} likes
                </Typography>

                {/* Image caption/description */}
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600, marginRight: 8 }}>
                      {image.originalName?.split('.')[0] || 'image'}
                    </span>
                    {image.originalName ? `Uploaded as ${image.originalName}` : 'Shared image'}
                  </Typography>
                </Box>

                {/* Comments section */}
                {image.comments.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {image.comments.map((comment, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontSize: '14px', mb: 0.5 }}>
                        <span style={{ fontWeight: 600, marginRight: 8 }}>user{idx + 1}</span>
                        {comment.text}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Timestamp */}
                <Typography 
                  variant="caption" 
                  color="textSecondary" 
                  sx={{ fontSize: '10px', textTransform: 'uppercase' }}
                >
                  {formatTimeAgo(image.createdAt)}
                </Typography>
              </Box>

              {/* Comment input section */}
              <Divider />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Comment text input */}
                  <TextField
                    variant="standard"
                    placeholder="Add a comment..."
                    value={newComment[image.id] || ''}
                    onChange={e =>
                      setNewComment({ ...newComment, [image.id]: e.target.value })
                    }
                    onKeyDown={e => e.key === 'Enter' && comment(image.id)}
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiInput-root': {
                        fontSize: '14px',
                        '&:before': { borderBottom: 'none' },
                        '&:after': { borderBottom: 'none' },
                        '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                      }
                    }}
                  />
                  {/* Post comment button */}
                  <Button 
                    onClick={() => comment(image.id)} 
                    disabled={!newComment[image.id]}
                    sx={{ 
                      color: newComment[image.id] ? '#0095f6' : '#b3dbf7',
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      minWidth: 'auto',
                      p: 0
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
