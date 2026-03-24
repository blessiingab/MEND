import React from 'react';
import { Container, Button, Box, Typography, Card, Grid, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#1C1917' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            ❤️ MEND
          </Typography>
          <Button onClick={() => navigate('/signin')} sx={{ mr: 2 }}>Sign In</Button>
          <Button variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FEF2E8 0%, #FDE8D0 50%, #FCECD5 100%)',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            Mental Wellness for <span style={{ color: '#c17f76' }}>African Youth</span>
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#502506' }}>
            A safe, culturally-sensitive platform for mental health support, creative expression, and career advancement.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: '#c17f76' }}
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button variant="outlined" size="large">
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          What MEND Offers
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>🧠</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Mental Health Support</Typography>
              <Typography>Access self-assessment tools and connect with qualified therapists.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>🎨</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Creative Expression</Typography>
              <Typography>Share your stories and art in a safe, supportive community.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>⭐</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Talent Nurturing</Typography>
              <Typography>Discover and develop your talents with mentor feedback.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>📈</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Career Guidance</Typography>
              <Typography>Get matched with mentors and access professional growth resources.</Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}