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

const AuthForm = ({ onAuth, initialMode = "login", onModeChange }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    
    if (mode === "admin") {
      // Admin login - try hardcoded first, then Firebase
      if (form.email === "admin@cleanwave.com" && form.password === "admin123") {
        if (onAuth) onAuth(form.email, form.password, "admin");
        return;
      } else {
        // Try Firebase authentication for admin
        try {
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "admin");
        } catch (err) {
          setError("Invalid admin credentials. Please use admin@cleanwave.com / admin123 or your registered email/password.");
        }
      }
      return;
    }
    
    if (mode === "volunteer-signup") {
      // Volunteer signup - create account with Firebase
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setInfo("Volunteer account created! Please check your email for verification, then login.");
        // Clear form after successful signup
        setForm({ email: "", password: "", confirm: "" });
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    
    if (mode === "ngo-signup") {
      // NGO signup - create account with Firebase
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setInfo("NGO account created! Please check your email for verification, then login.");
        // Clear form after successful signup
        setForm({ email: "", password: "", confirm: "" });
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    
    if (mode === "login") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email before logging in. Check your inbox for a verification link.");
          return;
        }
        if (onAuth) onAuth(form.email, form.password, mode);
      } catch (err) {
        setError(err.message);
      }
    } else if (mode === "volunteer") {
      // Check if it's a hardcoded volunteer or Firebase user
      if (form.email === "volunteer@cleanwave.com" && form.password === "volunteer123") {
        if (onAuth) onAuth(form.email, form.password, "volunteer");
        return;
      } else {
        // Try Firebase authentication for volunteer
        try {
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "volunteer");
        } catch (err) {
          setError("Invalid volunteer credentials. Please use volunteer@cleanwave.com / volunteer123 or your registered email/password.");
        }
      }
    } else if (mode === "ngo") {
      // Check if it's a hardcoded NGO or Firebase user
      if (form.email === "ngo@cleanwave.com" && form.password === "ngo123") {
        if (onAuth) onAuth(form.email, form.password, "ngo");
        return;
      } else {
        // Try Firebase authentication for NGO
        try {
          const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
          if (!userCredential.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for a verification link.");
            return;
          }
          if (onAuth) onAuth(form.email, form.password, "ngo");
        } catch (err) {
          setError("Invalid NGO credentials. Please use ngo@cleanwave.com / ngo123 or your registered email/password.");
        }
      }
    } else {
      // Regular signup
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(userCredential.user);
        setInfo("Verification email sent! Please check your inbox and verify your email before logging in.");
        // Clear form after successful signup
        setForm({ email: "", password: "", confirm: "" });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const tabIndex = mode === "login" ? 0 : mode === "volunteer" ? 1 : mode === "ngo" ? 2 : mode === "volunteer-signup" ? 3 : mode === "ngo-signup" ? 4 : mode === "admin" ? 5 : 6;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <Card sx={{
        maxWidth: 800,
        width: '100%',
        borderRadius: 4,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(168, 230, 207, 0.2)',
        overflow: 'hidden',
        position: 'relative',
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
          p: { xs: 4, sm: 5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}>
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
          </Box>
          <Tabs
            value={tabIndex}
            onChange={(_, idx) => {
              const newMode = idx === 0 ? 'login' : idx === 1 ? 'volunteer' : idx === 2 ? 'ngo' : idx === 3 ? 'volunteer-signup' : idx === 4 ? 'ngo-signup' : idx === 5 ? 'admin' : 'login';
              setMode(newMode);
              if (onModeChange) {
                onModeChange(newMode);
              }
            }}
            variant="fullWidth"
            sx={{
              mb: 4,
              minHeight: 48,
              borderRadius: 2,
              background: 'rgba(168, 230, 207, 0.1)',
              '& .MuiTabs-scroller': {
                borderRadius: 2,
              },
              '.MuiTabs-indicator': {
                backgroundColor: COLORS.accentGreen,
                height: 3,
                borderRadius: 1.5,
              },
              '.MuiTab-root': {
                minHeight: 40,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                fontWeight: 600,
                color: '#666',
                textTransform: 'none',
                padding: { xs: '6px 8px', sm: '8px 12px' },
                '&.Mui-selected': {
                  color: COLORS.accentGreen,
                  fontWeight: 700,
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
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
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
                    '&.Mui-focused': {
                      color: COLORS.accentGreen,
                    },
                  },
                }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 700,
                py: 2.5,
                px: 4,
                background: `linear-gradient(135deg, ${mode === "admin" ? '#E4405F' : mode === "volunteer" ? '#4CAF50' : mode === "ngo" ? '#FF9800' : mode === "volunteer-signup" ? '#4CAF50' : mode === "ngo-signup" ? '#FF9800' : COLORS.accentGreen} 0%, ${mode === "admin" ? '#C13584' : mode === "volunteer" ? '#388E3C' : mode === "ngo" ? '#F57C00' : mode === "volunteer-signup" ? '#388E3C' : mode === "ngo-signup" ? '#F57C00' : COLORS.accentBlue} 100%)`,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                mb: 2,
                mt: 2,
              }}
            >
              {mode === "login" ? "Sign In" : mode === "volunteer" ? "Login as Volunteer" : mode === "ngo" ? "Login as NGO" : mode === "volunteer-signup" ? "Join as Volunteer" : mode === "ngo-signup" ? "Join as NGO" : "Access Admin Panel"}
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