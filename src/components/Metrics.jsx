import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  accentDarkBlue: '#1976d2',
  accentYellow: '#ffc107',
  accentBrown: '#D7CCC8',
  black: '#111',
  background: '#fff',
  card: '#fff',
};

const metrics = [
  { label: "Bottles Collected", value: 1240, color: COLORS.accentGreen, text: '#fff' },
  { label: "Volunteers", value: 87, color: COLORS.accentBlue, text: '#fff' },
  { label: "Events Hosted", value: 15, color: COLORS.accentDarkBlue, text: '#fff' },
  { label: "Dolphins Saved", value: 6, color: COLORS.accentYellow, text: COLORS.black },
];

const Metrics = () => {
  const [counts, setCounts] = useState(metrics.map(() => 0));

  useEffect(() => {
    const duration = 1200; // ms
    const steps = 40;
    const increments = metrics.map(m => Math.ceil(m.value / steps));
    let current = [...counts];
    let step = 0;

    const interval = setInterval(() => {
      step++;
      let done = true;
      current = current.map((c, i) => {
        if (c < metrics[i].value) {
          done = false;
          return Math.min(c + increments[i], metrics[i].value);
        }
        return c;
      });
      setCounts([...current]);
      if (done || step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 4, flexWrap: 'wrap', background: COLORS.background, borderRadius: 4, p: 2 }}>
      {metrics.map((stat, i) => (
        <Box
          key={stat.label}
          sx={{
            flex: '1 1 220px',
            minWidth: 220,
            background: stat.color,
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            mb: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: stat.text || COLORS.black, mb: 1 }}>
            {counts[i].toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ color: stat.text || COLORS.black, fontWeight: 500 }}>
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Metrics; 