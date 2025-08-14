import React, { useState, useEffect } from 'react';
import '../components/index.css';
import Layout from './Layout';
import AuthForm from './AuthForm';
import NotificationBell from './NotificationBell';
import Leaderboard from './Leaderboard';
import Chatbot from './Chatbot';
import EventsMap from './EventsMap';
import PostFeed from './PostFeed';
import CarbonFootprintCalculator from './CarbonFootprintCalculator';
import DonationButton from './DonationButton';
import GamificationEvents from './GamificationEvents';
import AdminDashboard from './AdminDashboard';
import SOSButton from './SOSButton';
import FeedAndMapRow from './FeedAndMapRow';
import CarbonFootprintRow from "./components/CarbonFootprintRow";
import SOSAlertFeed from './SOSAlertFeed';
import { useAppContext } from './AppContext';
import Metrics from './Metrics';
import ChatbotText from './ChatbotText';
import ImageClassifierChatbot from './ImageClassifierChatbot';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser: setUserInContext } = useAppContext();

  // Listen for authentication state changes and persist login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        setShowLoginModal(false);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('cleanwave_user', JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }));
        
        console.log('User logged in:', currentUser.email);
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        
        // Clear user info from localStorage
        localStorage.removeItem('cleanwave_user');
        
        console.log('User logged out');
      }
      setIsLoading(false);
    });

    // Check localStorage for existing user session
    const savedUser = localStorage.getItem('cleanwave_user');
    if (savedUser && !user) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Restored user session from localStorage:', userData.email);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('cleanwave_user');
      }
    }

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchEvents();
    fetchPosts();
    fetchLeaderboard();
    fetchBadges(user.uid);
    fetchCarbonFootprint(user.uid);
  }, [user]);

  useEffect(() => {
    setUserInContext(user);
  }, [user, setUserInContext]);

  const handleLoginClick = () => {
    console.log('handleLoginClick called!');
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setRole(null);
      setShowLoginModal(false);
      localStorage.removeItem('cleanwave_user');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  async function fetchEvents() {
    try {
      // Use Firebase v9 syntax
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const q = query(collection(db, 'events'), orderBy('date'));
      const snapshot = await getDocs(q);
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async function fetchPosts() {
    try {
      const { collection, getDocs, orderBy, query, limit } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  async function fetchLeaderboard() {
    try {
      const { collection, getDocs, orderBy, query, limit } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(3));
      const snapshot = await getDocs(q);
      setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }

  async function fetchBadges(uid) {
    try {
      const { collection, getDocs, where, query } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const q = query(collection(db, 'badges'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      setBadges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  }

  async function fetchCarbonFootprint(uid) {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const userDoc = await getDoc(doc(db, 'users', uid));
      setCarbonFootprint(userDoc.exists() && userDoc.data().carbonFootprint ? userDoc.data().carbonFootprint : 0);
    } catch (error) {
      console.error('Error fetching carbon footprint:', error);
    }
  }

  function getCurrentLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 19.0760, lng: 72.8777 });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => resolve({ lat: 19.0760, lng: 72.8777 })
      );
    });
  }

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #A8E6CF, #B3E5FC, #D7CCC8)'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            🌊 CleanWave
          </div>
          <div style={{
            fontSize: '1rem',
            opacity: 0.8
          }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Layout 
        onLoginClick={handleLoginClick}
        currentUser={user}
        onLogout={handleLogout}
      />
      
      {!user ? (
        <div className="container-fluid py-4 font-sans">
          <header className="bg-primary text-white p-4 mb-4 rounded-lg shadow-lg position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-center position-relative">
              <div>
                <h1 className="h1 fw-bold mb-2">Weekends Drive Only</h1>
                <p className="lead mb-0">Saving Our Shores, One Cleanup at a Time</p>
              </div>
            </div>
          </header>
          <AuthForm 
            onAuth={(email, password, role) => {
              console.log('AuthForm onAuth called:', { email, password, role });
              if (role === 'admin') {
                setRole('admin');
              } else if (role === 'volunteer') {
                setRole('volunteer');
              } else if (role === 'ngo') {
                setRole('ngo');
              }
            }}
            onSignup={() => setShowLoginModal(false)}
            onLogin={() => setShowLoginModal(false)}
          />
        </div>
      ) : (
        <div className="container-fluid py-4 font-sans">
          {error && <div className="alert alert-danger mb-4">{error}</div>}
          <header className="bg-primary text-white p-4 mb-4 rounded-lg shadow-lg position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-center position-relative">
              <div>
                <h1 className="h1 fw-bold mb-2">Weekends Drive Only</h1>
                <p className="lead mb-0">Saving Our Shores, One Cleanup at a Time</p>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-3">{user.email}</span>
                <NotificationBell user={user} />
                <button className="btn btn-light ms-3" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </header>
          
          <EventsMap events={events} />
          <Leaderboard leaderboard={leaderboard} />
          <PostFeed posts={posts} />
          <CarbonFootprintCalculator onSave={setCarbonFootprint} />
          
          <div className="waste-classifier-section" style={{ margin: '32px 0', position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontWeight: 700, color: '#A8E6CF', marginBottom: 16 }}>Waste Classifier</h2>
            <ImageClassifierChatbot floating={false} />
          </div>
          <DonationButton />
          <GamificationEvents user={user} setError={setError} />
          {role === 'ngo' && <AdminDashboard events={events} setError={setError} />}
          <SOSButton user={user} setError={setError} />
          <Chatbot />
          <FeedAndMapRow />
          <CarbonFootprintRow />
          <ChatbotText />
          <SOSAlertFeed />
          <Metrics />
        </div>
      )}
      
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AuthForm 
            onSignup={() => setShowLoginModal(false)}
            onLogin={() => setShowLoginModal(false)}
          />
        </div>
      )}
    </div>
  );
} 