import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';

export default function VerticalMenu({ onDelete, ariaLabel = 'more actions', id }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = () => {
    handleClose();
    if (onDelete) onDelete(id);
  };

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        aria-controls={open ? id : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ elevation: 2 }}
      >
        <MenuItem onClick={handleDelete} data-testid="delete-menu-item">
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

VerticalMenu.propTypes = {
  onDelete: PropTypes.func,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
};
