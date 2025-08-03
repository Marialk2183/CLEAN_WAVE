import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import PostFeed from "./components/PostFeed";
import EventsMap from "./components/EventsMap";
import Chatbot from "./components/Chatbot";
import Leaderboard from "./components/Leaderboard";
import CarbonFootprintCalculator from "./components/CarbonFootprintCalculator";
import DonationButton from "./components/DonationButton";
import SOSButton from "./components/SOSButton";
import GamificationEvents from "./components/GamificationEvents";
import ImageClassifierChatbot from "./components/ImageClassifierChatbot";
import { Card, Alert, Button, Row, Col, Container } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
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

  const handleAuth = (email, password, mode) => {
    setUser({ email, isAdmin: mode === 'admin' });
  };
  const handleLogout = () => setUser(null);

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
    await updateDoc(sosDoc, { status: 'resolved', resolved: true });
    setSosAlert(null);
    setHelpedMessage("I'm saved! Thank you for the help.");
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
      <Layout user={user}>
        <HeroCarousel />
        <Container className="flex-grow-1">
          {user && sosAlert && (
            <Alert variant="danger" className="text-center fw-bold fade-in-section visible" dismissible={false}>
              🚨 SOS Alert! {sosAlert.sender} needs help! ({new Date(sosAlert.time).toLocaleTimeString()})
              <Button variant="success" className="ms-3" onClick={handleHelped}>
                Mark as Helped
              </Button>
            </Alert>
          )}
          {helpedMessage && (
            <Alert variant="success" className="text-center fw-bold fade-in-section visible" dismissible={false}>
              {helpedMessage}
            </Alert>
          )}
          {!user && (
            <AuthForm onAuth={handleAuth} />
          )}
          {/* Impact Stats Section */}
          <Row className="mb-4 text-center impact-animate">
            <Col md={3} xs={6} className="mb-3">
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body>
                  <div className="fs-2 fw-bold"><AnimatedNumber value={1240} /></div>
                  <div>Bottles Collected</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body>
                  <div className="fs-2 fw-bold"><AnimatedNumber value={87} /></div>
                  <div>Volunteers</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body>
                  <div className="fs-2 fw-bold"><AnimatedNumber value={15} /></div>
                  <div>Events Hosted</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-dark">
                <Card.Body>
                  <div className="fs-2 fw-bold"><AnimatedNumber value={6} /></div>
                  <div>Dolphins Saved</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Leaderboard Section */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Leaderboard />
          </Box>
          
          {/* PostFeed Section */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <PostFeed />
          </Box>
          
          {/* EventsMap and CarbonFootprint Section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 4,
              width: '100%',
              px: 0,
              my: 4
            }}>
              <Box sx={{ width: '100%' }}>
                <EventsMap
                  user={user}
                  joinedEvents={joinedEvents}
                  onJoinEvent={handleJoinMapEvent}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <CarbonFootprintCalculator />
              </Box>
            </Box>
          </Box>
          
          {/* ImageClassifierChatbot Section */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <ImageClassifierChatbot floating={false} />
          </Box>
          
          {/* Donation and Gamification Section */}
          <div id="donate"></div>
          {user ? (
            <>
              <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                <DonationButton />
              </Box>
              <div id="get-involved"></div>
              <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                <GamificationEvents
                  user={user}
                  joined={joinedGamification}
                  voted={votedGamification}
                  onJoin={handleJoinGamification}
                  onVote={handleVoteGamification}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <Alert variant="warning" className="text-center my-4 fade-in-section visible">
                Please log in or sign up to access Donation and Gamification features.
              </Alert>
            </Box>
          )}
          <SOSButton onSOS={handleSOS} />
          <Chatbot />
        </Container>  
        <SOSNotificationBar />
        {/* Footer */}
        {/* Remove the duplicate Contact Us / Partners / Copyright block and its parent footer. Only keep the Layout.jsx footer. */}
      </Layout>
    </ThemeProvider>
  );
}

export default App; 