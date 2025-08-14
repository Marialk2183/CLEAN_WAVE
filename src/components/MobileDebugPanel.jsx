import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme, useMediaQuery } from '@mui/material';

const MobileDebugPanel = () => {
  const [touchCount, setTouchCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastEvent, setLastEvent] = useState('None');
  const [deviceInfo, setDeviceInfo] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get device information
  React.useEffect(() => {
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      isMobile: isMobile
    });
  }, [isMobile]);

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

  const testLoginButton = () => {
    alert('Login button test: This should work on mobile!');
  };

  if (!isMobile) {
    return null; // Only show on mobile
  }

  return (
    <Card sx={{ 
      maxWidth: 500, 
      mx: 'auto', 
      mb: 3,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      borderRadius: 3,
      background: '#f8f9fa'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#E4405F' }}>
          🧪 Mobile Debug Panel
        </Typography>
        
        {/* Device Information */}
        <Box sx={{ mb: 3, p: 2, background: '#e9ecef', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Device Info:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Touch Support: {deviceInfo.touchSupport ? '✅ Yes' : '❌ No'}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Max Touch Points: {deviceInfo.maxTouchPoints}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Viewport: {deviceInfo.viewport}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Pixel Ratio: {deviceInfo.pixelRatio}
          </Typography>
        </Box>

        {/* Event Counters */}
        <Box sx={{ mb: 3 }}>
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

        {/* Test Buttons */}
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
            onClick={testLoginButton}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#E4405F',
              color: '#E4405F',
              minHeight: '48px',
              '&:hover': { borderColor: '#C13584', color: '#C13584' }
            }}
          >
            🔐 Test Login Button
          </Button>

          <Button
            onClick={resetCounts}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#666',
              color: '#666',
              minHeight: '48px'
            }}
          >
            🔄 Reset Counts
          </Button>
        </Box>

        {/* Instructions */}
        <Box sx={{ mt: 3, p: 2, background: '#fff3cd', borderRadius: 2, border: '1px solid #ffeaa7' }}>
          <Typography variant="caption" sx={{ color: '#856404' }}>
            <strong>Instructions:</strong><br/>
            1. Tap the test buttons above<br/>
            2. Check if touch events are registered<br/>
            3. Compare touch vs click counts<br/>
            4. Use this to debug mobile issues<br/>
            5. If buttons don't work, check console for errors
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MobileDebugPanel; 