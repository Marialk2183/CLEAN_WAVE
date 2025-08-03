import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
};

const DonationButton = () => {
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

  return (
    <Box sx={{ 
      my: 4, 
      background: COLORS.background, 
      borderRadius: 3, 
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', 
      p: 2,
      width: '100%',
      maxWidth: 400,
      mx: 'auto',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Button
        variant="contained"
        onClick={handleDonate}
        sx={{
          borderRadius: 3,
          fontSize: 18,
          fontWeight: 700,
          px: 5,
          py: 1.5,
          background: COLORS.accentGreen,
          color: '#333',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          textTransform: 'none',
          '&:hover': {
            background: COLORS.accentBlue,
            color: '#222',
          },
        }}
      >
        Donate Now
      </Button>
    </Box>
  );
};

export default DonationButton; 