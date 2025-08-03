import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
};

// Example admin stats data
const adminStats = [
  { label: "Events Managed", value: 12 },
  { label: "Active Volunteers", value: 54 },
  { label: "NGOs Registered", value: 8 },
  { label: "Pending Approvals", value: 3 },
];

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.background,
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 700, width: '100%', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', background: COLORS.card, p: 2 }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.accentBrown, mb: 3, textAlign: 'center', letterSpacing: 0.5 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {adminStats.map((stat) => (
              <Box key={stat.label} sx={{ flex: '1 1 120px', minWidth: 120, background: COLORS.accentBlue, borderRadius: 3, p: 2, textAlign: 'center', mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.accentBrown }}>{stat.label}</Typography>
              </Box>
            ))}
          </Box>
          {/* Add more admin dashboard content here, using MUI components and similar sx styling for a modern, clean look */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard; 