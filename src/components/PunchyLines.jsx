import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const punchyLines = [
  {
    text: "100 Bottles = 1 Dolphin Saved",
    emoji: "🐬",
    color: "#4CAF50"
  },
  {
    text: "1 Straw Less = A Turtle Breathes Easy",
    emoji: "🐢",
    color: "#2196F3"
  },
  {
    text: "Every Bag You Pick = A Seal's Hug of Thanks",
    emoji: "🦭",
    color: "#FF9800"
  },
  {
    text: "200 Cigarette Butts = 1 Baby Penguin's Chance",
    emoji: "🐧",
    color: "#9C27B0"
  },
  {
    text: "1 Hour of Cleanup = 10 Jellyfish Safer",
    emoji: "🪼",
    color: "#E91E63"
  },
  {
    text: "1 Bottle Cap Removed = No More Pain for a Seagull",
    emoji: "🦅",
    color: "#607D8B"
  },
  {
    text: "500 Plastic Pieces Gone = A Whale Swims Free",
    emoji: "🐋",
    color: "#3F51B5"
  },
  {
    text: "10 Plastic Rings Cut = No Choking Sea Lions",
    emoji: "🦭",
    color: "#795548"
  },
  {
    text: "100 Microplastics Out = 1 Coral Reef Smiles",
    emoji: "🪸",
    color: "#00BCD4"
  },
  {
    text: "1 Trash Bag Filled = A Beach Crab's Safe Crawl",
    emoji: "🦀",
    color: "#F44336"
  }
];

const PunchyLines = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % punchyLines.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const currentLine = punchyLines[currentIndex];

  return (
    <Card
      sx={{
        background: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: `2px solid ${currentLine.color}30`,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${currentLine.color}, ${currentLine.color}80)`,
        }
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${currentLine.color}10, transparent)`,
            animation: 'shimmer 2s infinite',
          },
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' }
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: currentLine.color,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            mb: 2,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            animation: 'fadeInOut 2s ease-in-out',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '20%': { opacity: 1, transform: 'translateY(0)' },
              '80%': { opacity: 1, transform: 'translateY(0)' },
              '100%': { opacity: 0, transform: 'translateY(-10px)' }
            }
          }}
        >
          {currentLine.emoji} {currentLine.text} {currentLine.emoji}
        </Typography>
        
        {/* Progress dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {punchyLines.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: index === currentIndex ? currentLine.color : '#e0e0e0',
                transition: 'all 0.3s ease',
                transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                boxShadow: index === currentIndex ? `0 0 8px ${currentLine.color}40` : 'none'
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PunchyLines; 