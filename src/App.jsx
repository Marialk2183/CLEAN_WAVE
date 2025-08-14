import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import PostFeed from "./components/PostFeed";
import EventsMap from "./components/EventsMap";
import Chatbot from "./components/Chatbot";
import Leaderboard from "./components/Leaderboard";
import CarbonFootprintCalculator from "./components/CarbonFootprintCalculator";
import SOSButton from "./components/SOSButton";
import GamificationEvents from "./components/GamificationEvents";
import ImageClassifierChatbot from "./components/ImageClassifierChatbot";
import PunchyLines from "./components/PunchyLines";
import OurWork from "./components/OurWork";
import { Card, Alert, Button, Row, Col, Container } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { useTheme, useMediaQuery } from '@mui/material';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import Layout from "./components/Layout";
import HeroCarousel from "./components/HeroCarousel";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SOSNotificationBar from "./components/SOSNotificationBar";
import { Grid, Typography } from '@mui/material';
import { useAppContext } from "./components/AppContext";

const MAP_EVENT_IDS = [1, 2, 3];
const GAMIFICATION_EVENT_IDS = [1, 2];

const theme = createTheme({
  palette: {
    text: {
      primary: '#111',
      secondary: '#222',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    allVariants: {
      color: '#111',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 20);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 20);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <span>{display.toLocaleString()}</span>;
}

function App() {
  const { user, setUser } = useAppContext();
  const [sosAlert, setSosAlert] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [joinedGamification, setJoinedGamification] = useState([]);
  const [votedGamification, setVotedGamification] = useState([]);
  const [helpedMessage, setHelpedMessage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('login');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleAuth = (email, password, mode) => {
    setUser({ email, isAdmin: mode === 'admin' });
    setShowLoginModal(false);
  };
  const handleLogout = () => setUser(null);
  
  const handleLoginClick = () => {
    console.log('🎯 handleLoginClick called!');
    console.log('Setting showLoginModal to true');
    setShowLoginModal(true);
  };

  // Real-time SOS Firestore logic
  useEffect(() => {
    const sosDoc = doc(db, 'sos_alerts', 'latest');
    const unsub = onSnapshot(sosDoc, (snapshot) => {
      if (snapshot.exists() && snapshot.data().status === 'active') {
        setSosAlert(snapshot.data());
      } else {
        setSosAlert(null);
      }
    });
    return () => unsub();
  }, []);

  // When user clicks SOS
  const handleSOS = async () => {
    const sosDoc = doc(db, 'sos_alerts', 'latest');
    await setDoc(sosDoc, {
      sender: user?.email || 'Anonymous',
      time: new Date().toISOString(),
      status: 'active',
      resolved: false
    });
  };

  // When user clicks "Helped"
  const handleHelped = async () => {
    const sosDoc = doc(db, 'sos_alerts', 'latest');
    await updateDoc(sosDoc, { 
      status: 'resolved', 
      resolved: true,
      helpedBy: user?.email || 'Anonymous',
      helpedAt: serverTimestamp()
    });
    setSosAlert(null);
    setHelpedMessage("SOS marked as resolved! Thank you for helping.");
    setTimeout(() => setHelpedMessage(null), 5000);
  };

  const handleJoinMapEvent = (eventId) => {
    if (!user) return;
    if (!joinedEvents.includes(eventId)) {
      setJoinedEvents([...joinedEvents, eventId]);
    }
  };
  const handleJoinGamification = (eventId) => {
    if (!user) return;
    if (!joinedGamification.includes(eventId)) {
      setJoinedGamification([...joinedGamification, eventId]);
    }
  };
  const handleVoteGamification = (eventId) => {
    if (!user) return;
    if (!votedGamification.includes(eventId)) {
      setVotedGamification([...votedGamification, eventId]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout user={user} onLoginClick={handleLoginClick}>
        <HeroCarousel />
        
        {/* Punchy Lines Section */}
        <Box sx={{ 
          mt: { xs: 3, sm: 4, md: 6 },
          mb: { xs: 2, sm: 3, md: 4 }
        }}>
          <PunchyLines />
        </Box>
        
          {user && sosAlert && (
            <Alert 
              variant="danger" 
              className="text-center fw-bold fade-in-section visible" 
              dismissible={false}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 3 }
              }}
            >
              🚨 SOS Alert! {sosAlert.sender} needs help! ({new Date(sosAlert.time).toLocaleTimeString()})
              <Button 
                variant="success" 
                className="ms-3" 
                onClick={handleHelped}
                size={isMobile ? "sm" : "md"}
              >
                Mark as Helped
              </Button>
            </Alert>
          )}
          {helpedMessage && (
            <Alert 
              variant="success" 
              className="text-center fw-bold fade-in-section visible" 
              dismissible={false}
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 3 }
              }}
            >
              {helpedMessage}
            </Alert>
          )}
          
          {/* Our Work Section */}
          <Box sx={{ 
            mt: 4, 
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 }
          }}>
            <OurWork />
          </Box>
          {/* Impact Stats Section */}
          <Row className="mb-4 text-center impact-animate" sx={{ mx: 0 }}>
            <Col xs={6} sm={6} md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-success text-white" sx={{ 
                height: { xs: 'auto', sm: '120px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Card.Body sx={{ p: { xs: 1, sm: 2 } }}>
                  <div className={`fw-bold ${isMobile ? 'fs-4' : 'fs-2'}`}>
                    <AnimatedNumber value={1240} />
                  </div>
                  <div className={isMobile ? 'fs-6' : 'fs-5'}>Bottles Collected</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-info text-white" sx={{ 
                height: { xs: 'auto', sm: '120px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Card.Body sx={{ p: { xs: 1, sm: 2 } }}>
                  <div className={`fw-bold ${isMobile ? 'fs-4' : 'fs-2'}`}>
                    <AnimatedNumber value={87} />
                  </div>
                  <div className={isMobile ? 'fs-6' : 'fs-5'}>Volunteers</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white" sx={{ 
                height: { xs: 'auto', sm: '120px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Card.Body sx={{ p: { xs: 1, sm: 2 } }}>
                  <div className={`fw-bold ${isMobile ? 'fs-4' : 'fs-2'}`}>
                    <AnimatedNumber value={15} />
                  </div>
                  <div className={isMobile ? 'fs-6' : 'fs-5'}>Events Hosted</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={6} md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-dark" sx={{ 
                height: { xs: 'auto', sm: '120px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Card.Body sx={{ p: { xs: 1, sm: 2 } }}>
                  <div className={`fw-bold ${isMobile ? 'fs-4' : 'fs-2'}`}>
                    <AnimatedNumber value={6} />
                  </div>
                  <div className={isMobile ? 'fs-6' : 'fs-5'}>Dolphins Saved</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Leaderboard Section */}
          <Leaderboard />
          
          {/* PostFeed Section */}
          <PostFeed />
          
          {/* EventsMap and CarbonFootprint Section */}
          <EventsMap
            user={user}
            joinedEvents={joinedEvents}
            onJoinEvent={handleJoinMapEvent}
          />
          <CarbonFootprintCalculator />
          
          {/* ImageClassifierChatbot Section */}
          <ImageClassifierChatbot floating={false} />
          
          {/* Donation and Gamification Section */}
          <div id="donate"></div>
          {user ? (
            <>
              <GamificationEvents
                user={user}
                joined={joinedGamification}
                voted={votedGamification}
                onJoin={handleJoinGamification}
                onVote={handleVoteGamification}
              />
            </>
          ) : (
            <Alert 
              variant="warning" 
              className="text-center my-4 fade-in-section visible"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 2, sm: 3 }
              }}
            >
              Please log in or sign up to access Donation and Gamification features.
            </Alert>
          )}
          
          {/* SOS Button and Chatbot - Only show when user is logged in */}
          {user && (
            <>
              <SOSButton onSOS={handleSOS} />
              <Chatbot />
            </>
          )}
        <SOSNotificationBar />
        
        {/* Login Modal */}
        {showLoginModal && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowLoginModal(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: '100%',
                maxWidth: 800,
                mx: 2,
              }}
            >
              <AuthForm 
                onAuth={handleAuth} 
                onSignup={(email, password, role) => {
                  console.log('Signup called:', { email, password, role });
                  // Handle signup logic here
                }}
                onLogin={(email, password) => {
                  console.log('Login called:', { email, password });
                  // Handle login logic here
                }}
                initialMode={selectedRole}
                onModeChange={setSelectedRole}
              />
            </Box>
          </Box>
        )}
        
        {/* Footer */}
        {/* Remove the duplicate Contact Us / Partners / Copyright block and its parent footer. Only keep the Layout.jsx footer. */}
      </Layout>
    </ThemeProvider>
  );
}

export default App; 