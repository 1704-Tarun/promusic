import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('promusic_user'));
    return user;
  } catch {
    return null;
  }
}

function Profile() {
  const user = getUser();
  const isGuest = !user;
  const name = user?.name || 'Guest';
  const id = user?.id || 'GUEST';
  const avatar = user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%' }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 4, minWidth: 340, maxWidth: 400, textAlign: 'center', background: 'linear-gradient(135deg, #23272f 80%, #1ed76022 100%)', color: '#fff', boxShadow: '0 8px 32px #1ed76033' }}>
        <Avatar src={avatar} sx={{ width: 100, height: 100, mx: 'auto', mb: 2, boxShadow: '0 4px 16px #1ed76044' }} />
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1ed760', mb: 1 }}>{name}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#fff' }}>ID: {id}</Typography>
        {isGuest ? (
          <Typography variant="body1" sx={{ color: '#aaa' }}>You are browsing as a guest. Please login to personalize your profile.</Typography>
        ) : (
          <Typography variant="body1" sx={{ color: '#aaa' }}>Welcome back, {name}! Enjoy your music journey.</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Profile; 