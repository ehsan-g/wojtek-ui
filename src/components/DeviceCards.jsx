import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import ReportIcon from '@mui/icons-material/Report';
import { useTheme } from '@mui/material/styles';
import { COLOR_POOL, SHAPES } from '../utils/enums';
import DeviceTypeChip from './DeviceChip';
import VerticalMenu from './Layout/VerticalMenu';
import { deleteDevice } from '../redux/slices/deviceSlice';
import { useDispatch } from 'react-redux';
import { relativeTime } from '../utils/helpers';

function initials(text = '') {
  const parts = String(text || '')
    .trim()
    .split(/\s+/);
  return parts
    .map((s) => s[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');
}

export default function DeviceCards({ devices }) {
  const dispatch = useDispatch();

  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(null);

  const assignments = useMemo(() => {
    const map = new Map();

    devices.forEach((d, idx) => {
      const assignedShape = SHAPES[d.type - 1];
      const assignedColor = COLOR_POOL[d.type - 1];

      const mapKey = d.id || `${d.name}-${idx}`;
      map.set(String(mapKey), { shape: assignedShape, color: assignedColor });
    });

    return map;
  }, [devices]);

  const handleCardClick = (id) => setSelectedId(id);
  const shortDate = (v) => (v ? new Date(v).toLocaleDateString() : '—');

  const handleDelete = (deviceId) => {
    dispatch(deleteDevice(deviceId));
  };

  return (
    <Grid container spacing={2}>
      {devices.map((d, idx) => {
        const idKey = String(d.id || `${d.name || d.type}-${idx}`);
        const { shape, color } = assignments.get(idKey) || {
          shape: SHAPES[idx % SHAPES.length],
          color: COLOR_POOL[idx % COLOR_POOL.length],
        };

        const name = d.name || d.type || 'Unnamed device';
        const isSelected = selectedId === idKey;
        const reportCount =
          d.reportCount != null ? d.reportCount : Array.isArray(d.reports) ? d.reports.length : 0;

        return (
          <Grid
            item
            key={idKey}
            xs={12}
            sm={6}
            md={4}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 420 },
                borderRadius: 2,
                border: isSelected
                  ? `1px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: 'transform 160ms ease, border-color 160ms ease',
                '&:hover': { transform: 'translateY(-3px)' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* top row: actionable area + menu column (menu is outside the action area) */}
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <CardActionArea
                  onClick={() => handleCardClick(idKey)}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    textAlign: 'left',
                    p: 1,
                  }}
                >
                  {/* avatar column — made more room for avatar */}
                  <Box
                    sx={{ minWidth: { xs: 56, sm: 80 }, display: 'flex', justifyContent: 'center' }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 48, sm: 64 },
                        height: { xs: 48, sm: 64 },
                        fontWeight: 800,
                        bgcolor: color,
                        ...shape.sx,
                        flexShrink: 0,
                      }}
                      aria-label={`${name} avatar (${shape?.name})`}
                    >
                      {initials(name)}
                    </Avatar>
                  </Box>

                  {/* main content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}
                    >
                      {name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1.25,
                        alignItems: 'center',
                        mt: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{ color: 'text.secondary', fontSize: '0.78rem', maxWidth: '45%' }}
                      >
                        <DeviceTypeChip type={d.type} />
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ReportIcon sx={{ width: 14, height: 14, color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                          {reportCount}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UpdateIcon sx={{ width: 14, height: 14, color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                          {relativeTime(d.updatedAt)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon
                          sx={{ width: 14, height: 14, color: 'text.secondary' }}
                        />
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                          {shortDate(d.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardActionArea>

                {/* menu column: outside CardActionArea so clicks don't toggle selection; vertically centered */}
                <Box
                  sx={{
                    width: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VerticalMenu onDelete={handleDelete} id={idKey} />
                </Box>
              </Box>

              {/* description: only visible when selected, animated collapse */}
              <Collapse in={isSelected} timeout="auto" unmountOnExit>
                <Box sx={{ textAlign: 'center', px: 2, pb: 1, pt: 1 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>ID: {d.id}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {d.description}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

DeviceCards.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.any,
      name: PropTypes.string,
      description: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      reports: PropTypes.array,
      reportCount: PropTypes.number,
    })
  ),
};
