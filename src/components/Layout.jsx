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
  {
    label: 'Login',
    dropdown: [
      { label: 'As a Company', href: '#login-company' },
      { label: 'As an Individual', href: '#login-individual' },
      { label: 'As an NGO', href: '#login-ngo' },
      { label: 'As a Team Member', href: '#login-team' },
    ],
  },
  {
    label: 'Signup',
    dropdown: [
      { label: 'As a Company', href: '#signup-company' },
      { label: 'As an Individual', href: '#signup-individual' },
      { label: 'As an NGO', href: '#signup-ngo' },
      { label: 'As a Team Member', href: '#signup-team' },
    ],
  },
  { label: 'Donate', href: '#donate' },
  {
    label: 'Get Involved',
    dropdown: [
      { label: 'As a Company', href: '#get-involved-company' },
      { label: 'As an Individual', href: '#get-involved-individual' },
      { label: 'As an NGO', href: '#get-involved-ngo' },
      { label: 'As a Team Member', href: '#get-involved-team' },
    ],
  },
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

const Layout = ({ children, user }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownIdx, setDropdownIdx] = useState(null);

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

  const handleNavClick = (href) => {
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
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          {/* Logo + App Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: 32, mr: 1 }}>🌴</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.black, letterSpacing: 1 }}>
              CleanWave 🌊
            </Typography>
            {user?.isAdmin && (
              <Box sx={{ 
                background: '#E4405F', 
                color: '#fff', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 2, 
                fontSize: '12px', 
                fontWeight: 700,
                ml: 1
              }}>
                👑 ADMIN
              </Box>
            )}
            {user?.email?.includes('volunteer') && (
              <Box sx={{ 
                background: '#4CAF50', 
                color: '#fff', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 2, 
                fontSize: '12px', 
                fontWeight: 700,
                ml: 1
              }}>
                🤝 VOLUNTEER
              </Box>
            )}
            {user?.email?.includes('ngo') && (
              <Box sx={{ 
                background: '#FF9800', 
                color: '#fff', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 2, 
                fontSize: '12px', 
                fontWeight: 700,
                ml: 1
              }}>
                🏢 NGO
              </Box>
            )}
          </Box>
          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
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
                      px: 2,
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
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: '#333',
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
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
                  px: 2,
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
              <MenuIcon sx={{ color: COLORS.accentBrown }} />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <List sx={{ width: 260 }}>
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <Box key={link.label}>
                      <ListItem disablePadding>
                        <ListItemText primary={link.label} sx={{ pl: 2, fontWeight: 700, color: COLORS.accentBrown }} />
                      </ListItem>
                      {link.dropdown.map((item) => (
                        <ListItem key={item.label} disablePadding>
                          <ListItemButton component="a" href={item.href} onClick={() => {
                            setDrawerOpen(false);
                            handleNavClick(item.href);
                          }} sx={{ pl: 4 }}>
                            <ListItemText primary={item.label} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Box>
                  ) : (
                    <ListItem key={link.label} disablePadding>
                      <ListItemButton component="a" href={link.href} onClick={() => {
                        setDrawerOpen(false);
                        handleNavClick(link.href);
                      }}>
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container maxWidth="md" sx={{ py: 5, px: 0 }}>
        {children}
      </Container>
      {/* Footer (unchanged) */}
      <Box
        component="footer"
        id="contact"
        sx={{
          background: 'linear-gradient(135deg, #A8E6CF 0%, #B3E5FC 50%, #D7CCC8 100%)',
          borderTop: `2px solid ${COLORS.accentBlue}`,
          py: 4,
          boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.04)',
        }}
      >
        <Container maxWidth="md">
          {/* Remove the beach icons from the footer. Only keep social links and the rest. */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
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
                    p: 1, 
                    mx: 0.5, 
                    '&:hover': { 
                      background: link.label === 'Instagram' ? '#E4405F' : 
                                link.label === 'Twitter' ? '#1DA1F2' : 
                                link.label === 'Facebook' ? '#1877F2' : COLORS.accentGreen 
                    },
                    '& .MuiSvgIcon-root': {
                      color: link.label === 'Instagram' ? '#E4405F' : 
                             link.label === 'Twitter' ? '#1DA1F2' : 
                             link.label === 'Facebook' ? '#1877F2' : COLORS.accentBrown
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
          {/* Contact Us and Partners, two columns on desktop, stacked on mobile */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 4,
              mb: 2,
            }}
          >
            {/* Contact Us */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.black, mb: 1 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                NMIMS Mumbai, 4th Floor, Mumbai Educational Trust, VileParle (West), Mumbai 400 049
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Tel: +91 9999999999
              </Typography>
              <Typography variant="body2">
                Email: <a href="mailto:star3mared@gmail.com" style={{ color: COLORS.black, textDecoration: 'underline' }}>star3mared@gmail.com</a>
              </Typography>
            </Box>
            {/* Partners */}
            <Box sx={{ flex: 1, minWidth: 220, textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.black, mb: 1 }}>
                Partners
              </Typography>
              <Typography variant="body2">
                Mumbai ,Maharashtra
              </Typography>
            </Box>
          </Box>
          {/* Copyright centered below */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'black' }}>
              © 2025 CleanWave / United Way Mumbai
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 