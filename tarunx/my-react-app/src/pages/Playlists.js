import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Grid, Card, CardContent, CardMedia, Fade, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

function getLocalMusic() {
  try {
    const data = localStorage.getItem('customMusicList');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function getPlaylists() {
  try {
    const data = localStorage.getItem('userPlaylists');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function setPlaylists(playlists) {
  localStorage.setItem('userPlaylists', JSON.stringify(playlists));
}

function Playlists() {
  const [playlists, setPlaylistsState] = useState(getPlaylists());
  const [musicList, setMusicList] = useState(getLocalMusic());
  const [createDialog, setCreateDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState(null);

  useEffect(() => {
    setPlaylistsState(getPlaylists());
    setMusicList(getLocalMusic());
  }, []);

  // Create playlist
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPl = { name: newPlaylistName, songs: [] };
      const updated = [newPl, ...playlists];
      setPlaylists(updated);
      setPlaylistsState(updated);
      setPlaylists(updated);
      setNewPlaylistName('');
      setCreateDialog(false);
    }
  };

  // Select playlist
  const handleSelectPlaylist = (pl) => {
    setSelectedPlaylist(pl);
  };

  // Delete playlist
  const handleDeletePlaylist = (pl) => {
    const updated = playlists.filter(p => p !== pl);
    setPlaylists(updated);
    setPlaylistsState(updated);
    if (selectedPlaylist === pl) setSelectedPlaylist(null);
  };

  // Add to playlist (from music card)
  const handleAddToPlaylist = (song, plName) => {
    const updated = playlists.map(pl => {
      if (pl.name === plName) {
        // Avoid duplicate
        if (!pl.songs.find(s => s.title === song.title && s.url === song.url)) {
          return { ...pl, songs: [song, ...pl.songs] };
        }
      }
      return pl;
    });
    setPlaylists(updated);
    setPlaylistsState(updated);
    setPlaylists(updated);
    setAnchorEl(null);
    setAddToPlaylistSong(null);
  };

  // Remove song from playlist
  const handleRemoveFromPlaylist = (song) => {
    if (!selectedPlaylist) return;
    const updated = playlists.map(pl => {
      if (pl === selectedPlaylist) {
        return { ...pl, songs: pl.songs.filter(s => !(s.title === song.title && s.url === song.url)) };
      }
      return pl;
    });
    setPlaylists(updated);
    setPlaylistsState(updated);
    setPlaylists(updated);
    setSelectedPlaylist(updated.find(pl => pl.name === selectedPlaylist.name));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>Playlists</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }} onClick={() => setCreateDialog(true)}>
          Create Playlist
        </Button>
      </Box>
      <Box display="flex" gap={4}>
        {/* Playlist List */}
        <Box minWidth={220}>
          <List>
            {playlists.map((pl, idx) => (
              <ListItem key={pl.name} button selected={selectedPlaylist && selectedPlaylist.name === pl.name} onClick={() => handleSelectPlaylist(pl)}>
                <ListItemText primary={pl.name} primaryTypographyProps={{ sx: { color: '#fff' } }} />
                <IconButton edge="end" onClick={() => handleDeletePlaylist(pl)}><DeleteIcon sx={{ color: '#fff' }} /></IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Playlist Songs or All Songs */}
        <Box flex={1}>
          {selectedPlaylist ? (
            <>
              <Typography variant="h6" sx={{ color: '#1ed760', mb: 2 }}>{selectedPlaylist.name}</Typography>
              <Grid container spacing={3}>
                {selectedPlaylist.songs.length === 0 && (
                  <Grid item xs={12}><Typography sx={{ color: '#fff', opacity: 0.7 }}>No songs in this playlist.</Typography></Grid>
                )}
                {selectedPlaylist.songs.map((music, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Fade in timeout={800 + idx * 200}>
                      <Card sx={{ background: '#23272f', color: '#fff', borderRadius: 3, width: 220, m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px #1ed76055' }, animation: 'cardFadeIn 1s' }}>
                        {music.cover ? (
                          <CardMedia component="img" image={music.cover} alt={music.title} sx={{ width: 220, height: 220, objectFit: 'cover', borderRadius: '12px 12px 0 0', background: '#222' }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/220x220?text=No+Image'; }} />
                        ) : (
                          <Box sx={{ width: 220, height: 220, background: '#222', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24 }}>No Image</Box>
                        )}
                        <CardContent sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                          <Typography variant="h6" fontWeight="bold">{music.title}</Typography>
                          <Typography color="text.secondary" sx={{ color: '#1ed760' }}>{music.artist}</Typography>
                          <audio controls style={{ width: "100%", marginTop: 10 }}>
                            <source src={music.url} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                          <IconButton onClick={() => handleRemoveFromPlaylist(music)} sx={{ mt: 1, color: '#fff' }}><DeleteIcon /></IconButton>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: '#1ed760', mb: 2 }}>All Songs</Typography>
              <Grid container spacing={3}>
                {musicList.length === 0 && (
                  <Grid item xs={12}><Typography sx={{ color: '#fff', opacity: 0.7 }}>No music found.</Typography></Grid>
                )}
                {musicList.map((music, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Fade in timeout={800 + idx * 200}>
                      <Card sx={{ background: '#23272f', color: '#fff', borderRadius: 3, width: 220, m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px #1ed76055' }, animation: 'cardFadeIn 1s' }}>
                        {music.cover ? (
                          <CardMedia component="img" image={music.cover} alt={music.title} sx={{ width: 220, height: 220, objectFit: 'cover', borderRadius: '12px 12px 0 0', background: '#222' }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/220x220?text=No+Image'; }} />
                        ) : (
                          <Box sx={{ width: 220, height: 220, background: '#222', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24 }}>No Image</Box>
                        )}
                        <CardContent sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                          <Typography variant="h6" fontWeight="bold">{music.title}</Typography>
                          <Typography color="text.secondary" sx={{ color: '#1ed760' }}>{music.artist}</Typography>
                          <audio controls style={{ width: "100%", marginTop: 10 }}>
                            <source src={music.url} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                          <IconButton onClick={e => { setAnchorEl(e.currentTarget); setAddToPlaylistSong(music); }} sx={{ mt: 1, color: '#1ed760' }}><PlaylistAddIcon /></IconButton>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
              {/* Add to Playlist Menu */}
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {playlists.length === 0 && <MenuItem disabled>No playlists</MenuItem>}
                {playlists.map(pl => (
                  <MenuItem key={pl.name} onClick={() => handleAddToPlaylist(addToPlaylistSong, pl.name)}>{pl.name}</MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Box>
      {/* Create Playlist Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)}>
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          <TextField label="Playlist Name" fullWidth margin="normal" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePlaylist} variant="contained" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Create</Button>
        </DialogActions>
      </Dialog>
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}

export default Playlists; 