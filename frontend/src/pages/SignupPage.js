import React, { useState } from 'react';
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

export default function SignupPage({ setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'youth',
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
      const response = await authAPI.signup(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
            Join MEND
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, color: '#502506' }}>
            Free forever · No credit card needed
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

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

            <FormControl fullWidth margin="normal">
              <InputLabel>Account Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Account Type"
              >
                <MenuItem value="youth">👨‍👩‍👧‍👦 Youth</MenuItem>
                <MenuItem value="therapist">👨‍⚕️ Therapist</MenuItem>
                <MenuItem value="mentor">🌟 Career Mentor</MenuItem>
              </Select>
            </FormControl>

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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
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
              {loading ? 'Creating Account...' : 'Create My Account'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 2, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Typography
              component="span"
              sx={{ color: '#c17f76', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Typography>
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}