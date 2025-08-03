import React, { useState } from "react";
import { Button, Modal, Form, Spinner, Alert, Card } from 'react-bootstrap';
import { Typography, Box } from '@mui/material';

// Updated API URL - using a working waste classification service
const API_URL = "https://api-inference.huggingface.co/models/watersplash/waste-classification";

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#F9FAFB',
  card: '#ffffff',
  blackHeader: '#1C1C1C',
  textLight: '#ffffff',
  textDark: '#222',
};

export default function ImageClassifierChatbot({ floating = true }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleClassify = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");
    
    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add your Hugging Face API token here if you have one
            // "Authorization": "Bearer YOUR_HUGGING_FACE_TOKEN"
          },
          body: JSON.stringify({
            inputs: `data:image/jpeg;base64,${base64Image}`
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the response format from Hugging Face API
        if (Array.isArray(data) && data.length > 0) {
          const topResult = data[0];
          setResult({
            label: topResult.label,
            score: topResult.score
          });
        } else {
          throw new Error("Invalid response format");
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Classification error:", err);
      setError("Failed to classify image. Please try again or check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const StyledCard = ({ children }) => (
    <Card
      style={{
        maxWidth: 500,
        margin: '0 auto',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        background: COLORS.card,
      }}
    >
      <div style={{
        background: COLORS.blackHeader,
        padding: '16px 24px',
        color: COLORS.textLight,
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: 0.5,
      }}>
        🧠 Waste Image Classifier
      </div>
      <Card.Body style={{ padding: 24 }}>
        {children}
      </Card.Body>
    </Card>
  );

  const ClassifyForm = () => (
    <Form onSubmit={handleClassify}>
      <Form.Group controlId="waste-image-upload" className="mb-3">
        <Form.Label style={{ fontWeight: 600 }}>Upload an image</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
      </Form.Group>
      <Button
        type="submit"
        style={{
          background: COLORS.accentGreen,
          color: COLORS.textDark,
          border: 'none',
          width: '100%',
          fontWeight: 700,
          padding: '10px 0',
          borderRadius: 8,
        }}
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Classify"}
      </Button>
    </Form>
  );

  const ResultAlert = () => result && (
    <Alert variant="success" className="mt-3" style={{
      background: COLORS.accentGreen,
      color: COLORS.textDark,
      fontWeight: 600,
      borderRadius: 8,
    }}>
      <div><b>Waste Type:</b> {result.label}</div>
      <div><b>Confidence:</b> {(result.score * 100).toFixed(1)}%</div>
      <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
        <b>Disposal Tip:</b> {getDisposalTip(result.label)}
      </div>
    </Alert>
  );

  const ErrorAlert = () => error && (
    <Alert variant="danger" className="mt-3" style={{ borderRadius: 8 }}>
      {error}
    </Alert>
  );

  // Helper function to provide disposal tips
  const getDisposalTip = (wasteType) => {
    const tips = {
      'cardboard': 'Recycle in paper/cardboard bin',
      'glass': 'Recycle in glass bin',
      'metal': 'Recycle in metal bin',
      'paper': 'Recycle in paper bin',
      'plastic': 'Check local recycling guidelines',
      'trash': 'Dispose in general waste bin',
      'wood': 'Recycle if untreated, otherwise general waste'
    };
    return tips[wasteType.toLowerCase()] || 'Check local waste disposal guidelines';
  };

  if (!floating) {
    return (
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
        py: 4,
        px: 0,
        my: 4,
        borderRadius: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderTop: '3px solid #B3E5FC',
        borderBottom: '3px solid #B3E5FC'
      }}>
        <Box sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3
        }}>
          <Typography variant="h4" sx={{
            textAlign: 'center',
            mb: 3,
            fontWeight: 700,
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            🧠 Waste Image Classifier
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ flex: 1, maxWidth: 400 }}>
              <Form onSubmit={handleClassify}>
                <Form.Group controlId="waste-image-upload" className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '1.1rem' }}>Upload an image of waste</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                <Button
                  type="submit"
                  style={{
                    background: COLORS.accentGreen,
                    color: COLORS.textDark,
                    border: 'none',
                    width: '100%',
                    fontWeight: 700,
                    padding: '12px 0',
                    borderRadius: 8,
                    fontSize: '1.1rem'
                  }}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Classify Waste"}
                </Button>
              </Form>
            </Box>
            <Box sx={{ flex: 1, maxWidth: 400 }}>
              <ErrorAlert />
              <ResultAlert />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Floating button/modal mode
  return (
    <>
      <Button
        variant="primary"
        className="position-fixed bottom-0 end-0 m-5 rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: 72,
          height: 72,
          fontSize: "2rem",
          background: COLORS.blackHeader,
          color: COLORS.textLight,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 1050,
        }}
        onClick={() => setOpen(true)}
        aria-label="Open Waste Classifier"
      >
        🖼️
      </Button>

      <Modal show={open} onHide={() => setOpen(false)} centered size="sm">
        <Modal.Header closeButton style={{ background: COLORS.blackHeader, color: COLORS.textLight }}>
          <Modal.Title>🖼️ Waste Classifier</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: COLORS.background, padding: '1.5rem' }}>
          <ClassifyForm />
          <ErrorAlert />
          <ResultAlert />
        </Modal.Body>
      </Modal>
    </>
  );
}
