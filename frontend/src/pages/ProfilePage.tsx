// ProfilePage - user profile with image grid, stats, and inline username editing
// Displays user's uploaded images in Instagram-style grid layout with edit functionality

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
  TextField,
  Stack,
} from '@mui/material';
import { GridOn as GridIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../components/providers/AuthProvider';
import LoadingState from '../components/homepage/LoadingState';
import GalleryHeader from '../components/homepage/GalleryHeader';

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

  // inline edit state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.username ?? '');
  const [savingName, setSavingName] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/images');
        const filteredImages = res.data.data.filter(
          (img: any) => img.uploader.id === user?.id
        );
        setUserImages(filteredImages);
      } catch (err) {
        console.error('Failed to fetch user images', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserImages();
      setNameInput(user.username); // ensure input is in sync when user loads
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const totalLikes = userImages.reduce((sum, img) => sum + img.likes, 0);

  const startEditName = () => {
    setSaveError(null);
    setNameInput(user?.username ?? '');
    setEditingName(true);
  };

  const cancelEditName = () => {
    setSaveError(null);
    setEditingName(false);
    setNameInput(user?.username ?? '');
  };

  const saveName = async () => {
    if (!nameInput.trim() || !user) return;
    setSavingName(true);
    setSaveError(null);
    try {
      const { data } = await axios.patch('/auth/me', {
        username: nameInput.trim(),
      });

      // Persist locally so the change reflects across the app
      const updatedUser = { ...user, username: data?.username ?? nameInput.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Easiest way without changing AuthProvider: reload to rehydrate context
      window.location.reload();
    } catch (err: any) {
      setSaveError(
        err?.response?.data?.message || 'Could not save name. Please try again.'
      );
      setSavingName(false);
    }
  };

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
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        userSelect: 'none',
      }}
    >
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
              {(editingName ? nameInput : user.username).charAt(0).toUpperCase()}
            </Avatar>

            {/* Stats and Info */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {/* Username + inline editor */}
              {!editingName ? (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {user.username}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={startEditName}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Edit profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    size="small"
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ mb: 3, maxWidth: 360 }}>
                  <TextField
                    label="Username"
                    size="small"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    autoFocus
                  />
                  {saveError && (
                    <Typography variant="body2" color="error">
                      {saveError}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={saveName}
                      disabled={savingName || !nameInput.trim()}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      {savingName ? 'Saving…' : 'Save'}
                    </Button>
                    <Button
                      variant="text"
                      onClick={cancelEditName}
                      disabled={savingName}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              )}

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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2,
              }}
            >
              {userImages.map((image) => (
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
                  <Box
                    sx={{
                      width: '100%',
                      height: 0,
                      paddingBottom: '133.33%',
                      position: 'relative',
                      background: theme.palette.background.default,
                    }}
                  >
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
                        objectFit: 'cover',
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
