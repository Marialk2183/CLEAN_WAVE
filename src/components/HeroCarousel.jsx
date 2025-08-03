import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { useTheme, useMediaQuery } from '@mui/material';

const images = [
  // Replace with your own beach/tropical images if desired
  'https://growbilliontrees.com/cdn/shop/files/iStock-472102653-beach-cleaning.jpg?v=1734761735&width=1500',
  'https://drishtifoundation.org/wp-content/uploads/2024/12/brian-yurasits-PzQNdXw2a6g-unsplash-scaled.jpg',
  'https://thecsrjournal.in/wp-content/uploads/2024/06/Kalpataru-beach-clean-up-drive-Prabhadevi.jpg',
  'https://static.pib.gov.in/WriteReadData/userfiles/image/Coastal5FHL6.jpg',
];

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        mt: 0,
        mb: 0,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        aspectRatio: { xs: '16/9', sm: '16/8', md: '16/6' },
        background: 'linear-gradient(135deg, #A8E6CF 0%, #B3E5FC 100%)',
        minHeight: { xs: '250px', sm: '300px', md: '400px' },
        maxHeight: { xs: '350px', sm: '450px', md: '600px' },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(168, 230, 207, 0.3) 0%, rgba(179, 229, 252, 0.3) 100%)',
          zIndex: 1,
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === idx ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              transform: index === idx ? 'scale(1.05)' : 'scale(1)',
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.9) contrast(1.1)',
              }
            }}
          >
            <img
              src={image}
              alt={`Beach carousel ${index + 1}`}
            />
          </Box>
        ))}
        
        {/* Overlay with animated elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              color: '#fff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              animation: 'fadeInUp 2s ease-out',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                letterSpacing: 2,
                animation: 'pulse 3s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            >
              🌊 CleanWave
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                opacity: 0.9,
                animation: 'slideInUp 2.5s ease-out',
                '@keyframes slideInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 0.9,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              Protecting Our Oceans, One Wave at a Time
            </Box>
          </Box>
        </Box>
        
        {/* Floating particles animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            overflow: 'hidden',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite',
            },
            '&::before': {
              top: '20%',
              left: '10%',
              animationDelay: '0s',
            },
            '&::after': {
              top: '60%',
              right: '15%',
              animationDelay: '3s',
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(180deg)' },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroCarousel; 