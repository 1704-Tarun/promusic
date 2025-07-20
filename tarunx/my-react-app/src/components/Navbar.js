import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Button, InputBase, Box, IconButton, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Navbar({ onSearch, user, mode, toggleTheme, onMenuClick }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('promusic_user');
    window.location.reload();
  };

  return (
    <AppBar position="static" sx={{ background: 'background.paper' }}>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        )}
        <MusicNoteIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
          ProMusic
        </Typography>
        <Box sx={{ background: 'background.default', borderRadius: 2, px: 2, mr: 2 }}>
          <InputBase
            placeholder="Search music…"
            value={search}
            onChange={handleSearch}
            sx={{ color: 'text.primary', width: 200 }}
          />
        </Box>
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        {user && (
          <>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold', mr: 2 }}>
              {user.name}
            </Typography>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 