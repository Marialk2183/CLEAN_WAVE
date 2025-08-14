import React, { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const AuthForm = ({ onAuth, onSignup, onLogin, initialMode = "login", onModeChange }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple tab change handler
  const handleTabChange = (newMode) => {
    console.log('🎯 Tab changed to:', newMode);
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Bulletproof form submission handler
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

  // Bulletproof button click handler
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

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      position: 'relative',
      zIndex: 1000,
      width: '100%',
      padding: isMobile ? '16px' : '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: isMobile ? '95%' : '100%',
        width: '100%',
        borderRadius: isMobile ? '12px' : '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        background: '#ffffff',
        border: '1px solid rgba(168, 230, 207, 0.2)',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1001,
        margin: isMobile ? '16px' : '0'
      }}>
        {/* Header Bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #A8E6CF, #B3E5FC, #D7CCC8)',
          borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0'
        }}></div>
        
        <div style={{
          padding: isMobile ? '20px 16px' : '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Mobile Close Button */}
          <button
            onClick={() => window.location.reload()}
            style={{
              position: 'absolute',
              top: isMobile ? '12px' : '16px',
              right: isMobile ? '12px' : '16px',
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: '50%',
              background: '#E4405F',
              color: '#fff',
              border: 'none',
              fontSize: isMobile ? '14px' : '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1002
            }}
          >
            ✕
          </button>
          
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: isMobile ? '24px' : '32px'
          }}>
            <h1 style={{
              color: '#2E7D32',
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: 700,
              margin: 0,
              marginBottom: isMobile ? '8px' : '12px'
            }}>
              {mode === 'login' ? '🔐 Login' : 
               mode === 'volunteer' ? '👥 Volunteer Login' :
               mode === 'ngo' ? '🏢 NGO Login' :
               mode === 'volunteer-signup' ? '👥 Volunteer Signup' :
               mode === 'ngo-signup' ? '🏢 NGO Signup' :
               mode === 'admin' ? '👑 Admin Login' : '🔐 Auth'}
            </h1>
            <p style={{
              color: '#666',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              margin: 0,
              lineHeight: 1.4
            }}>
              {mode === 'login' ? 'Welcome back! Please sign in to your account.' :
               mode === 'volunteer' ? 'Volunteer login portal. Access your volunteer dashboard.' :
               mode === 'ngo' ? 'NGO login portal. Access your organization dashboard.' :
               mode === 'volunteer-signup' ? 'Join our volunteer community! Create your account.' :
               mode === 'ngo-signup' ? 'Register your NGO organization with us.' :
               mode === 'admin' ? 'Administrator access portal.' : 'Authentication required.'}
            </p>
          </div>
          
          {/* Tabs */}
          <div style={{
            display: 'flex',
            width: '100%',
            background: '#2E7D32',
            borderRadius: '8px',
            marginBottom: isMobile ? '24px' : '32px',
            overflow: 'hidden'
          }}>
            {[
              { key: 'login', label: 'Login' },
              { key: 'volunteer', label: 'Volunteer' },
              { key: 'ngo', label: 'NGO' },
              { key: 'volunteer-signup', label: 'Volunteer Signup' },
              { key: 'ngo-signup', label: 'NGO Signup' },
              { key: 'admin', label: 'Admin' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  flex: 1,
                  background: mode === tab.key ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: mode === tab.key ? '#4CAF50' : '#ffffff',
                  border: 'none',
                  padding: isMobile ? '12px 6px' : '16px 8px',
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  fontWeight: mode === tab.key ? 700 : 600,
                  cursor: 'pointer',
                  minHeight: isMobile ? '48px' : '56px',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Form */}
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '20px' : '24px',
              width: '100%'
            }}
          >
            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: isMobile ? '6px' : '8px',
                color: '#666',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 500
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '14px' : '16px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#fff',
                  boxSizing: 'border-box',
                  minHeight: isMobile ? '44px' : '48px'
                }}
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: isMobile ? '6px' : '8px',
                color: '#666',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 500
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '14px' : '16px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#fff',
                  boxSizing: 'border-box',
                  minHeight: isMobile ? '44px' : '48px'
                }}
              />
            </div>
            
            {/* Confirm Password Input */}
            {(mode === "volunteer-signup" || mode === "ngo-signup") && (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: isMobile ? '6px' : '8px',
                  color: '#666',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: 500
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  style={{
                    width: '100%',
                    padding: isMobile ? '14px' : '16px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    background: '#fff',
                    boxSizing: 'border-box',
                    minHeight: isMobile ? '44px' : '48px'
                  }}
                />
              </div>
            )}
            
            {/* SUBMIT BUTTON - BULLETPROOF */}
            <button
              type="submit"
              onClick={handleButtonClick}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: isMobile ? '16px' : '20px',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${mode === "admin" ? '#E4405F' : mode === "volunteer" ? '#4CAF50' : mode === "ngo" ? '#FF9800' : mode === "volunteer-signup" ? '#4CAF50' : mode === "ngo-signup" ? '#FF9800' : '#4CAF50'} 0%, ${mode === "admin" ? '#C13584' : mode === "volunteer" ? '#388E3C' : mode === "ngo" ? '#F57C00' : mode === "volunteer-signup" ? '#388E3C' : mode === "ngo-signup" ? '#FF9800' : '#388E3C'} 100%)`,
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                minHeight: isMobile ? '56px' : '64px',
                marginTop: isMobile ? '12px' : '16px',
                marginBottom: isMobile ? '12px' : '16px',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s ease',
                // Force mobile compatibility
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {isSubmitting ? '🔄 Processing...' : 
               mode === "login" ? "🚀 Sign In" : 
               mode === "volunteer" ? "🌱 Login as Volunteer" : 
               mode === "ngo" ? "🏢 Login as NGO" : 
               mode === "volunteer-signup" ? "🌟 Join as Volunteer" : 
               mode === "ngo-signup" ? "🤝 Join as NGO" : "⚡ Access Admin Panel"}
            </button>
          </form>
          
          {/* Error Alert */}
          {error && (
            <div style={{
              marginTop: isMobile ? '20px' : '24px',
              padding: isMobile ? '14px' : '16px',
              borderRadius: '8px',
              border: '1px solid #ffcdd2',
              background: '#ffebee',
              color: '#c62828',
              fontWeight: 600,
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {error}
            </div>
          )}
          
          {/* Info Alert */}
          {info && (
            <div style={{
              marginTop: isMobile ? '20px' : '24px',
              padding: isMobile ? '14px' : '16px',
              borderRadius: '8px',
              border: '1px solid #bbdefb',
              background: '#e3f2fd',
              color: '#1565c0',
              fontWeight: 600,
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {info}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 