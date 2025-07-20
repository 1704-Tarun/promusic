import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, useMediaQuery, IconButton } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HomeIcon from '@mui/icons-material/Home';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Trending', icon: <LibraryMusicIcon />, path: '/trending' },
  { text: 'Playlists', icon: <QueueMusicIcon />, path: '/playlists' },
  { text: 'Favorites', icon: <FavoriteIcon />, path: '/favorites' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

export function useSidebarToggle() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(o => !o);
  return [open, toggle, setOpen];
}

function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <>
      <Typography variant="h5" align="center" sx={{ my: 2, fontWeight: 'bold', color: isDark ? 'primary.main' : 'text.primary' }}>
        ProMusic
      </Typography>
      <Divider sx={{ background: 'divider' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path} selected={location.pathname === item.path} sx={{ '&:hover': { background: 'primary.main', color: '#23272f' }, color: 'text.primary' }} onClick={isMobile ? onMobileClose : undefined}>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ sx: { color: 'inherit' } }} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Permanent drawer for desktop, temporary for mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 220,
          flexShrink: 0,
          '& .MuiDrawer-paper': theme => ({
            width: 220,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }),
          display: { xs: 'block', md: 'block' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar; 