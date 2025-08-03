import React, { useEffect, useState } from "react";
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const COLORS = {
  accentRed: '#e53935',
  accentRedDark: '#b71c1c',
  background: '#fff',
  card: '#fff',
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const SOSAlertFeed = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "sos_alerts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ my: 4, background: COLORS.background, borderRadius: 4, p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.accentRed, mb: 2 }}>
        SOS Alerts
      </Typography>
      {alerts.length === 0 ? (
        <Typography>No SOS alerts yet.</Typography>
      ) : (
        alerts.map(alert => (
          <Card key={alert.id} sx={{ mb: 2, borderLeft: `6px solid ${COLORS.accentRed}`, background: COLORS.card, boxShadow: '0 2px 12px rgba(229,57,53,0.08)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: COLORS.black, fontWeight: 600 }}>
                {alert.user}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.black }}>
                {alert.location
                  ? `Location: (${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)})`
                  : "Location: Not available"}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.accentBrown }}>
                {alert.timestamp?.seconds
                  ? new Date(alert.timestamp.seconds * 1000).toLocaleString()
                  : ""}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SOSAlertFeed;
