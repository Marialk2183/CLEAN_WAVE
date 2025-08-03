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

const AuthForm = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
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
        maxWidth: 600,
        width: '100%',
        borderRadius: 6,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        background: COLORS.card,
        p: 0,
      }}>
        <CardContent sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.accentGreen, mb: 3, textAlign: 'center', letterSpacing: 1 }}>
            {mode === 'login' ? 'Login' : mode === 'volunteer' ? 'Volunteer Login' : mode === 'ngo' ? 'NGO Login' : mode === 'volunteer-signup' ? 'Volunteer Signup' : mode === 'ngo-signup' ? 'NGO Signup' : 'Admin Login'}
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={(_, idx) => setMode(idx === 0 ? 'login' : idx === 1 ? 'volunteer' : idx === 2 ? 'ngo' : idx === 3 ? 'volunteer-signup' : idx === 4 ? 'ngo-signup' : idx === 5 ? 'admin' : 'login')}
            variant="fullWidth"
            sx={{
              mb: 4,
              minHeight: 40,
              borderRadius: 3,
              background: COLORS.background,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderBottom: `2px solid ${COLORS.accentBrown}`,
              '.MuiTabs-indicator': {
                backgroundColor: COLORS.accentGreen,
                height: 4,
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Login" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
            <Tab label="Volunteer" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
            <Tab label="NGO" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
            <Tab label="Volunteer Signup" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
            <Tab label="NGO Signup" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
            <Tab label="Admin" sx={{ fontWeight: 600, color: COLORS.accentBrown, minHeight: 40, fontSize: 16 }} />
          </Tabs>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              fullWidth
              variant="outlined"
              sx={{ borderRadius: 3, background: COLORS.background, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputLabelProps={{ style: { color: COLORS.accentBrown } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              fullWidth
              variant="outlined"
              sx={{ borderRadius: 3, background: COLORS.background, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputLabelProps={{ style: { color: COLORS.accentBrown } }}
            />
            {(mode === "volunteer-signup" || mode === "ngo-signup") && (
              <TextField
                label="Confirm Password"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                fullWidth
                variant="outlined"
                sx={{ borderRadius: 3, background: COLORS.background, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputLabelProps={{ style: { color: COLORS.accentBrown } }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 3,
                fontSize: 18,
                fontWeight: 700,
                py: 2,
                px: 4,
                background: mode === "admin" ? '#E4405F' : mode === "volunteer" ? '#4CAF50' : mode === "ngo" ? '#FF9800' : mode === "volunteer-signup" ? '#4CAF50' : mode === "ngo-signup" ? '#FF9800' : COLORS.accentGreen,
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                textTransform: 'none',
                '&:hover': {
                  background: mode === "admin" ? '#C13584' : mode === "volunteer" ? '#388E3C' : mode === "ngo" ? '#F57C00' : mode === "volunteer-signup" ? '#388E3C' : mode === "ngo-signup" ? '#F57C00' : COLORS.accentBlue,
                  color: '#fff',
                },
                mb: 2,
                mt: 2,
              }}
            >
              {mode === "login" ? "Login" : mode === "volunteer" ? "Login as Volunteer" : mode === "ngo" ? "Login as NGO" : mode === "volunteer-signup" ? "Signup as Volunteer" : mode === "ngo-signup" ? "Signup as NGO" : "Login as Admin"}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 3, fontSize: 16, border: `1.5px solid ${COLORS.accentGreen}`, background: COLORS.background, color: '#b26a00', fontWeight: 600 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {info && (
            <Alert severity="info" sx={{ mt: 3, borderRadius: 3, fontSize: 16, border: `1.5px solid ${COLORS.accentBlue}`, background: COLORS.background, color: '#0083b0', fontWeight: 600 }} onClose={() => setInfo("")}>
              {info}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm; 