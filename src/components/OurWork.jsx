import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const COLORS = {
  green: '#A8E6CF',
  yellow: '#ffc107',
  black: '#111',
  background: '#fff',
  card: '#fff',
  accentBlue: '#B3E5FC',
  accentBrown: '#D7CCC8',
};

const pastEvents = [
  {
    id: 1,
    location: "Juhu Beach",
    year: "2021",
    date: "March 15, 2021",
    image:"https://im.rediff.com/news/2022/sep/11mumbai-clean-up1.jpg?w=670&h=900",
    volunteers: 45,
    wasteCollected: 125,
    description: "Our first major beach cleanup event at Juhu Beach. Volunteers worked tirelessly to remove plastic waste and debris from the shoreline."
  },
  {
    id: 2,
    location: "Versova Beach",
    year: "2023",
    date: "August 22, 2023",
    image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2017/06/06/581890-juhu-residents-beach-clean-up.jpg",
    volunteers: 78,
    wasteCollected: 210,
    description: "A successful cleanup drive at Versova Beach with record participation. We collected over 200kg of waste including plastic bottles, fishing nets, and microplastics."
  },
  {
    id: 3,
    location: "Chowpati Beach",
    year: "2025",
    date: "January 10, 2025",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkq0pjG-geKOq3M7AnU3kYNQR2uz88WJxNagqLeusIUI5LWNU1quXKvvHhN7XGK_qSqRk&usqp=CAU",
    volunteers: 92,
    wasteCollected: 185,
    description: "Our latest cleanup event at Chowpati Beach. The community came together to protect our marine ecosystem and create awareness about ocean pollution."
  }
];

const OurWork = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="work"
      sx={{
        width: '100vw',
        minHeight: '70vh',
        py: 6,
        px: 2,
        backgroundColor: '#d9d2b4',
        backgroundImage: 'linear-gradient(135deg, #d9d2b4 0%, #f5f5dc 100%)'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          color: '#000',
          textAlign: 'center',
          mb: 6,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        🌊 Our Work
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center',
          color: '#333',
          mb: 5,
          px: { xs: 2, sm: 4, md: 8 },
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
        }}
      >
        Discover our impactful beach cleanup events across Mumbai's beautiful coastline
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          overflowX: 'auto',
          py: 2,
          px: 2,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          mx: { xs: 1, sm: 2, md: 4 },
          '&::-webkit-scrollbar': {
            height: 8
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#aaa',
            borderRadius: 4
          }
        }}
      >
        {pastEvents.map((event) => (
                      <Card
              key={event.id}
              sx={{
                minWidth: 320,
                maxWidth: 380,
                flex: '0 0 auto',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                transition: '0.3s',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                }
              }}
            >
            <CardMedia
              component="img"
              height="200"
              image={event.image}
              alt={`${event.location} cleanup`}
              sx={{
                objectFit: 'cover',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
              }}
            />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: COLORS.green,
                    fontSize: { xs: '1.2rem', sm: '1.3rem' }
                  }}
                >
                  {event.location}
                </Typography>
                <Box sx={{ 
                  background: COLORS.yellow, 
                  color: COLORS.black, 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {event.year}
                </Box>
              </Box>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  mb: 2,
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                📅 {event.date}
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: COLORS.black, 
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: '0.95rem'
                }}
              >
                {event.description}
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2,
                p: 2,
                background: 'rgba(168, 230, 207, 0.15)',
                borderRadius: 2
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: COLORS.green,
                      fontSize: '1.1rem'
                    }}
                  >
                    {event.volunteers}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    👥 Volunteers
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: COLORS.yellow,
                      fontSize: '1.1rem'
                    }}
                  >
                    {event.wasteCollected} kg
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    🗑️ Waste Collected
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default OurWork; 