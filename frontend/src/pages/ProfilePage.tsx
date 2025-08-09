import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Card,
  CardMedia,
  useTheme,
  Divider,
} from '@mui/material';
import { GridOn as GridIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/providers/AuthProvider';
import LoadingState from '../components/homepage/LoadingState';
import GalleryHeader from '../components/homepage/GalleryHeader';

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

export default function ProfilePage() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Image[]>('/images');
        const filteredImages = res.data.filter(img => img.uploader.id === user?.id);
        setUserImages(filteredImages);
      } catch (err) {
        console.error('Failed to fetch user images', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserImages();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const totalLikes = userImages.reduce((sum, img) => sum + img.likes, 0);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Please log in to view your profile
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.default,
      userSelect: 'none',
    }}>
      <GalleryHeader />
      <Container maxWidth="md">
        {/* Profile Header */}
        <Box sx={{ p: 4 }}>
          {/* Profile Picture and Stats Row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            {/* Profile Picture */}
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: '#0095f6', 
                fontSize: '48px', 
                fontWeight: 600,
                mr: 4,
                flexShrink: 0,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            
            {/* Stats and Info */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {/* Username */}
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                {user.username}
              </Typography>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 6, mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {userImages.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Posts
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {totalLikes}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Likes
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    px: 3,
                    py: 1,
                  }}
                >
                  Edit profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    px: 3,
                    py: 1,
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <GridIcon 
              sx={{ 
                fontSize: 28, 
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }} 
            />
            {/* Active indicator line */}
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 2,
                backgroundColor: theme.palette.text.primary,
                borderRadius: 1,
              }} 
            />
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ mb: 2 }} />

        {/* Posts Grid */}
        <Box sx={{ px: 2 }}>
          {loading ? (
            <LoadingState />
          ) : userImages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                No posts yet
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Start sharing your images to see them here!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: 2,
            }}>
              {userImages.map(image => (
                <Card 
                  key={image.id}
                  sx={{ 
                    borderRadius: 0,
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Box sx={{ 
                    width: '100%', 
                    height: 0, 
                    paddingBottom: '133.33%', 
                    position: 'relative',
                    background: theme.palette.background.default,
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
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
