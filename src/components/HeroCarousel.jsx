import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';

const images = [
  // Replace with your own beach/tropical images if desired
  'https://growbilliontrees.com/cdn/shop/files/iStock-472102653-beach-cleaning.jpg?v=1734761735&width=1500',
  'https://drishtifoundation.org/wp-content/uploads/2024/12/brian-yurasits-PzQNdXw2a6g-unsplash-scaled.jpg',
  'https://thecsrjournal.in/wp-content/uploads/2024/06/Kalpataru-beach-clean-up-drive-Prabhadevi.jpg',
  'https://static.pib.gov.in/WriteReadData/userfiles/image/Coastal5FHL6.jpg',
];

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);

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
        mb: 4,
        borderRadius: { xs: 3, md: 0 },
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        aspectRatio: '16/6',
        background: '#eee',
      }}
    >
      <img
        src={images[idx]}
        alt="Beach carousel"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
};

export default HeroCarousel; 