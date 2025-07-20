import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

function Footer() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        px: 2,
        mt: 4,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        left: 0,
        zIndex: 10,
        fontSize: { xs: 12, sm: 14 },
      }}
    >
      <MuiLink component={Link} to="/about" sx={{ color: 'primary.main', fontWeight: 'bold', mx: 1 }}>
        About
      </MuiLink>
      | &copy; {new Date().getFullYear()} ProMusic. All rights reserved.
    </Box>
  );
}

export default Footer; 