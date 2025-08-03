


import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme, useMediaQuery } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';

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
  {
    id: 4,
    name: "Bottle Blitz",
    description: "Find the most bottles in 15 minutes",
    status: "Upcoming",
    image: "https://images.pexels.com/photos/18674200/pexels-photo-18674200/free-photo-of-empty-plastic-bottle-in-sand.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
];

const GamificationEvents = ({ user, joined, voted, onJoin, onVote }) => {
  const [eventStats, setEventStats] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      onJoin(eventId);
      const eventRef = doc(db, "eventStats", `event_${eventId}`);
      const currentStats = eventStats[`event_${eventId}`] || { joins: 0, votes: 0 };

      await setDoc(eventRef, {
        joins: currentStats.joins + 1,
        votes: currentStats.votes,
        lastUpdated: serverTimestamp()
      }, { merge: true });

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
      onVote(eventId);
      const eventRef = doc(db, "eventStats", `event_${eventId}`);
      const currentStats = eventStats[`event_${eventId}`] || { joins: 0, votes: 0 };

      await setDoc(eventRef, {
        joins: currentStats.joins,
        votes: currentStats.votes + 1,
        lastUpdated: serverTimestamp()
      }, { merge: true });

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
        width: '100%',
        minHeight: '70vh',
        py: 6,
        px: { xs: 1, sm: 2, md: 3 },
        backgroundColor:'#d9d2b4',
        backgroundImage: 'linear-gradient(135deg, #d9d2b4 0%, #f5f5dc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography 
        variant="h4" 
        
        sx={{ 
          fontWeight: 700, 
          color: '#000',
          textAlign: 'center',
          mb: 4
        }}
      >
        🎮 Gamification Events
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
          mx: 'auto',
          maxWidth: '95%',
          width: 'fit-content',
          justifyContent: 'center',
          alignItems: 'center',
          '&::-webkit-scrollbar': {
            height: 8
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#aaa',
            borderRadius: 4
          }
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
                height="160"
                image={event.image}
                alt={event.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.black, mb: 1 }}>
                  {event.name}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.black, mb: 2 }}>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>👥 {stats.joins} Joined</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>🗳️ {stats.votes} Votes</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleJoin(event.id)}
                    disabled={isJoined}
                    sx={{
                      background: isJoined ? COLORS.accentBrown : COLORS.green,
                      color: '#000',
                      fontWeight: 600,
                      flex: 1,
                      '&:disabled': { color: '#666' }
                    }}
                  >
                    {isJoined ? '✅ Joined' : 'Join'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleVote(event.id)}
                    disabled={hasVoted}
                    sx={{
                      background: hasVoted ? COLORS.accentBrown : COLORS.yellow,
                      color: '#000',
                      fontWeight: 600,
                      flex: 1,
                      '&:disabled': { color: '#666' }
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
