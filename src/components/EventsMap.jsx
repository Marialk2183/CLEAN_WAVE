import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Map FlyTo animation
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13, { duration: 2 });
  }, [position, map]);
  return null;
};

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#00BCD4',
  background: '#f5f5f5',
  card: '#ffffff',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const staticPins = [
  { name: 'Juhu Beach', position: [19.0969, 72.8265] },
  { name: 'Versova', position: [19.1340, 72.8124] },
  { name: 'Marine Lines', position: [18.9430, 72.8235] },
];

const EventsMap = () => {
  const [events, setEvents] = useState([]);
  const [flyTo, setFlyTo] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEvents();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.background,
        py: 4,
        px: 3,
      }}
    >
      <Card sx={{
        width: '100%',
        borderRadius: 5,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        background: COLORS.card,
        p: 3,
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: COLORS.accentBlue,
              mb: 4,
              textAlign: 'center',
              letterSpacing: 0.5
            }}
          >
            📍 Explore Event Locations
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 400,
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px solid #e0f7fa',
            }}
          >
            <MapContainer center={[19.076, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {flyTo && <FlyToLocation position={flyTo} />}

              {/* Firebase Events */}
              {events.map(event => (
                event.lat && event.lng && (
                  <Marker key={event.id} position={[event.lat, event.lng]}>
                    <Popup>
                      <strong>{event.name}</strong><br />
                      {event.date}<br />
                      {event.location}
                    </Popup>
                  </Marker>
                )
              ))}

              {/* Static Pins with animation trigger */}
              {staticPins.map((place, index) => (
                <Marker
                  key={index}
                  position={place.position}
                  eventHandlers={{
                    click: () => setFlyTo(place.position),
                  }}
                >
                  <Popup>
                    📍 <strong>{place.name}</strong><br />
                    Popular Spot in Mumbai
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventsMap;
