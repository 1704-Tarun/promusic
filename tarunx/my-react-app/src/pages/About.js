import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function About() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', p: 2 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 500, width: '100%', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>About ProMusic</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ProMusic is a modern, responsive music web app where you can add, play, and organize your favorite songs. Create playlists, record music, and enjoy a beautiful UI with dark/light mode support.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <b>Version:</b> 1.0.0
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <b>Contact:</b> <MuiLink href="mailto:support@promusic.com" sx={{ color: 'primary.main' }}>support@promusic.com</MuiLink>
        </Typography>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} ProMusic. All rights reserved.
        </Typography>
      </Paper>
    </Box>
  );
}

export default About; 