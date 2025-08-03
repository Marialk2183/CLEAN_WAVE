import React, { useEffect, useState } from "react";
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from './AppContext';
import Button from '@mui/material/Button';

const SOSNotificationBar = () => {
  const [latestSOS, setLatestSOS] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [visible, setVisible] = useState(false);
  const { user } = useAppContext();

  useEffect(() => {
    const sosDoc = doc(db, 'sos_alerts', 'latest');
    const unsubscribe = onSnapshot(sosDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('SOS Data:', data);
        console.log('Current User:', user);
        // Only show if not resolved
        if (data.status === 'active' && !data.resolved) {
          setLatestSOS({ ...data, id: snapshot.id });
          setVisible(true); // Show notification when new SOS arrives
        } else {
          setLatestSOS(null);
          setVisible(false);
        }
      } else {
        setLatestSOS(null);
        setVisible(false);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchLocationName = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setLocationName(data.display_name);
        } else {
          setLocationName("Unknown location");
        }
      } catch (error) {
        setLocationName("Unknown location");
      }
    };

    if (latestSOS && latestSOS.location && latestSOS.location.lat && latestSOS.location.lng) {
      fetchLocationName(latestSOS.location.lat, latestSOS.location.lng);
    } else {
      setLocationName("");
    }
  }, [latestSOS]);

  if (!latestSOS || !visible) return null;

  return (
    <Slide direction="down" in={!!latestSOS} mountOnEnter unmountOnExit>
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000 }}>
        <Alert severity="error" sx={{ borderRadius: 0, fontWeight: 600, fontSize: 18, textAlign: 'center', position: 'relative' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setVisible(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          🚨 SOS: {latestSOS.sender || latestSOS.user} needs help!
          {locationName && (
            <> (Location: {locationName})</>
          )}
          {/* Show 'I'm Saved' button only to the sender */}
          {user && (user.email === (latestSOS.sender || latestSOS.user)) && (
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 2, background: '#A8E6CF', color: '#111', fontWeight: 600 }}
              onClick={async () => {
                setVisible(false);
                // Mark as resolved in Firestore for all members
                const sosRef = doc(db, 'sos_alerts', 'latest');
                await updateDoc(sosRef, { resolved: true, status: 'resolved' });
              }}
            >
              I'm Saved
            </Button>
          )}
          {/* Debug info - remove this later */}
          <Box sx={{ fontSize: '12px', mt: 1, color: '#666' }}>
            Debug: User: {user?.email}, Sender: {latestSOS.sender || latestSOS.user}
            <br />
            Match: {user?.email === (latestSOS.sender || latestSOS.user) ? 'YES' : 'NO'}
          </Box>
        </Alert>
      </Box>
    </Slide>
  );
};

export default SOSNotificationBar;