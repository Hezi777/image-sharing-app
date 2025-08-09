// HomePage - main image gallery with infinite scroll, search, and interactions
// Uses React hooks for state management and axios for API calls

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
import { API_BASE_URL } from '../config/api';
import { useEffect, useState } from 'react';
import ImageCard from '../components/homepage/ImageCard';
import GalleryHeader from '../components/homepage/GalleryHeader';
import EmptyState from '../components/homepage/EmptyState';
import LoadingState from '../components/homepage/LoadingState';
import { useAuth } from '../components/providers/AuthProvider';
import { useSearch } from '../components/providers/SearchProvider';

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

  const [images, setImages] = useState<Image[]>([]);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const { user, isAuthenticated } = useAuth();
  const { showSearch, setShowSearch } = useSearch();

  // Fetch images from API with pagination and search - handles both initial load and infinite scroll
  const fetchImages = async (page: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setImages([]); // Clear existing images for new search
      setCurrentPage(1);
    }

    try {
      const res = await axios.get('/images', {
        params: {
          page,
          limit: 10,
          ...(searchTerm ? { search: searchTerm } : {}),
        },
      });

      const { data: newImages, pagination } = res.data;
      
      if (isLoadMore) {
        setImages(prev => [...prev, ...newImages]);
      } else {
        setImages(newImages);
      }

      setHasNextPage(pagination.hasNext);
      setTotalPages(pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger loading more images when user scrolls near bottom
  const loadMoreImages = () => {
    if (!loadingMore && hasNextPage) {
      fetchImages(currentPage + 1, true);
    }
  };

  // Initial load and search term changes
  useEffect(() => {
    fetchImages(1, false);
  }, [searchTerm]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.offsetHeight &&
        !loadingMore &&
        hasNextPage
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasNextPage, currentPage]);

  const like = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    const isCurrentlyLiked = likedImages.has(id);

    try {
      if (isCurrentlyLiked) {
        await axios.delete(`/images/${id}/like`);
        setImages(prev =>
          prev.map(img =>
            img.id === id ? { ...img, likes: Math.max(0, img.likes - 1) } : img
          )
        );
        setLikedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await axios.post(`/images/${id}/like`);
        setImages(prev =>
          prev.map(img =>
            img.id === id ? { ...img, likes: img.likes + 1 } : img
          )
        );
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

  const comment = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    const text = newComment[id];
    if (!text) return;

    await axios.post(`/images/${id}/comment`, { text });

    setImages(prev =>
      prev.map(img =>
        img.id === id
          ? {
              ...img,
              comments: [
                ...img.comments,
                {
                  text,
                  user: {
                    id: Number(user?.id) || 0,
                    username: user?.username || 'Unknown',
                  },
                },
              ],
            }
          : img
      )
    );

    setNewComment({ ...newComment, [id]: '' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleDelete = async (id: number) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    try {
      await axios.delete(`/images/${id}`);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error('Failed to delete image', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 2,
        userSelect: 'none',
      }}
    >
      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <GalleryHeader />

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
              onChange={e => setSearchTerm(e.target.value)}
              onBlur={() => setShowSearch(false)}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
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
                onCommentChange={(id: number, text: string) =>
                  setNewComment({ ...newComment, [id]: text })
                }
                onCommentSubmit={comment}
                formatTimeAgo={formatTimeAgo}
                onDelete={handleDelete}
                isAuthenticated={isAuthenticated}
                currentUserId={
                  user ? Number(user.id) : undefined
                } // ✅ fixed type
              />
            ))}
          </Box>
        )}

        {/* Loading indicator for infinite scroll */}
        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <LoadingState />
          </Box>
        )}

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
