import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function randomId() {
  return 'U' + Math.floor(100000 + Math.random() * 900000);
}

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Dummy user logic
    const user = {
      name: email.split('@')[0],
      id: randomId(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}`
    };
    localStorage.setItem('promusic_user', JSON.stringify(user));
    setUser(user);
    navigate('/');
  };

  return (
    <Fade in timeout={800}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Paper elevation={4} sx={{ padding: 4, width: 340, borderRadius: 3, background: '#23272f', color: '#fff' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>
              {email ? email[0].toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1ed760' }}>Login</Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' } }}
            />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
}

export default Login; 