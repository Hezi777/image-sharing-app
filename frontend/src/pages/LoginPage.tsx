// LoginPage - user authentication form with Material-UI styling
// Uses React hooks for form state and axios for API calls to backend auth endpoint

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  useTheme,
} from '@mui/material';
import { useAuth } from '../components/providers/AuthProvider';
import GalleryHeader from '../components/homepage/GalleryHeader';

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission - calls backend auth API and updates auth context
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/login', { username, password });
      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: 2,
        userSelect: 'none',
      }}
    >
      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <GalleryHeader centered />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #0575E6, #021B79)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Login
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              required
              label="Username"
              margin="normal"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </Button>

            <Box textAlign="center">
              <Link href="/register" variant="body2">
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
