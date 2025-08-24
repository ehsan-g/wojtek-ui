import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Skeleton,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

const VideoCard = forwardRef(function VideoCard(
  { title, streamUrl, onRemove, autoRefresh = false, interval = 5000 },
  ref
) {
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(true);
  const imgRef = useRef(null);
  const intervalRef = useRef(null);

  const baseUrl = typeof streamUrl === 'string' ? streamUrl.trim() : '';

  // expose kill method to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      kill: () => {
        const node = imgRef.current;
        if (node) {
          try {
            node.src = '';
          } catch (e) {
            console.warn('VideoCard.kill() failed to clear src', e);
          }
        }
        // unmount the image so browser drops connection
        setShow(false);
        setLoaded(false);
      },
    }),
    []
  );

  // reload when URL changes
  useEffect(() => {
    setLoaded(false);
    setReloadKey((k) => k + 1);
    setShow(true);
  }, [baseUrl]);

  // optional auto-refresh
  useEffect(() => {
    if (!autoRefresh || !baseUrl) return undefined;
    intervalRef.current = setInterval(() => {
      handleRefresh();
    }, interval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, interval, baseUrl]);

  // cleanup on unmount (capture node)
  useEffect(() => {
    const node = imgRef.current;
    return () => {
      if (node) {
        try {
          node.src = '';
        } catch (e) {
          /* ignore */
        }
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleRefresh = () => {
    // clear src to kill current connection
    const node = imgRef.current;
    if (node) {
      try {
        node.src = '';
      } catch (e) {
        console.warn('Failed to clear img src on refresh', e);
      }
    }

    setLoaded(false);
    setShow(false);
    // remount with new cache-buster
    setTimeout(() => {
      setReloadKey((k) => k + 1);
      setShow(true);
    }, 80);
  };

  const handleRemoveClick = () => {
    if (typeof onRemove === 'function') onRemove();
  };

  const iconBtnSx = {
    width: 36,
    height: 36,
    padding: 0,
    borderRadius: 1.5,
    bgcolor: 'rgba(0,188,212,0.07)',
    color: 'inherit',
    boxShadow: '0 2px 8px rgba(0,188,212,0.06)',
    '&:hover': { bgcolor: 'rgba(0,188,212,0.12)', transform: 'translateY(-1px)' },
  };

  const headerAction = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
      <Tooltip title="Refresh">
        <IconButton onClick={handleRefresh} size="small" aria-label="refresh" sx={iconBtnSx}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {onRemove && (
        <Tooltip title="Remove">
          <IconButton onClick={handleRemoveClick} size="small" aria-label="remove" sx={iconBtnSx}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  if (!baseUrl) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="subtitle1">{title}</Typography>}
          action={headerAction}
          sx={{
            '& .MuiCardHeader-action': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'nowrap',
            },
          }}
        />
        <CardContent>
          <Box sx={{ p: 2, minHeight: 140 }}>
            <Typography color="text.secondary">No stream URL provided.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const src = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}r=${reloadKey}`;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', position: 'relative' }}>
      <CardHeader
        title={<Typography variant="subtitle1">{title}</Typography>}
        action={headerAction}
        sx={{
          px: 2,
          py: 1,
          '& .MuiCardHeader-action': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'nowrap',
          },
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!loaded && (
            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
          )}

          {show && (
            <img
              ref={imgRef}
              key={reloadKey}
              src={src}
              alt={title}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(false)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: loaded ? 'block' : 'none',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

VideoCard.propTypes = {
  title: PropTypes.string.isRequired,
  streamUrl: PropTypes.string,
  onRemove: PropTypes.func,
  autoRefresh: PropTypes.bool,
  interval: PropTypes.number,
};

export default VideoCard;
