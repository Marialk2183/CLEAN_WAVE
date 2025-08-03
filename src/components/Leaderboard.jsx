import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { keyframes } from '@mui/system';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Example data
const rows = [
  { name: 'Sofia Francis', score: 120 },
  { name: 'Maria Lokhandwala', score: 110 },
  { name: 'Umed Jogi', score: 100 },
];

// Animation for table rows
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

// Animation for badge
const badgeFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

function getBadge(idx) {
  if (idx === 0) return { color: COLORS.gold, label: 'Gold', emoji: '🥇', bg: '#FFF9E3' };
  if (idx === 1) return { color: COLORS.silver, label: 'Silver', emoji: '🥈', bg: '#F4F4F7' };
  if (idx === 2) return { color: COLORS.bronze, label: 'Bronze', emoji: '🥉', bg: '#FBE9E0' };
  return null;
}

const Leaderboard = () => {
  return (
    <Box
      sx={{
        background: 'transparent',
        py: 4,
        width: '100%',
        maxWidth: 800,
        mx: 'auto'
      }}
    >
      <Card sx={{ width: '100%', borderRadius: 6, boxShadow: '0 12px 40px rgba(0,0,0,0.13)', background: COLORS.card, p: 2 }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: COLORS.black, mb: 4, textAlign: 'center', letterSpacing: 1 }}>
            Leaderboard
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: COLORS.black, fontSize: 18, background: COLORS.accentBlue, borderTopLeftRadius: 8 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: COLORS.black, fontSize: 18, background: COLORS.accentBlue, borderTopRightRadius: 8 }}>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => {
                  const badge = getBadge(idx);
                  return (
                    <TableRow
                      key={row.name}
                      sx={{
                        background: COLORS.card,
                        position: 'relative',
                        animation: `${fadeInUp} 0.7s ${0.2 + idx * 0.15}s both`,
                        boxShadow: idx === 0 ? '0 2px 12px rgba(255,215,0,0.18)' : idx === 1 ? '0 2px 12px rgba(192,192,192,0.13)' : idx === 2 ? '0 2px 12px rgba(205,127,50,0.13)' : 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                          zIndex: 1,
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: idx === 0 ? 900 : 600, color: '#333', fontSize: 18, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {badge && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: badge.bg,
                              color: badge.color,
                              borderRadius: 12,
                              fontWeight: 700,
                              fontSize: 14,
                              padding: '2px 10px 2px 6px',
                              marginRight: 8,
                              boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
                              animation: `${badgeFadeIn} 0.7s ${0.3 + idx * 0.15}s both`,
                            }}
                          >
                            <span style={{ fontSize: 20, marginRight: 4 }}>{badge.emoji}</span> {badge.label}
                          </span>
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: idx === 0 ? 900 : 600, color: '#333', fontSize: 18 }}>{row.score}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Leaderboard; 