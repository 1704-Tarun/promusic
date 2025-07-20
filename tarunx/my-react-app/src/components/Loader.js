import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function Loader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        bgcolor: '#181a20',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={80} sx={{ color: '#1ed760', mb: 3 }} />
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
        ProMusic
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#1ed760', mt: 1 }}>
        Loading your music experience...
      </Typography>
    </Box>
  );
}

export default Loader; 