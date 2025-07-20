import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar, { useSidebarToggle } from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Loader from './components/Loader';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import About from './pages/About';
import Footer from './components/Footer';
import { ThemeProvider, useThemeMode } from './components/ThemeContext';

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('promusic_user'));
    return user;
  } catch {
    return null;
  }
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(getUser());
  const { mode, toggleTheme } = useThemeMode();
  const [mobileOpen, toggleSidebar, setMobileOpen] = useSidebarToggle();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flex: 1, minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
          <Navbar onSearch={setSearch} user={user} mode={mode} toggleTheme={toggleTheme} onMenuClick={toggleSidebar} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home search={search} user={user} />} />
              <Route path="/favorites" element={<Favorites search={search} user={user} />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
              <Route path="/profile" element={<Profile user={user} />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
