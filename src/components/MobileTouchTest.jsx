import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const MobileTouchTest = () => {
  const [touchCount, setTouchCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastEvent, setLastEvent] = useState('None');

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTouchCount(prev => prev + 1);
    setLastEvent('Touch Start');
    console.log('Touch Start Event:', e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLastEvent('Touch End');
    console.log('Touch End Event:', e);
  };

  const handleTouchCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLastEvent('Touch Cancel');
    console.log('Touch Cancel Event:', e);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setClickCount(prev => prev + 1);
    setLastEvent('Click');
    console.log('Click Event:', e);
  };

  const resetCounts = () => {
    setTouchCount(0);
    setClickCount(0);
    setLastEvent('Reset');
  };

  return (
    <Card sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mb: 3,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#E4405F' }}>
          🧪 Mobile Touch Test
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Touch Count: {touchCount}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Click Count: {clickCount}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Last Event: {lastEvent}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            variant="contained"
            fullWidth
            sx={{
              background: '#A8E6CF',
              color: '#111',
              minHeight: '48px',
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            🖱️ Test Click & Touch
          </Button>

          <Button
            onClick={resetCounts}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#E4405F',
              color: '#E4405F',
              minHeight: '48px',
              '&:hover': { borderColor: '#C13584', color: '#C13584' }
            }}
          >
            🔄 Reset Counts
          </Button>
        </Box>

        <Box sx={{ mt: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            <strong>Instructions:</strong><br/>
            1. Tap the test button above<br/>
            2. Check if touch events are registered<br/>
            3. Compare touch vs click counts<br/>
            4. Use this to debug mobile issues
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MobileTouchTest; 