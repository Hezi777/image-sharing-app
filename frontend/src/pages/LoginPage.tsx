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

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        display: 'flex',
        flexDirection: 'column',  // stack header + form area
      }}
    >
      {/* Top-centered header */}
      <GalleryHeader centered />

      {/* Form container fills remaining space and centers its content */}
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
    </Box>
  );
}
