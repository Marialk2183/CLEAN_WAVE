import React, { useState, useEffect } from "react";
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
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { useTheme, useMediaQuery } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [eventStats, setEventStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastSeen: doc.data().lastSeen?.toDate?.() || new Date()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch event stats
    const fetchEventStats = async () => {
      try {
        const statsSnapshot = await getDocs(collection(db, "eventStats"));
        const statsData = {};
        statsSnapshot.docs.forEach(doc => {
          statsData[doc.id] = doc.data();
        });
        setEventStats(statsData);
      } catch (error) {
        console.error("Error fetching event stats:", error);
      }
    };

    // Fetch donations
    const fetchDonations = async () => {
      try {
        const donationsSnapshot = await getDocs(collection(db, "donations"));
        const donationsData = donationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));
        setDonations(donationsData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    // Fetch all data
    Promise.all([fetchUsers(), fetchEventStats(), fetchDonations()]).then(() => {
      setLoading(false);
    });

    // Real-time updates for users
    const usersQuery = query(collection(db, "users"), orderBy("lastSeen", "desc"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastSeen: doc.data().lastSeen?.toDate?.() || new Date()
      }));
      setUsers(usersData);
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => {
    const lastSeen = new Date(user.lastSeen);
    const now = new Date();
    const diffHours = (now - lastSeen) / (1000 * 60 * 60);
    return diffHours < 24; // Active if seen in last 24 hours
  }).length;

  const totalVotes = Object.values(eventStats).reduce((sum, stat) => sum + (stat.votes || 0), 0);
  const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);

  const adminStats = [
    { label: "Total Users", value: totalUsers, color: COLORS.accentGreen },
    { label: "Active Users", value: activeUsers, color: COLORS.accentBlue },
    { label: "Total Votes", value: totalVotes, color: '#FF9800' },
    { label: "Total Donations", value: `₹${totalDonations.toLocaleString()}`, color: '#4CAF50' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6" sx={{ color: COLORS.accentBrown }}>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 700, 
        color: COLORS.black, 
        mb: 4, 
        textAlign: 'center',
        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
      }}>
        👑 Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {adminStats.map((stat) => (
          <Card key={stat.label} sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
            border: `1px solid ${stat.color}30`
          }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: stat.color,
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: COLORS.black,
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Users Table */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        mb: 4
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${COLORS.background}`,
            background: COLORS.accentGreen + '10'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: COLORS.black,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              👥 Active Users ({activeUsers})
            </Typography>
          </Box>
          
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: COLORS.accentBlue + '20' }}>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>Votes</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>Donations</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: COLORS.black }}>Last Seen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const userVotes = Object.values(eventStats).reduce((sum, stat) => sum + (stat.votes || 0), 0);
                  const userDonations = donations
                    .filter(donation => donation.userId === user.id)
                    .reduce((sum, donation) => sum + (donation.amount || 0), 0);
                  
                  const isActive = new Date() - new Date(user.lastSeen) < 24 * 60 * 60 * 1000;
                  
                  return (
                    <TableRow key={user.id} sx={{ '&:hover': { background: COLORS.accentGreen + '10' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: user.isAdmin ? '#E4405F' : user.email?.includes('volunteer') ? '#4CAF50' : COLORS.accentBlue,
                            width: 32,
                            height: 32
                          }}>
                            {user.email?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.black }}>
                              {user.email?.split('@')[0] || 'User'}
                            </Typography>
                            <Chip 
                              label={isActive ? 'Online' : 'Offline'} 
                              size="small"
                              sx={{ 
                                background: isActive ? '#4CAF50' : '#9E9E9E',
                                color: '#fff',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.black }}>
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isAdmin ? 'Admin' : user.email?.includes('volunteer') ? 'Volunteer' : 'User'} 
                          size="small"
                          sx={{ 
                            background: user.isAdmin ? '#E4405F' : user.email?.includes('volunteer') ? '#4CAF50' : COLORS.accentBlue,
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.black, fontWeight: 600 }}>
                          {userVotes}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.black, fontWeight: 600 }}>
                          ₹{userDonations.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: COLORS.black }}>
                          {new Date(user.lastSeen).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${COLORS.background}`,
            background: '#4CAF50' + '10'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: COLORS.black,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              💰 Recent Donations
            </Typography>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {donations.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {donations.slice(0, 5).map((donation) => (
                  <Box key={donation.id} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    background: '#4CAF50' + '10',
                    borderRadius: 2
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.black }}>
                        {donation.userEmail || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.accentBrown }}>
                        {new Date(donation.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                      ₹{donation.amount?.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: COLORS.accentBrown, textAlign: 'center', py: 3 }}>
                No donations yet
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard; 