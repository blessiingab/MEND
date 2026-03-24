import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Typography,
  Button,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      {/* Dashboard Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1C1917' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            ❤️ MEND Dashboard
          </Typography>
          <Avatar sx={{ mr: 2 }}>{user?.name?.charAt(0).toUpperCase()}</Avatar>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Welcome, {user?.name}! 👋
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, color: '#502506' }}>
          Account Type: <strong>{user?.type?.charAt(0).toUpperCase() + user?.type?.slice(1)}</strong>
        </Typography>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                ✨ Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: '#c17f76' }}
                  onClick={() => navigate('/assessment')}
                >
                  Start Assessment
                </Button>
                <Button fullWidth variant="outlined">
                  View Resources
                </Button>
                <Button fullWidth variant="outlined">
                  Book Therapy Session
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                📊 Your Statistics
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#c17f76', fontWeight: 700 }}>
                    0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#502506' }}>
                    Assessments
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#053e21', fontWeight: 700 }}>
                    0
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#502506' }}>
                    Sessions
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Welcome Section */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #3ECAAD 0%, #5B9BD5 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                How are you feeling today?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Take a quick assessment to track your emotional well-being and get personalized recommendations.
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'white', color: '#1C1917', fontWeight: 700 }}
                onClick={() => navigate('/assessment')}
              >
                Take Assessment
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}