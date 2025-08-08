import {
  Box,
  Container,
  TextField,
  Slide,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ImageCard from '../components/homepage/ImageCard';
import GalleryHeader from '../components/homepage/GalleryHeader';
import EmptyState from '../components/homepage/EmptyState';
import LoadingState from '../components/homepage/LoadingState';
import { useAuth, useSearch } from '../App';

// Type definitions for image and comment
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

export default function HomePage() {
  const theme = useTheme();
  
  // State to manage images fetched from the server
  const [images, setImages] = useState<Image[]>([]);
  // State to manage new comments for each image
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  // State to manage liked images
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage search term
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage login alert
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { showSearch, setShowSearch } = useSearch();

  // Fetch images from the server when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Image[]>('/images', {
          params: searchTerm ? { search: searchTerm } : {},
        });
        setImages(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [searchTerm]);

  // Function to like/unlike an image
  const like = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    const isCurrentlyLiked = likedImages.has(id);
    
    try {
      if (isCurrentlyLiked) {
        // Unlike - remove like
        await axios.delete(`/images/${id}/like`);
        // Update the state to decrease like count
        setImages(prev =>
          prev.map(img => (img.id === id ? { ...img, likes: Math.max(0, img.likes - 1) } : img))
        );
        
        // Remove the image ID from the liked images set
        setLikedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        // Like - add like
        await axios.post(`/images/${id}/like`);
        // Update the state to increase like count
        setImages(prev =>
          prev.map(img => (img.id === id ? { ...img, likes: img.likes + 1 } : img))
        );
        
        // Add the image ID to the liked images set
        setLikedImages(prev => {
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
        });
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  // Function to comment on an image
  const comment = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    const text = newComment[id];
    if (!text) return;
    
    // Post the comment to the server and update the state
    await axios.post(`/images/${id}/comment`, { text });
    
    // Update the image comments in the state with actual user info
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { 
          ...img, 
          comments: [...img.comments, { 
            text, 
            user: { id: user?.id || 0, username: user?.username || 'Unknown' } 
          }] 
        } : img
      )
    );
    
    // Clear the new comment input for the image
    setNewComment({ ...newComment, [id]: '' });
  };

  // Function to handle file selection from input
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  // Function to handle image deletion
  const handleDelete = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    try {
      await axios.delete(`/images/${id}`);
      setImages(prev => prev.filter(img => img.id !== id)); // remove from UI
    } catch (err) {
      console.error('Failed to delete image', err);
    }
  };

  // Render the homepage with a header and image cards
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.default,
      py: 2,
      userSelect: 'none',
    }}>
      <Container maxWidth="sm">
        <GalleryHeader />

        {/* Search overlay - Show on ALL screen sizes when search is active */}
        <Slide direction="down" in={showSearch} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              background: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
              p: 2,
              boxShadow: theme.shadows[4],
            }}
          >
            <TextField
              fullWidth
              placeholder="Search captions and comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setShowSearch(false)}
              autoFocus
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        </Slide>

        {loading ? (
          <LoadingState />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {images.map(image => (
              <ImageCard
                key={image.id}
                image={image}
                liked={likedImages.has(image.id)}
                newComment={newComment[image.id] || ''}
                onLike={like}
                onCommentChange={(id: number, text: string) => setNewComment({ ...newComment, [id]: text })}
                onCommentSubmit={comment}
                formatTimeAgo={formatTimeAgo}
                onDelete={handleDelete}
                isAuthenticated={isAuthenticated}
                currentUserId={user?.id}
              />
            ))}
          </Box>
        )}

        {/* Login Alert */}
        <Snackbar
          open={showLoginAlert}
          autoHideDuration={4000}
          onClose={() => setShowLoginAlert(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowLoginAlert(false)} 
            severity="info" 
            sx={{ width: '100%' }}
          >
            Please log in to like, comment, or delete posts
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
