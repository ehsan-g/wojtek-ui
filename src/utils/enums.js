export const DeviceTypes = {
  EVENT: 1,
  CAMERA: 2,
  MOTION: 3,
  STREAM: 4,
  GPS: 5,
  ROUTER: 6,
};

export const SHAPES = [
  { name: 'pill', sx: { borderRadius: 999 } },
  { name: 'squircle', sx: { borderRadius: '22%' } },
  {
    name: 'custom',
    sx: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)' },
  },
  { name: 'circle', sx: { borderRadius: '50%' } },

  {
    name: 'hexagon',
    sx: { clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)' },
  },
  { name: 'diamond', sx: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' } },
  {
    name: 'custom2',
    sx: {
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    },
  },
];

export const COLOR_POOL = ['#F59E0B', '#EF4444', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899'];

export const DEVICE_TYPE_META = {
  [DeviceTypes.EVENT]: { label: 'Event', color: COLOR_POOL[0] },
  [DeviceTypes.CAMERA]: { label: 'Camera', color: COLOR_POOL[1] },
  [DeviceTypes.MOTION]: { label: 'Motion', color: COLOR_POOL[2] },
  [DeviceTypes.STREAM]: { label: 'Stream', color: COLOR_POOL[3] },
  [DeviceTypes.GPS]: { label: 'GPS', color: COLOR_POOL[4] },
  [DeviceTypes.ROUTER]: { label: 'Router', color: COLOR_POOL[5] },
  unknown: { label: 'Unknown', color: '#94A3B8' }, // slate/neutral
};
