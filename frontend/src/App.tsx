// App.tsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import axios from 'axios';

import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import {
  Box,
  IconButton,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Avatar,
  useTheme,
} from '@mui/material';

import {
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  DarkMode as DarkIcon,
  LightMode as LightIcon,
} from '@mui/icons-material';

// --- Auth Context ---
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// --- Search Context ---
interface SearchContextType {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);
export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be inside SearchProvider');
  return ctx;
};

// --- Bottom Navigation ---
function BottomNavigation({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSearch, setShowSearch } = useSearch();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  // Close search whenever the route changes
  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname, setShowSearch]);

  const handleHomeClick = () => navigate('/');
  const handleUploadClick = () =>
    isAuthenticated ? navigate('/upload') : navigate('/login');

  // Toggle search on/off
  const handleSearchClick = () => setShowSearch(!showSearch);

  // Always go to /profile (or /login if not authed)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/profile');
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 4,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        px: 1,
        py: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={handleHomeClick}
          sx={{
            color:
              location.pathname === '/'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            p: 1,
          }}
        >
          <HomeIcon />
        </IconButton>

        <IconButton
          onMouseDown={(e) => {
              e.preventDefault(); // Prevents blur from input before this triggers
              handleSearchClick();
          }}
          sx={{
            color: showSearch
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            p: 1,
          }}
        >
          <SearchIcon />
        </IconButton>

        <IconButton
          onClick={handleUploadClick}
          sx={{
            color:
              location.pathname === '/upload'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            p: 1,
          }}
        >
          <AddIcon />
        </IconButton>

        <IconButton
          onClick={handleProfileClick}
          sx={{
            p: 0,
            borderRadius: '50%',
            border:
              location.pathname === '/profile'
                ? `2px solid ${theme.palette.primary.main}`
                : 'none',
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: isAuthenticated
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {isAuthenticated
              ? user.username.charAt(0).toUpperCase()
              : '?'}
          </Avatar>
        </IconButton>
      </Box>
    </Paper>
  );
}

// --- Main App ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#0095f6' },
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });

  // On mount, restore auth state & axios header
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Auto-logout on 401
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider
        value={{ isAuthenticated, user, login, logout }}
      >
        <SearchContext.Provider
          value={{ showSearch, setShowSearch }}
        >
          <BrowserRouter>
            {/* Bottom navigation (minus theme toggle) */}
            <BottomNavigation
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />

            {/* Main routes */}
            <Box sx={{ pb: 8 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/upload"
                  element={
                    isAuthenticated ? (
                      <UploadPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/" replace />
                    ) : (
                      <LoginPage />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/" replace />
                    ) : (
                      <RegisterPage />
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    isAuthenticated ? (
                      <ProfilePage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              </Routes>
            </Box>

            {/* Floating theme toggle in bottom-left */}
            <Paper
              elevation={8}
              sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                borderRadius: 4,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                p: 0.5,
              }}
            >
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{ p: 1 }}
              >
                {darkMode ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Paper>
          </BrowserRouter>
        </SearchContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
