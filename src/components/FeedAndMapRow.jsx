import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PostFeed from './PostFeed';
import EventsMap from './EventsMap';

const COLORS = {
  background: '#fff',
  card: '#fff',
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const FeedAndMapRow = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        my: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'stretch',
        background: COLORS.background,
        py: 2,
      }}
    >
      <Card sx={{ flex: 1, minWidth: 320, maxWidth: 600, mb: { xs: 4, md: 0 }, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 4, display: 'flex', flexDirection: 'column', background: COLORS.card, p: 2 }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          <PostFeed />
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 320, maxWidth: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 4, display: 'flex', flexDirection: 'column', background: COLORS.card, p: 2 }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          <EventsMap />
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedAndMapRow; 