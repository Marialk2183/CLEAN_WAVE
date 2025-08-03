import React from "react";
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Box from '@mui/material/Box';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
};

const NotificationBell = ({ count = 0 }) => {
  return (
    <Box sx={{ background: COLORS.card, borderRadius: 3, p: 1.5, display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Badge badgeContent={count} color="primary" sx={{ '& .MuiBadge-badge': { background: COLORS.accentBlue, color: '#333', fontWeight: 700 } }}>
        <IconButton sx={{ color: COLORS.accentBrown }}>
          <NotificationsIcon />
        </IconButton>
      </Badge>
    </Box>
  );
};

export default NotificationBell; 