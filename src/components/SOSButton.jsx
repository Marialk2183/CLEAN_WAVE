import React, { useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const COLORS = {
  accentRed: '#e53935',
  accentRedDark: '#b71c1c',
  background: 'red',
  card: '#fff',
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  accentBrown: '#D7CCC8',
};

const SOSButton = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleSOS = async () => {
    // Optionally, get user location
    let location = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          sendSOS(location);
        },
        () => sendSOS(null)
      );
    } else {
      sendSOS(null);
    }
  };

  const sendSOS = async (location) => {
    const sosRef = doc(db, "sos_alerts", "latest");
    await setDoc(sosRef, {
      sender: user?.email || "Anonymous",
      user: user?.email || "Anonymous",
      timestamp: serverTimestamp(),
      location,
      status: 'active',
      resolved: false,
    });
    setOpen(true);
  };

  return (
    <>
      <Box sx={{
        position: 'fixed',
        bottom: 32,
        left: 32,
        zIndex: 1300,
        boxShadow: '0 6px 24px rgba(229,57,53,0.18)',
        background: COLORS.background,
        borderRadius: 4,
        p: 1,
      }}>
        <Button
          variant="contained"
          onClick={handleSOS}
          sx={{
            borderRadius: '50%',
            minWidth: 72,
            minHeight: 72,
            width: 72,
            height: 72,
            fontSize: 26,
            fontWeight: 700,
            background: COLORS.accentRed,
            color: '#fff',
            boxShadow: '0 6px 24px rgba(229,57,53,0.18)',
            textTransform: 'none',
            '&:hover': {
              background: COLORS.accentRedDark,
              color: '#fff',
            },
          }}
        >
          SOS
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          SOS sent! Help is on the way.
        </Alert>
      </Snackbar>
    </>
  );
};

export default SOSButton; 