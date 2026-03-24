import React, { useState } from 'react';
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

export default function SigninPage({ setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signin(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: '#502506' }}>
            Sign in to your MEND account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, backgroundColor: '#c17f76' }}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 2, fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Typography
              component="span"
              sx={{ color: '#c17f76', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/signup')}
            >
              Create one free
            </Typography>
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}