import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme, useMediaQuery } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

const COLORS = {
  green: '#A8E6CF',
  yellow: '#ffc107',
  black: '#111',
  background: '#fff',
  card: '#fff',
  accentBlue: '#B3E5FC',
  accentBrown: '#D7CCC8',
};

const events = [
  {
    id: 1,
    name: "Best Out of Waste - Bag Making",
    description: "Create a reusable bag from collected plastic waste. Submit your entry and vote for your favorite!",
    status: "Ongoing",
    image: "https://i.pinimg.com/736x/37/92/20/3792202826b801dd2ffae41c298f624c.jpg"
  },
  {
    id: 2,
    name: "Mat Crafting Challenge",
    description: "Turn old t-shirts and waste into beautiful mats. Show your creativity!",
    status: "Upcoming",
    image: "https://shopdag.com/wp-content/uploads/2023/01/Mask-group-5.png"
  },
  {
    id: 3,
    name: "Plastic Bottle Crafting",
    description: "Turn old plastic bottles into beautiful crafts. Show your creativity!",
    status: "Upcoming",
    image: "https://static-cdn.toi-media.com/www/uploads/2018/08/000_18D7PC.jpg"
  },
];

const GamificationEvents = ({ user, joined, voted, onJoin, onVote }) => {
  const [eventStats, setEventStats] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "eventStats"));
        const stats = {};
        querySnapshot.docs.forEach(doc => {
          stats[doc.id] = doc.data();
        });
        setEventStats(stats);
      } catch (error) {
        console.error("Error fetching event stats:", error);
      }
    };
    fetchEventStats();
  }, []);

  const handleJoin = async (eventId) => {
    if (!user) {
      alert("Please log in to join events!");
      return;
    }
    
    try {
      // Update local state
      onJoin(eventId);
      
      // Update Firebase
      const eventRef = doc(db, "eventStats", `event_${eventId}`);
      const currentStats = eventStats[`event_${eventId}`] || { joins: 0, votes: 0 };
      
      await setDoc(eventRef, {
        joins: currentStats.joins + 1,
        votes: currentStats.votes || 0,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      // Update local stats
      setEventStats(prev => ({
        ...prev,
        [`event_${eventId}`]: {
          ...prev[`event_${eventId}`],
          joins: (prev[`event_${eventId}`]?.joins || 0) + 1
        }
      }));
      
      alert("Successfully joined the event! 🎉");
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join event. Please try again.");
    }
  };

  const handleVote = async (eventId) => {
    if (!user) {
      alert("Please log in to vote!");
      return;
    }
    
    try {
      // Update local state
      onVote(eventId);
      
      // Update Firebase
      const eventRef = doc(db, "eventStats", `event_${eventId}`);
      const currentStats = eventStats[`event_${eventId}`] || { joins: 0, votes: 0 };
      
      await setDoc(eventRef, {
        joins: currentStats.joins || 0,
        votes: currentStats.votes + 1,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      // Update local stats
      setEventStats(prev => ({
        ...prev,
        [`event_${eventId}`]: {
          ...prev[`event_${eventId}`],
          votes: (prev[`event_${eventId}`]?.votes || 0) + 1
        }
      }));
      
      alert("Vote recorded! Thank you for participating! 🗳️");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to record vote. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        background: COLORS.background,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        maxWidth: 1200,
        mx: 'auto'
      }}
    >
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(280px, 1fr))',
            md: 'repeat(auto-fit, minmax(320px, 1fr))',
            lg: 'repeat(3, 1fr)'
          },
          gap: { xs: 2, sm: 3, md: 4 },
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {events.map(event => {
          const stats = eventStats[`event_${event.id}`] || { joins: 0, votes: 0 };
          const isJoined = joined.includes(event.id);
          const hasVoted = voted.includes(event.id);
          
          return (
            <Card 
              key={event.id} 
              sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', sm: 400, md: 350 },
                borderRadius: { xs: 2, sm: 3, md: 4 }, 
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)', 
                display: 'flex', 
                flexDirection: 'column', 
                background: COLORS.card, 
                p: { xs: 0.5, sm: 1 },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardMedia
                component="img"
                height={isMobile ? "140" : "180"}
                image={event.image}
                alt={event.name}
                sx={{ 
                  borderTopLeftRadius: { xs: 8, sm: 12 }, 
                  borderTopRightRadius: { xs: 8, sm: 12 },
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ flex: 1, p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  sx={{ 
                    fontWeight: 700, 
                    color: COLORS.green, 
                    mb: 1,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.3
                  }}
                >
                  {event.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: COLORS.black, 
                    mb: 2,
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                    lineHeight: 1.5
                  }}
                >
                  {event.description}
                </Typography>
                
                {/* Event Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2, 
                  p: { xs: 0.75, sm: 1 }, 
                  background: 'rgba(168, 230, 207, 0.1)', 
                  borderRadius: 1 
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: COLORS.black, 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    👥 {stats.joins} Joined
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: COLORS.black, 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    🗳️ {stats.votes} Votes
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  mt: 2,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="contained"
                    onClick={() => handleJoin(event.id)}
                    disabled={isJoined}
                    fullWidth={isMobile}
                    sx={{
                      background: isJoined ? COLORS.accentBrown : COLORS.green,
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      py: { xs: 1, sm: 1.25 },
                      '&:hover': { background: isJoined ? COLORS.accentBrown : COLORS.accentBlue },
                      '&:disabled': { background: COLORS.accentBrown, color: '#666' }
                    }}
                  >
                    {isJoined ? '✅ Joined' : 'Join'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleVote(event.id)}
                    disabled={hasVoted}
                    fullWidth={isMobile}
                    sx={{
                      background: hasVoted ? COLORS.accentBrown : COLORS.yellow,
                      color: hasVoted ? '#666' : COLORS.black,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      py: { xs: 1, sm: 1.25 },
                      '&:hover': { background: hasVoted ? COLORS.accentBrown : COLORS.accentBrown },
                      '&:disabled': { background: COLORS.accentBrown, color: '#666' }
                    }}
                  >
                    {hasVoted ? '✅ Voted' : 'Vote'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default GamificationEvents; 