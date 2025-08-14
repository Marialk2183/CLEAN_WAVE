import React, { useState, useEffect } from 'react';
import '../components/index.css';
import AuthForm from './AuthForm';
import NotificationBell from './NotificationBell';
import MobileDebugPanel from './MobileDebugPanel';
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
import CarbonFootprintRow from "./components/CarbonFootprintRow"; // <-- Import here
import SOSAlertFeed from './SOSAlertFeed';
import { useAppContext } from './AppContext';
import Metrics from './Metrics';
import ChatbotText from './ChatbotText';
import ImageClassifierChatbot from './ImageClassifierChatbot';

// Make sure firebase, db, auth, and storage are globally available (from your HTML setup)
const auth = window.firebase.auth();
const db = window.firebase.firestore();
const storage = window.firebase.storage();

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [error, setError] = useState(null);
  const { setUser: setUserInContext } = useAppContext();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        setRole(userDoc.exists ? userDoc.data().role : null);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleSignup = async (email, password, role) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection('users').doc(user.uid).set({ email, role, points: 0, verified: false });
      setRole(role);
    } catch (err) {
      setError(`Signup failed: ${err.message}`);
    }
  };
  const handleLogin = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(`Login failed: ${err.message}`);
    }
  };
  const handleLogout = () => auth.signOut();
  async function fetchEvents() {
    const snapshot = await db.collection('events').orderBy('date').get();
    setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  async function fetchPosts() {
    const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').limit(20).get();
    setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  async function fetchLeaderboard() {
    const snapshot = await db.collection('users').orderBy('points', 'desc').limit(3).get();
    setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  async function fetchBadges(uid) {
    const snapshot = await db.collection('badges').where('userId', '==', uid).get();
    setBadges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  async function fetchCarbonFootprint(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    setCarbonFootprint(userDoc.exists && userDoc.data().carbonFootprint ? userDoc.data().carbonFootprint : 0);
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

  return (
    <div className="container-fluid py-4 font-sans">
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      <header className="bg-primary text-white p-4 mb-4 rounded-lg shadow-lg position-relative overflow-hidden">
        <div className="d-flex justify-content-between align-items-center position-relative">
          <div>
            <h1 className="h1 fw-bold mb-2">Weekends Drive Only</h1>
            <p className="lead mb-0">Saving Our Shores, One Cleanup at a Time</p>
          </div>
          {user && (
            <div className="d-flex align-items-center">
              <span className="me-3">{user.email}</span>
              <NotificationBell user={user} />
              <button className="btn btn-light ms-3" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      {!user ? (
        <AuthForm onSignup={handleSignup} onLogin={handleLogin} />
      ) : (
        <>
          <EventsMap events={events} />
          <Leaderboard leaderboard={leaderboard} />
          <PostFeed posts={posts} />
          <CarbonFootprintCalculator onSave={setCarbonFootprint} />
          {/* Mobile Debug Panel - Only visible on mobile */}
          <MobileDebugPanel />
          
          {/* Waste Classifier Section - directly below CarbonFootprintCalculator */}
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
          
        </>
      )}
    </div>
  );
} 