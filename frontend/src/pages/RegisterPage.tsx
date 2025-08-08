import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../App';
import GalleryHeader from '../components/homepage/GalleryHeader';

export default function RegisterPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/');              // redirect after successful signup
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',    // stack header + form area
      }}
    >
      {/* Top-centered, large header */}
      <GalleryHeader centered />

      {/* Center the form in the remaining space */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Register
            </Typography>

            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                label="Username"
                margin="normal"
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                required
                label="Confirm Password"
                type="password"
                margin="normal"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
                {loading ? 'Creating account…' : 'Register'}
              </Button>

              <Box textAlign="center">
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
