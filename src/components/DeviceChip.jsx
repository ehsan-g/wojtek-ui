// src/components/DeviceTypeChip.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { DEVICE_TYPE_META } from '../utils/enums';

function contrastColor(hex) {
  if (!hex) return '#000';
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? '#000' : '#fff';
}

/**
 * DeviceTypeChip
 */
export default function DeviceTypeChip({
  type,
  device,
  typeField = 'type',
  size = 'small',
  variant = 'outlined',
  overrideMap,
  sx,
  ...rest
}) {
  const rawType = type ?? (device ? device[typeField] : undefined);
  const key = rawType == null ? 'unknown' : String(rawType).toLowerCase();

  const map = { ...DEVICE_TYPE_META, ...(overrideMap || {}) };
  const meta = map[key] || { label: String(rawType ?? 'Unknown'), color: map.unknown.color };

  const bg = variant === 'filled' ? meta.color : 'transparent';
  const textColor = variant === 'filled' ? contrastColor(meta.color) : meta.color;
  const border = variant === 'outlined' ? `1px solid ${meta.color}` : 'none';

  return (
    <Chip
      component="span" // <- KEY FIX: render inline element so it can be safely placed inside <p>
      label={meta.label}
      size={size}
      variant={variant === 'outlined' ? 'outlined' : 'filled'}
      sx={{
        bgcolor: bg,
        color: textColor,
        border,
        fontWeight: 600,
        height: size === 'small' ? 28 : 32,
        ...(sx || {}),
        ...(variant === 'outlined' && { backgroundColor: 'transparent' }),
      }}
      {...rest}
    />
  );
}

DeviceTypeChip.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  device: PropTypes.object,
  typeField: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  variant: PropTypes.oneOf(['filled', 'outlined']),
  overrideMap: PropTypes.object,
  sx: PropTypes.object,
};
