import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Slide,
  Box,
  Typography,
  Alert,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createDevice, fetchMyDevices } from '../../redux/slices/deviceSlice';
import { useDispatch } from 'react-redux';
import { DeviceTypes } from '../../utils/enums';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddFormDialog({ open, onClose, title }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(0);
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setName('');
      setDescription('');
      setType(0);
      setLocalError(null);
      setSubmitting(false);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    dispatch(fetchMyDevices());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setLocalError(null);
    setSuccess(false);

    if (!name.trim()) {
      setLocalError('Name is required');
      return;
    }

    if (!type) {
      setLocalError('Type is required');
      return;
    }

    setSubmitting(true);

    try {
      // if createDevice is a redux-thunk that returns a promise you could `await dispatch(createDevice(...)).unwrap()`
      // here we'll dispatch and attempt to handle it gracefully.
      await dispatch(
        createDevice({ type: Number(type), name: name.trim(), description: description.trim() })
      );

      setSuccess(true);
      setName('');
      setDescription('');
      setType('');

      // optionally refetch devices
      dispatch(fetchMyDevices());
    } catch (err) {
      setLocalError(err?.message ?? 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose && onClose()}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          px: 0,
          pb: 1,
          borderTop: (theme) => `4px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
        },
      }}
      aria-labelledby="add-form-dialog-title"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 1,
        }}
      >
        <DialogTitle id="add-form-dialog-title" sx={{ m: 0 }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: 800 }}>
            {title || 'Add Item'}
          </Typography>
        </DialogTitle>
        <IconButton aria-label="close dialog" onClick={() => onClose && onClose()}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Box component="form" id="add-form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
          <StackedFields
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            type={type}
            setType={setType}
            localError={localError}
          />
        </Box>

        {localError && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{localError}</Alert>
          </Box>
        )}

        {success && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">Saved ✔</Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2 }}>
        <Button variant="outlined" onClick={() => onClose && onClose()} disabled={submitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="add-form"
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
};

// small sub-component for layout clarity
function StackedFields({ name, setName, description, setDescription, type, setType, localError }) {
  const theme = useTheme();

  const nameError = !name?.trim() && !!localError?.toLowerCase().includes('name');
  const typeError = !type && !!localError?.toLowerCase().includes('type');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
        variant="outlined"
        fullWidth
        inputProps={{ 'aria-label': 'name' }}
        error={nameError}
        helperText={nameError ? 'Name is required' : ''}
      />

      <FormControl fullWidth size="small" error={typeError}>
        <InputLabel id="type-select-label">Type *</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={type}
          label="Type *"
          onChange={(e) => setType(e.target.value)}
          inputProps={{
            'aria-label': 'type',
          }}
        >
          {Object.keys(DeviceTypes).map((t) => (
            <MenuItem
              key={t}
              value={DeviceTypes[t]}
              sx={{
                backgroundColor: theme.palette.background.default,
              }}
            >
              {t}
            </MenuItem>
          ))}
        </Select>
        {typeError ? <FormHelperText>Type is required</FormHelperText> : null}
      </FormControl>

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        size="small"
        variant="outlined"
        fullWidth
        multiline
        minRows={3}
        inputProps={{ 'aria-label': 'description' }}
      />
    </Box>
  );
}

StackedFields.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  type: PropTypes.number,
  setType: PropTypes.func.isRequired,
  localError: PropTypes.string,
};
