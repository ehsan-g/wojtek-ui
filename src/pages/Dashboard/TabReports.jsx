import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReports,
  selectReports,
  selectReportsLoading,
  selectReportsError,
} from '../../redux/slices/logsSlice';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { COLOR_POOL } from '../../utils/enums';

function formatTimestamp(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function TabReports({ initialLimit }) {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports) || [];
  const loading = useSelector(selectReportsLoading);
  const error = useSelector(selectReportsError);

  // fetch once on mount
  useEffect(() => {
    dispatch(fetchReports({ limit: initialLimit }));
  }, [dispatch, initialLimit]);

  return (
    <Box sx={{ p: 0, fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography component="h3" variant="h6" sx={{ color: '#e6eef3', m: 0 }}>
          Reports
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          backgroundColor: '#0f1720',
          color: '#e6eef3',
          borderRadius: 1,
          p: 1,
          maxHeight: '100vh',
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.03)',
        }}
        role="region"
        aria-live="polite"
      >
        {error && <Typography sx={{ color: '#fb7185', px: 1, py: 0.5 }}>Error: {error}</Typography>}

        {reports.length === 0 && !loading && !error && (
          <Box sx={{ px: 1, py: 1 }}>
            <Typography sx={{ color: '#9ca3af' }}>No reports found</Typography>
          </Box>
        )}

        <List disablePadding>
          {reports.map((r, idx) => (
            <React.Fragment key={r.id ?? `${r.createdAt}-${idx}`}>
              <ListItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.25,
                  px: 1,
                }}
                role="listitem"
              >
                <Box sx={{ flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: COLOR_POOL[r.theDevice.type - 1], fontWeight: 700 }}>
                      [{r.theDevice.name}]
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>
                      {formatTimestamp(r.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(147,197,253,0.06)',
                      color: COLOR_POOL[r.theDevice.type - 1],
                      px: 0.75,
                      py: '2px',
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    LOG
                  </Box>
                </Box>
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.02)' }} />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

TabReports.propTypes = {
  initialLimit: PropTypes.number,
};
