import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, Fade, Input, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MicIcon from '@mui/icons-material/Mic';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AnimatedBackground from '../components/AnimatedBackground';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function getLocalMusic() {
  try {
    const data = localStorage.getItem('customMusicList');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalMusic(list) {
  localStorage.setItem('customMusicList', JSON.stringify(list));
}

function getFavorites() {
  try {
    const data = localStorage.getItem('favoriteMusicIds');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setFavorites(ids) {
  localStorage.setItem('favoriteMusicIds', JSON.stringify(ids));
}

function Home({ search, user, favoritesOnly }) {
  const [musicList, setMusicList] = useState(getLocalMusic());
  const [form, setForm] = useState({ title: '', artist: '', cover: '', url: '' });
  const [showForm, setShowForm] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordDialog, setRecordDialog] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [favorites, setFavoritesState] = useState(getFavorites());
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordCover, setRecordCover] = useState('');

  // For device file dialog
  const [deviceFiles, setDeviceFiles] = useState([]); // [{file, url, idx}]
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [deviceDialogIdx, setDeviceDialogIdx] = useState(0);
  const [deviceDialogForm, setDeviceDialogForm] = useState({ title: '', artist: '', cover: '', url: '' });

  // Edit Music Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMusicIdx, setEditMusicIdx] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', cover: '', url: '' });

  useEffect(() => {
    setMusicList(getLocalMusic());
    setFavoritesState(getFavorites());
  }, []);

  // Add from Device
  const handleDeviceFiles = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
    if (files.length > 0) {
      // Prepare file readers
      const fileObjs = [];
      let loaded = 0;
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          fileObjs[idx] = {
            file,
            url: ev.target.result,
            idx
          };
          loaded++;
          if (loaded === files.length) {
            setDeviceFiles(fileObjs);
            setDeviceDialogIdx(0);
            setDeviceDialogForm({
              title: fileObjs[0].file.name.replace(/\.[^/.]+$/, ""),
              artist: 'Device',
              cover: '',
              url: fileObjs[0].url
            });
            setDeviceDialogOpen(true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Device dialog: handle image
  const handleDeviceImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setDeviceDialogForm(prev => ({ ...prev, cover: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Device dialog: save current
  const handleDeviceDialogSave = () => {
    const newMusic = { ...deviceDialogForm };
    const updated = [newMusic, ...getLocalMusic()];
    setLocalMusic(updated);
    setMusicList(updated);
    // Next file or close
    if (deviceDialogIdx < deviceFiles.length - 1) {
      const nextIdx = deviceDialogIdx + 1;
      setDeviceDialogIdx(nextIdx);
      setDeviceDialogForm({
        title: deviceFiles[nextIdx].file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Device',
        cover: '',
        url: deviceFiles[nextIdx].url
      });
    } else {
      setDeviceDialogOpen(false);
      setDeviceFiles([]);
    }
  };

  // Record Music
  const handleStartRecording = async () => {
    setRecording(true);
    setRecordedAudio(null);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordedAudio(audioUrl);
    };
    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Add this function to handle image upload for recording
  const handleRecordCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRecordCover(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRecording = () => {
    if (recordedAudio && recordName) {
      fetch(recordedAudio)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const newMusic = {
              title: recordName,
              artist: 'Recorded',
              cover: recordCover, // Save the uploaded cover
              url: ev.target.result
            };
            const updated = [newMusic, ...getLocalMusic()];
            setLocalMusic(updated);
            setMusicList(updated);
            setRecordDialog(false);
            setRecordedAudio(null);
            setRecordName('');
            setRecordCover('');
          };
          reader.readAsDataURL(blob);
        });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, [name]: ev.target.result }));
        if (name === 'cover') setCoverFile(files[0]);
        if (name === 'url') setAudioFile(files[0]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddMusic = (e) => {
    e.preventDefault();
    if (form.title && form.artist && form.cover && form.url) {
      const newMusic = { ...form };
      const updatedCustom = [newMusic, ...getLocalMusic()];
      setLocalMusic(updatedCustom);
      setMusicList([newMusic, ...getLocalMusic()]);
      setForm({ title: '', artist: '', cover: '', url: '' });
      setCoverFile(null);
      setAudioFile(null);
      setShowForm(false);
    }
  };

  // Favorite logic
  const getMusicId = (music) => {
    // Use title+artist+url as a unique key
    return `${music.title}|${music.artist}|${music.url}`;
  };
  const isFavorite = (music) => favorites.includes(getMusicId(music));
  const toggleFavorite = (music) => {
    const id = getMusicId(music);
    let updated;
    if (isFavorite(music)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [id, ...favorites];
    }
    setFavorites(updated);
    setFavoritesState(updated);
  };

  // Add this function to handle deleting a song
  const handleDeleteMusic = (music) => {
    const updated = getLocalMusic().filter(m => !(m.title === music.title && m.artist === music.artist && m.url === music.url));
    setLocalMusic(updated);
    setMusicList(updated);
  };

  const handleEditMusic = (music, idx) => {
    setEditForm({ ...music });
    setEditMusicIdx(idx);
    setEditDialogOpen(true);
  };

  const handleEditCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditForm(prev => ({ ...prev, cover: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    if (editForm.title && editForm.artist) {
      const updated = [...musicList];
      updated[editMusicIdx] = { ...updated[editMusicIdx], ...editForm };
      setLocalMusic(updated);
      setMusicList(updated);
      setEditDialogOpen(false);
      setEditMusicIdx(null);
    }
  };

  // Filter for favoritesOnly
  let filteredMusic = musicList.filter(music =>
    music.title.toLowerCase().includes((search || '').toLowerCase()) ||
    music.artist.toLowerCase().includes((search || '').toLowerCase())
  );
  if (favoritesOnly) {
    filteredMusic = filteredMusic.filter(isFavorite);
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme => theme.palette.background.default, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      {/* Banner Section */}
      <Fade in timeout={1200}>
        <Box
          sx={{
            background: 'linear-gradient(90deg, #1ed760 0%, #23272f 100%)',
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 3,
            animation: 'bannerFadeIn 1.2s',
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Discover New Music Everyday!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85 }}>
              Listen to trending tracks, create playlists, and enjoy premium sound.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              {user && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    component="label"
                    sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}
                  >
                    Add from Device
                    <input type="file" accept="audio/*" multiple hidden onChange={handleDeviceFiles} />
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<MicIcon />}
                    sx={{ background: '#23272f', color: '#1ed760', fontWeight: 'bold' }}
                    onClick={() => setRecordDialog(true)}
                  >
                    Record Music
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    sx={{ background: '#23272f', color: '#1ed760', fontWeight: 'bold' }}
                    onClick={() => setShowForm(true)}
                  >
                    Add Custom Music
                  </Button>
                </>
              )}
            </Stack>
            {!user && (
              <Typography sx={{ mt: 2, color: '#fff', fontWeight: 'bold' }}>Login to add your own music!</Typography>
            )}
          </Box>
        </Box>
      </Fade>

      {/* Device File Dialog */}
      <Dialog open={deviceDialogOpen} onClose={() => setDeviceDialogOpen(false)}>
        <DialogTitle>Add Music from Device</DialogTitle>
        <DialogContent>
          <TextField
            label="Music Name"
            fullWidth
            margin="normal"
            value={deviceDialogForm.title}
            onChange={e => setDeviceDialogForm(prev => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            label="Artist"
            fullWidth
            margin="normal"
            value={deviceDialogForm.artist}
            onChange={e => setDeviceDialogForm(prev => ({ ...prev, artist: e.target.value }))}
          />
          <Box mt={2} mb={2}>
            <Button variant="contained" component="label" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>
              Add Image
              <input type="file" accept="image/*" hidden onChange={handleDeviceImage} />
            </Button>
            {deviceDialogForm.cover && (
              <Avatar src={deviceDialogForm.cover} sx={{ width: 60, height: 60, ml: 2 }} />
            )}
          </Box>
          <audio src={deviceDialogForm.url} controls style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeviceDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeviceDialogSave} variant="contained" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Record Music Dialog */}
      <Dialog open={recordDialog} onClose={() => setRecordDialog(false)}>
        <DialogTitle>Record Music</DialogTitle>
        <DialogContent>
          <TextField
            label="Music Name"
            fullWidth
            margin="normal"
            value={recordName}
            onChange={e => setRecordName(e.target.value)}
          />
          <Box mt={2} mb={2}>
            <Button variant="contained" component="label" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>
              Add Image
              <input type="file" accept="image/*" hidden onChange={handleRecordCoverChange} />
            </Button>
            {recordCover && (
              <Avatar src={recordCover} sx={{ width: 60, height: 60, ml: 2 }} />
            )}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            {!recording && (
              <Button variant="contained" startIcon={<MicIcon />} onClick={handleStartRecording} sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Start Recording</Button>
            )}
            {recording && (
              <Button variant="contained" color="error" onClick={handleStopRecording} sx={{ fontWeight: 'bold' }}>Stop Recording</Button>
            )}
          </Box>
          {recordedAudio && (
            <Box mt={2}>
              <audio src={recordedAudio} controls style={{ width: '100%' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRecording} disabled={!recordedAudio || !recordName} variant="contained" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Music Form */}
      {showForm && user && (
        <Box component="form" onSubmit={handleAddMusic} sx={{ mb: 4, background: '#23272f', p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ color: '#1ed760', mb: 2 }}>Add Your Music</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Title" fullWidth required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Artist" fullWidth required value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Input type="file" name="cover" inputProps={{ accept: 'image/*' }} onChange={handleFileChange} fullWidth required />
              {form.cover && <img src={form.cover} alt="cover preview" style={{ width: 60, height: 60, objectFit: 'cover', marginTop: 8, borderRadius: 8, background: '#222' }} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Input type="file" name="url" inputProps={{ accept: 'audio/*' }} onChange={handleFileChange} fullWidth required />
              {form.url && <audio src={form.url} controls style={{ width: 100, marginTop: 8 }} />}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Add Music</Button>
              <Button onClick={() => setShowForm(false)} sx={{ ml: 2, color: '#fff' }}>Cancel</Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Your Music Section */}
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
        Your Music
      </Typography>
      <Grid container spacing={3}>
        {filteredMusic.length === 0 && (
          <Grid item xs={12}>
            <Typography sx={{ color: '#fff', opacity: 0.7 }}>No music found.</Typography>
          </Grid>
        )}
        {filteredMusic.map((music, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Fade in timeout={800 + idx * 200}>
              <Card
                sx={{
                  background: '#23272f',
                  color: '#fff',
                  borderRadius: 3,
                  width: 220,
                  m: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: '0 8px 32px #1ed76055'
                  },
                  animation: 'cardFadeIn 1s',
                }}
              >
                {music.cover ? (
                  <CardMedia
                    component="img"
                    image={music.cover}
                    alt={music.title}
                    sx={{ width: 220, height: 220, objectFit: 'cover', borderRadius: '12px 12px 0 0', background: '#222' }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/220x220?text=No+Image'; }}
                  />
                ) : (
                  <Box sx={{ width: 220, height: 220, background: '#222', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24 }}>
                    No Image
                  </Box>
                )}
                <CardContent sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" fontWeight="bold">{music.title}</Typography>
                  <Typography color="text.secondary" sx={{ color: '#1ed760' }}>{music.artist}</Typography>
                  <audio controls style={{ width: "100%", marginTop: 10 }}>
                    <source src={music.url} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  <IconButton onClick={() => toggleFavorite(music)} sx={{ mt: 1, color: isFavorite(music) ? '#1ed760' : '#fff' }}>
                    {isFavorite(music) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleEditMusic(music, idx)} sx={{ mt: 1, color: '#ffb300' }} aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteMusic(music)} sx={{ mt: 1, color: '#ff1744' }} aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
      {/* Edit Music Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Music</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editForm.title}
            onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            label="Artist"
            fullWidth
            margin="normal"
            value={editForm.artist}
            onChange={e => setEditForm(prev => ({ ...prev, artist: e.target.value }))}
          />
          <Box mt={2} mb={2}>
            <Button variant="contained" component="label" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>
              Change Image
              <input type="file" accept="image/*" hidden onChange={handleEditCoverChange} />
            </Button>
            {editForm.cover && (
              <Avatar src={editForm.cover} sx={{ width: 60, height: 60, ml: 2 }} />
            )}
          </Box>
          <Box mt={2}>
            <audio src={editForm.url} controls style={{ width: '100%' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ background: '#1ed760', color: '#23272f', fontWeight: 'bold' }}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* CSS Animations */}
      <style>{`
        @keyframes bannerFadeIn {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}

export default Home; 