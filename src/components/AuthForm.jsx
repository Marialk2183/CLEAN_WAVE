import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery } from '@mui/material';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const AuthForm = ({ onAuth, onSignup, onLogin, initialMode = "login", onModeChange }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Simple tab change handler
  const handleTabChange = (_, idx) => {
    console.log('Tab clicked! Index:', idx);
    
    const newMode = idx === 0 ? 'login' : 
                   idx === 1 ? 'volunteer' : 
                   idx === 2 ? 'ngo' : 
                   idx === 3 ? 'volunteer-signup' : 
                   idx === 4 ? 'ngo-signup' : 
                   idx === 5 ? 'admin' : 'login';
    
    console.log('New mode:', newMode);
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Mobile-optimized form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 FORM SUBMITTED! Mode:', mode);
    console.log('📧 Form data:', form);
    
    if (isSubmitting) {
      console.log('⏳ Already submitting, ignoring...');
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setInfo("");
    
    try {
      if (mode === "admin") {
        // Admin login
        if (form.email === "admin@cleanwave.com" && form.password === "admin123") {
          console.log('✅ Admin login successful with hardcoded credentials');
          if (onAuth) onAuth(form.email, form.password, "admin");
          return;
        } else {
          // Try Firebase authentication for admin
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "admin");
        }
      } else if (mode === "volunteer-signup") {
        // Volunteer signup
        if (form.password !== form.confirm) {
          setError("Passwords do not match.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setInfo("Volunteer account created! Please check your email for verification, then login.");
        setForm({ email: "", password: "", confirm: "" });
      } else if (mode === "ngo-signup") {
        // NGO signup
        if (form.password !== form.confirm) {
          setError("Passwords do not match.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setInfo("NGO account created! Please check your email for verification, then login.");
        setForm({ email: "", password: "", confirm: "" });
      } else if (mode === "login") {
        // Regular login
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email before logging in. Check your inbox for a verification link.");
          return;
        }
        if (onAuth) onAuth(form.email, form.password, mode);
        if (onLogin) onLogin(form.email, form.password);
      } else if (mode === "volunteer") {
        // Volunteer login
        if (form.email === "volunteer@cleanwave.com" && form.password === "volunteer123") {
          console.log('✅ Volunteer login successful with hardcoded credentials');
          if (onAuth) onAuth(form.email, form.password, "volunteer");
          return;
        } else {
          // Try Firebase authentication for volunteer
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "volunteer");
        }
      } else if (mode === "ngo") {
        // NGO login
        if (form.email === "ngo@cleanwave.com" && form.password === "ngo123") {
          console.log('✅ NGO login successful with hardcoded credentials');
          if (onAuth) onAuth(form.email, form.password, "ngo");
          return;
        } else {
          // Try Firebase authentication for NGO
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "ngo");
        }
      }
    } catch (err) {
      console.error('❌ Authentication error:', err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct button click handler for mobile
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 BUTTON CLICKED!');
    console.log('Event:', e);
    console.log('Form data:', form);
    console.log('Mode:', mode);
    
    // Trigger form submission
    handleSubmit(e);
  };

  const tabIndex = mode === "login" ? 0 : 
                  mode === "volunteer" ? 1 : 
                  mode === "ngo" ? 2 : 
                  mode === "volunteer-signup" ? 3 : 
                  mode === "ngo-signup" ? 4 : 
                  mode === "admin" ? 5 : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        zIndex: 1000,
        width: '100%',
        px: { xs: 2, sm: 0 },
        py: { xs: 2, sm: 0 }
      }}
    >
      <Card sx={{
        maxWidth: { xs: '100%', sm: 800 },
        width: '100%',
        borderRadius: { xs: 2, sm: 4 },
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        background: '#ffffff',
        border: '1px solid rgba(168, 230, 207, 0.2)',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1001,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #A8E6CF, #B3E5FC, #D7CCC8)',
        }
      }}>
        <CardContent sx={{ 
          p: { xs: 2, sm: 5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          minHeight: { xs: 'auto', sm: 0 }
        }}>
          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              onClick={() => window.location.reload()}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: '32px',
                minHeight: '32px',
                borderRadius: '50%',
                background: '#E4405F',
                color: '#fff',
                '&:hover': { background: '#C13584' }
              }}
            >
              ✕
            </Button>
          )}
          
          <Box sx={{ 
            mb: 3, 
            textAlign: 'center',
            position: 'relative'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: COLORS.black, 
              mb: 1, 
              textAlign: 'center', 
              letterSpacing: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}>
              {mode === 'login' ? 'Welcome Back' : 
               mode === 'volunteer' ? 'Volunteer Login' : 
               mode === 'ngo' ? 'NGO Login' : 
               mode === 'volunteer-signup' ? 'Join as Volunteer' : 
               mode === 'ngo-signup' ? 'Join as NGO' : 
               mode === 'admin' ? 'Admin Access' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {mode === 'login' ? 'Sign in to your account' : 
               mode === 'volunteer' ? 'Access volunteer features' : 
               mode === 'ngo' ? 'Access NGO dashboard' : 
               mode === 'volunteer-signup' ? 'Start making a difference' : 
               mode === 'ngo-signup' ? 'Partner with us' : 
               mode === 'admin' ? 'Access admin panel' : 'Sign in to your account'}
            </Typography>
            
            {/* Mobile Debug Buttons */}
            {isMobile && (
              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={() => {
                    console.log('🧪 AuthForm mobile debug button clicked');
                    console.log('Current mode:', mode);
                    console.log('Touch events supported:', 'ontouchstart' in window);
                    alert('AuthForm mobile debug: Touch events working! Current mode: ' + mode);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: COLORS.accentBlue,
                    borderColor: COLORS.accentBlue,
                    minHeight: '44px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    '&:active': { transform: 'scale(0.95)' }
                  }}
                >
                  🧪 Test Auth Touch
                </Button>
                
                {/* Simple Test Button */}
                <Button
                  onClick={() => alert('Simple button works!')}
                  variant="contained"
                  size="small"
                  sx={{
                    background: '#E4405F',
                    color: '#fff',
                    minHeight: '44px',
                    fontSize: '0.75rem',
                    mt: 1,
                    cursor: 'pointer'
                  }}
                >
                  🔴 Simple Test
                </Button>
                
                {/* Form Test Button */}
                <Button
                  onClick={() => {
                    console.log('Form test button clicked');
                    console.log('Form state:', form);
                    console.log('Current mode:', mode);
                    alert('Form test: Mode=' + mode + ', Email=' + form.email);
                  }}
                  variant="contained"
                  size="small"
                  sx={{
                    background: '#4CAF50',
                    color: '#fff',
                    minHeight: '44px',
                    fontSize: '0.75rem',
                    mt: 1,
                    cursor: 'pointer'
                  }}
                >
                  🟢 Form Test
                </Button>
              </Box>
            )}
          </Box>
          
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              marginBottom: '32px',
              minHeight: isMobile ? '56px' : '48px',
              borderRadius: '8px',
              background: isMobile ? '#2E7D32' : 'rgba(168, 230, 207, 0.1)',
              cursor: 'pointer',
              '& .MuiTabs-scroller': {
                borderRadius: 2,
              },
              '.MuiTabs-indicator': {
                backgroundColor: isMobile ? '#4CAF50' : COLORS.accentGreen,
                height: 3,
                borderRadius: 1.5,
              },
              '.MuiTab-root': {
                minHeight: { xs: 56, sm: 40 },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                fontWeight: 600,
                color: isMobile ? '#fff' : '#666',
                textTransform: 'none',
                padding: { xs: '12px 8px', sm: '8px 12px' },
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                cursor: 'pointer',
                '&.Mui-selected': {
                  color: isMobile ? '#4CAF50' : COLORS.accentGreen,
                  fontWeight: 700,
                  backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                  transition: 'transform 0.1s ease',
                },
                '&:hover': {
                  backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                },
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Volunteer" />
            <Tab label="NGO" />
            <Tab label="Volunteer Signup" />
            <Tab label="NGO Signup" />
            <Tab label="Admin" />
          </Tabs>
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              width: '100%' 
            }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  background: '#fff',
                  minHeight: { xs: '48px', sm: '40px' },
                  fontSize: { xs: '16px', sm: '14px' },
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.accentGreen,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.accentGreen,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  fontSize: { xs: '16px', sm: '14px' },
                  '&.Mui-focused': {
                    color: COLORS.accentGreen,
                  },
                },
              }}
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  background: '#fff',
                  minHeight: { xs: '48px', sm: '40px' },
                  fontSize: { xs: '16px', sm: '14px' },
                  touchAction: 'manipulation',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.accentGreen,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.accentGreen,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  fontSize: { xs: '16px', sm: '14px' },
                  '&.Mui-focused': {
                    color: COLORS.accentGreen,
                  },
                },
              }}
            />
            
            {(mode === "volunteer-signup" || mode === "ngo-signup") && (
              <TextField
                label="Confirm Password"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2,
                    background: '#fff',
                    minHeight: { xs: '48px', sm: '40px' },
                    fontSize: { xs: '16px', sm: '14px' },
                    touchAction: 'manipulation',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.accentGreen,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.accentGreen,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                    fontSize: { xs: '16px', sm: '1rem' },
                    '&.Mui-focused': {
                      color: COLORS.accentGreen,
                    },
                  },
                }}
              />
            )}
            
            {/* MOBILE-OPTIMIZED SUBMIT BUTTON */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              onClick={handleButtonClick}
              sx={{
                borderRadius: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 700,
                py: { xs: 3, sm: 2.5 },
                px: 4,
                minHeight: { xs: '60px', sm: '48px' }, // Increased mobile height
                minWidth: { xs: '100%', sm: 'auto' }, // Full width on mobile
                background: `linear-gradient(135deg, ${mode === "admin" ? '#E4405F' : mode === "volunteer" ? '#4CAF50' : mode === "ngo" ? '#FF9800' : mode === "volunteer-signup" ? '#4CAF50' : mode === "ngo-signup" ? '#FF9800' : COLORS.accentGreen} 0%, ${mode === "admin" ? '#C13584' : mode === "volunteer" ? '#388E3C' : mode === "ngo" ? '#F57C00' : mode === "volunteer-signup" ? '#388E3C' : mode === "ngo-signup" ? '#F57C00' : COLORS.accentBlue} 100%)`,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                cursor: 'pointer',
                // Mobile-specific styles
                '@media (max-width: 768px)': {
                  minHeight: '60px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  border: '2px solid #fff',
                  '&:active': {
                    transform: 'scale(0.98)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.5)',
                  },
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.3)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  cursor: 'not-allowed',
                  transform: 'none',
                },
                mb: 2,
                mt: 2,
              }}
            >
              {isSubmitting ? '🔄 Processing...' : 
               mode === "login" ? "🚀 Sign In" : 
               mode === "volunteer" ? "🌱 Login as Volunteer" : 
               mode === "ngo" ? "🏢 Login as NGO" : 
               mode === "volunteer-signup" ? "🌟 Join as Volunteer" : 
               mode === "ngo-signup" ? "🤝 Join as NGO" : "⚡ Access Admin Panel"}
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ 
              mt: 3, 
              borderRadius: 2, 
              fontSize: '0.9rem', 
              border: '1px solid #ffcdd2', 
              background: '#ffebee', 
              color: '#c62828', 
              fontWeight: 600,
              '& .MuiAlert-icon': {
                color: '#c62828',
              }
            }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          
          {info && (
            <Alert severity="info" sx={{ 
              mt: 3, 
              borderRadius: 2, 
              fontSize: '0.9rem', 
              border: '1px solid #bbdefb', 
              background: '#e3f2fd', 
              color: '#1565c0', 
              fontWeight: 600,
              '& .MuiAlert-icon': {
                color: '#1565c0',
              }
            }} onClose={() => setInfo("")}>
              {info}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm; 