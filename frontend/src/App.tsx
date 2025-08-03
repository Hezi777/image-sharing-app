// Main React application component that sets up routing and navigation
// Provides the application shell with navigation bar and route configuration

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

// Root application component that provides:
// - Client-side routing with React Router
// - Navigation bar with links to main pages
// - Route configuration for different pages
// 
// The app uses Material-UI for styling and components
export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar with links to main application pages */}
      <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            {/* Gallery page link - main page */}
            <Button
              component={Link}
              to="/"
              sx={{ color: '#333', fontWeight: 600, marginRight: 2 }}
            >
              🏠 Gallery
            </Button>
            {/* Upload page link */}
            <Button
              component={Link}
              to="/upload"
              sx={{ color: '#333', fontWeight: 600 }}
            >
              📤 Upload
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Application routes configuration */}
      <Routes>
        {/* Gallery page - displays all uploaded images */}
        <Route path="/" element={<GalleryPage />} />
        {/* Upload page - allows users to upload new images */}
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
