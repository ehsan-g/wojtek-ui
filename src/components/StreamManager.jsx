import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import VideoCard from './VideoCard';
import PropTypes from 'prop-types';

export default function StreamManager({ title }) {
  const theme = useTheme();

  const [streams, setStreams] = useState([]);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  // load & sanitize once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('streams');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const sanitized = parsed
        .map((s, idx) => {
          if (!s) return null;
          const u = (s.url || s.streamUrl || s.href || '').toString().trim();
          const l = (s.label || s.name || `Stream ${idx + 1}`).toString();
          if (!u) return null;
          return { id: s.id || Date.now() + idx, label: l || 'Stream', url: u };
        })
        .filter(Boolean);

      if (sanitized.length > 0) {
        setStreams(sanitized);
        try {
          localStorage.setItem('streams', JSON.stringify(sanitized));
        } catch (err) {
          console.warn('Failed to rewrite sanitized streams to storage:', err);
        }
      } else if (parsed.length > 0) {
        // fallback: keep parsed entries (avoid losing user data)
        const fallback = parsed.map((s, idx) => ({
          id: s && s.id ? s.id : Date.now() + idx,
          label: s && (s.label || s.name) ? s.label || s.name : `Stream ${idx + 1}`,
          url: s && (s.url || s.streamUrl) ? s.url || s.streamUrl : '',
        }));
        setStreams(fallback);
      }
    } catch (err) {
      console.warn(
        'Failed to load/parse streams from localStorage; leaving stored value untouched.',
        err
      );
    }
  }, []);

  // persist whenever streams change
  useEffect(() => {
    try {
      localStorage.setItem('streams', JSON.stringify(streams));
    } catch (err) {
      console.warn('Failed to save streams to localStorage:', err);
    }
  }, [streams]);

  const handleAdd = () => {
    const cleanLabel = (label || 'Stream').trim();
    const cleanUrl = (url || '').trim();
    if (!cleanUrl) return;
    const entry = { id: Date.now(), label: cleanLabel || 'Stream', url: cleanUrl };
    setStreams((s) => [...s, entry]);
    setLabel('');
    setUrl('');
    setOpen(false);
  };

  const handleRemove = (id) => setStreams((s) => s.filter((x) => x.id !== id));

  const openAddDialog = () => setOpen(true);

  // The clickable Add card (used both for empty-state and as grid item)
  const AddCard = ({ large = false }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: 'divider',
        p: large ? 6 : 2,
      }}
    >
      <CardActionArea onClick={openAddDialog} sx={{ width: '100%', height: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant={large ? 'h6' : 'subtitle1'} gutterBottom>
            {title}
          </Typography>
          {large ? (
            <Typography color="text.secondary">
              Click anywhere here to add your first stream.
            </Typography>
          ) : (
            <Button variant="outlined" sx={{ mt: 1 }}>
              + Add Stream
            </Button>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );

  AddCard.propTypes = {
    large: PropTypes.bool,
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Grid container spacing={2}>
        {streams.length === 0 ? (
          // Large clickable add card when empty
          <Grid item xs={12}>
            <AddCard large />
          </Grid>
        ) : (
          <>
            {streams.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <VideoCard title={s.label} streamUrl={s.url} onRemove={() => handleRemove(s.id)} />
              </Grid>
            ))}
          </>
        )}
      </Grid>

      {/* Add stream dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          Add stream
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
          <TextField
            label="Label"
            fullWidth
            margin="dense"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <TextField
            label="Stream URL"
            fullWidth
            margin="dense"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            helperText="e.g. http://domain-ip"
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
StreamManager.propTypes = {
  title: PropTypes.string,
};
