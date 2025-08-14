import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme, useMediaQuery } from '@mui/material';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  sand: '#FFFDE4',
  sky: '#B3E5FC',
  aqua: '#A8E6CF',
};

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Work', href: '#work' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Login', href: '#login', isLogin: true },
  { label: 'Donate', href: '#donate', isDonate: true },
];

const socialLinks = [
  { icon: <InstagramIcon />, href: 'https://instagram.com', label: 'Instagram' },
  { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
];

const beachIcons = [
  '🌴', // Palm
  '🌊', // Wave
  '☀️', // Sun
  '🐚', // Shell
];

const Layout = ({ children, user, onLoginClick }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownIdx, setDropdownIdx] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleDropdownOpen = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setDropdownIdx(idx);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
    setDropdownIdx(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleDonate = () => {
    const options = {
      key: 'rzp_test_2H1mgrAxKxQXra', // Replace with your Razorpay key
      amount: 50000, // Amount in paise (50000 = ₹500)
      currency: "INR",
      name: "CleanWave Donation",
      description: "Support our mission!",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Optionally, send this payment ID to your backend for verification
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        purpose: "Donation",
      },
      theme: {
        color: "#43a047",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleNavClick = (href, isDonate = false, isLogin = false) => {
    if (isDonate) {
      handleDonate();
      return;
    }
    
    if (isLogin && onLoginClick) {
      onLoginClick();
      return;
    }
    
    if (href.startsWith('#')) {
      scrollToSection(href.substring(1));
    } else if (href.startsWith('/')) {
      // Handle internal navigation if needed
      window.location.href = href;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      py: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ocean Wave GIF Background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.6,
        background: 'url("https://i.pinimg.com/originals/e9/b1/39/e9b139755df92c5ea2bab961d4c64201.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      
      {/* Additional Wave Layer */}
      <Box sx={{
        position: 'fixed',
        top: '60%',
        left: 0,
        width: '100%',
        height: '40%',
        zIndex: -1,
        opacity: 0.7,
        background: 'url("https://i.pinimg.com/originals/e9/b1/39/e9b139755df92c5ea2bab961d4c64201.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #A8E6CF 0%, #B3E5FC 50%, #D7CCC8 100%)',
          color: '#333',
          borderBottom: `2px solid ${COLORS.accentBlue}`,
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {/* Logo + App Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, mr: 1 }}>🌴</Box>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              sx={{ 
                fontWeight: 700, 
                color: COLORS.black, 
                letterSpacing: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              CleanWave 🌊
            </Typography>
            {user?.isAdmin && (
              <Box sx={{ 
                background: '#E4405F', 
                color: '#fff', 
                px: { xs: 1, sm: 1.5 }, 
                py: { xs: 0.25, sm: 0.5 }, 
                borderRadius: 2, 
                fontSize: { xs: '10px', sm: '12px' }, 
                fontWeight: 700,
                ml: { xs: 0.5, sm: 1 }
              }}>
                👑 ADMIN
              </Box>
            )}
            {user?.email?.includes('volunteer') && (
              <Box sx={{ 
                background: '#4CAF50', 
                color: '#fff', 
                px: { xs: 1, sm: 1.5 }, 
                py: { xs: 0.25, sm: 0.5 }, 
                borderRadius: 2, 
                fontSize: { xs: '10px', sm: '12px' }, 
                fontWeight: 700,
                ml: { xs: 0.5, sm: 1 }
              }}>
                🤝 VOLUNTEER
              </Box>
            )}
            {user?.email?.includes('ngo') && (
              <Box sx={{ 
                background: '#FF9800', 
                color: '#fff', 
                px: { xs: 1, sm: 1.5 }, 
                py: { xs: 0.25, sm: 0.5 }, 
                borderRadius: 2, 
                fontSize: { xs: '10px', sm: '12px' }, 
                fontWeight: 700,
                ml: { xs: 0.5, sm: 1 }
              }}>
                🏢 NGO
              </Box>
            )}
          </Box>
          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
            {navLinks.map((link, idx) =>
              link.dropdown ? (
                <Box key={link.label} sx={{ position: 'relative' }}>
                  <Button
                    endIcon={<ArrowDropDownIcon />}
                    onClick={e => handleDropdownOpen(e, idx)}
                    sx={{
                      color: '#333',
                      fontWeight: 500,
                      borderRadius: 2,
                      textTransform: 'none',
                      px: { lg: 1.5, xl: 2 },
                      fontSize: { lg: '0.875rem', xl: '1rem' },
                      position: 'relative',
                      '&:hover': {
                        background: COLORS.accentGreen,
                        color: '#222',
                      },
                      '&:after': {
                        content: '""',
                        display: 'block',
                        width: 0,
                        height: 2,
                        background: COLORS.accentBlue,
                        transition: 'width 0.3s',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                      },
                      '&:hover:after': {
                        width: '100%',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={dropdownIdx === idx}
                    onClose={handleDropdownClose}
                    MenuListProps={{ onMouseLeave: handleDropdownClose }}
                  >
                    {link.dropdown.map((item) => (
                      <MenuItem key={item.label} component="a" href={item.href} onClick={() => {
                        handleDropdownClose();
                        handleNavClick(item.href);
                      }}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.href, link.isDonate, link.isLogin)}
                  sx={{
                    color: '#333',
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: 'none',
                    px: { lg: 1.5, xl: 2 },
                    fontSize: { lg: '0.875rem', xl: '1rem' },
                    position: 'relative',
                    background: link.isDonate ? COLORS.accentGreen : 'transparent',
                    '&:hover': {
                      background: link.isDonate ? COLORS.accentBlue : COLORS.accentGreen,
                      color: '#222',
                    },
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: 0,
                      height: 2,
                      background: COLORS.accentBlue,
                      transition: 'width 0.3s',
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                    },
                    '&:hover:after': {
                      width: '100%',
                    },
                  }}
                >
                  {link.label}
                </Button>
              )
            )}
            {user && (
              <Button
                onClick={() => window.location.reload()}
                sx={{
                  color: '#E4405F',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: { lg: 1.5, xl: 2 },
                  fontSize: { lg: '0.875rem', xl: '1rem' },
                  border: '1px solid #E4405F',
                  '&:hover': {
                    background: '#E4405F',
                    color: '#fff',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
          {/* Tablet Nav - Simplified */}
          <Box sx={{ display: { xs: 'none', md: 'flex', lg: 'none' }, gap: 1 }}>
            <Button
              href="#home"
              onClick={() => handleNavClick('#home')}
              sx={{
                color: '#333',
                fontWeight: 500,
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                fontSize: '0.875rem',
                '&:hover': {
                  background: COLORS.accentGreen,
                  color: '#222',
                },
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => handleDonate()}
              sx={{
                color: '#333',
                fontWeight: 500,
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                fontSize: '0.875rem',
                background: COLORS.accentGreen,
                '&:hover': {
                  background: COLORS.accentBlue,
                  color: '#222',
                },
              }}
            >
              Donate
            </Button>
            {user && (
              <Button
                onClick={() => window.location.reload()}
                sx={{
                  color: '#E4405F',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 2,
                  fontSize: '0.875rem',
                  border: '1px solid #E4405F',
                  '&:hover': {
                    background: '#E4405F',
                    color: '#fff',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
          {/* Mobile Nav */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: '#000000' }} />
            </IconButton>
            <Drawer 
              anchor="right" 
              open={drawerOpen} 
              onClose={() => setDrawerOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  width: { xs: '280px', sm: '320px' },
                  pt: 2,
                  background: '#000000',
                  color: '#ffffff'
                }
              }}
            >
              <List sx={{ 
                width: '100%',
                '& .MuiListItem-root': {
                  borderBottom: '1px solid #000000'
                }
              }}>
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <Box key={link.label}>
                      <ListItem disablePadding>
                        <ListItemText 
                          primary={link.label} 
                          sx={{ 
                            pl: 2, 
                            fontWeight: 700, 
                            color: '#ffffff',
                            '& .MuiTypography-root': {
                              fontSize: '1rem'
                            }
                          }} 
                        />
                      </ListItem>
                      {link.dropdown.map((item) => (
                        <ListItem key={item.label} disablePadding>
                          <ListItemButton 
                            component="a" 
                            href={item.href} 
                            onClick={() => {
                              setDrawerOpen(false);
                              handleNavClick(item.href);
                            }} 
                            sx={{ 
                              pl: 4,
                              '&:hover': {
                                background: '#000000'
                              }
                            }}
                          >
                            <ListItemText 
                              primary={item.label}
                              sx={{
                                color: '#ffffff',
                                '& .MuiTypography-root': {
                                  fontSize: '0.9rem'
                                }
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Box>
                  ) : (
                    <ListItem key={link.label} disablePadding>
                      <ListItemButton 
                        component="a" 
                        href={link.href} 
                        onClick={() => {
                          setDrawerOpen(false);
                          if (link.isDonate) {
                            handleDonate();
                          } else if (link.isLogin && onLoginClick) {
                            console.log('🎯 Layout: Login button clicked in mobile drawer!');
                            console.log('Calling onLoginClick...');
                            onLoginClick();
                          } else {
                            handleNavClick(link.href);
                          }
                        }}
                        sx={{
                          '&:hover': {
                            background: '#000000'
                          }
                        }}
                      >
                        <ListItemText 
                          primary={link.label}
                          sx={{
                            color: '#ffffff',
                            '& .MuiTypography-root': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
                {user && (
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => {
                        setDrawerOpen(false);
                        if (onLogout) {
                          onLogout();
                        }
                      }}
                      sx={{ 
                        color: '#E4405F',
                        '&:hover': {
                          background: '#000000'
                        }
                      }}
                    >
                      <ListItemText 
                        primary="🚪 Logout"
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container maxWidth="md" sx={{ 
        py: { xs: 3, sm: 4, md: 5 }, 
        px: { xs: 1, sm: 2, md: 3 } 
      }}>
        {children}
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        id="contact"
        sx={{
          background: 'linear-gradient(135deg, #A8E6CF 0%, #B3E5FC 50%, #D7CCC8 100%)',
          borderTop: `2px solid ${COLORS.accentBlue}`,
          py: { xs: 3, sm: 4 },
          boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.04)',
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Social Links */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 2, 
            mb: { xs: 2, sm: 3 } 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {socialLinks.map(link => (
                <IconButton
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  sx={{ 
                    background: COLORS.card, 
                    borderRadius: '50%', 
                    p: { xs: 1, sm: 1.5 }, 
                    mx: 0.5, 
                    '&:hover': { 
                      background: link.label === 'Instagram' ? '#E4405F' : 
                                link.label === 'Twitter' ? '#1DA1F2' : 
                                link.label === 'Facebook' ? '#1877F2' : COLORS.accentGreen 
                    },
                    '& .MuiSvgIcon-root': {
                      color: link.label === 'Instagram' ? '#E4405F' : 
                             link.label === 'Twitter' ? '#1DA1F2' : 
                             link.label === 'Facebook' ? '#1877F2' : COLORS.accentBrown,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    },
                    '&:hover .MuiSvgIcon-root': {
                      color: '#fff'
                    }
                  }}
                  aria-label={link.label}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
          {/* Contact Us and Partners */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: { xs: 3, md: 4 },
              mb: 2,
            }}
          >
            {/* Contact Us */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 220 } }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: COLORS.black, 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
                Contact Us
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                NMIMS Mumbai, 4th Floor, Mumbai Educational Trust, VileParle (West), Mumbai 400 049
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Tel: +91 9999999999
              </Typography>
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Email: <a href="mailto:star3mared@gmail.com" style={{ color: COLORS.black, textDecoration: 'underline' }}>star3mared@gmail.com</a>
              </Typography>
            </Box>
            {/* Partners */}
            <Box sx={{ 
              flex: 1, 
              minWidth: { xs: '100%', md: 220 }, 
              textAlign: { xs: 'left', md: 'right' } 
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: COLORS.black, 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
                Partners
              </Typography>
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Mumbai ,Maharashtra
              </Typography>
            </Box>
          </Box>
          {/* Copyright */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'black',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              © 2025 CleanWave / United Way Mumbai
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 