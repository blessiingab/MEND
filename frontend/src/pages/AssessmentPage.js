import React, { useState } from 'react';
import {
  Container,
  Card,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Alert,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../utils/api';

export default function AssessmentPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    anxiety: 2,
    sadness: 2,
    mood: 2,
    sleep: 2,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await assessmentAPI.create({ answers });
      setSuccess('Assessment submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1C1917' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            ❤️ MEND - Assessment
          </Typography>
          <Avatar sx={{ mr: 2 }}>{user?.name?.charAt(0).toUpperCase()}</Avatar>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
            Emotional Well-being Assessment
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: '#502506' }}>
            Answer honestly to understand your current emotional state.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Question 1 */}
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                How often do you feel anxious or nervous?
              </Typography>
              <RadioGroup
                value={String(answers.anxiety)}
                onChange={(e) => handleChange('anxiety', Number(e.target.value))}
              >
                <FormControlLabel value="1" control={<Radio />} label="Not at all" />
                <FormControlLabel value="2" control={<Radio />} label="Sometimes" />
                <FormControlLabel value="3" control={<Radio />} label="Often" />
                <FormControlLabel value="4" control={<Radio />} label="Always" />
              </RadioGroup>
            </Box>

            {/* Question 2 */}
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                How often do you feel sad or hopeless?
              </Typography>
              <RadioGroup
                value={String(answers.sadness)}
                onChange={(e) => handleChange('sadness', Number(e.target.value))}
              >
                <FormControlLabel value="1" control={<Radio />} label="Not at all" />
                <FormControlLabel value="2" control={<Radio />} label="Sometimes" />
                <FormControlLabel value="3" control={<Radio />} label="Often" />
                <FormControlLabel value="4" control={<Radio />} label="Always" />
              </RadioGroup>
            </Box>

            {/* Question 3 */}
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                How would you rate your overall mood this week?
              </Typography>
              <RadioGroup
                value={String(answers.mood)}
                onChange={(e) => handleChange('mood', Number(e.target.value))}
              >
                <FormControlLabel value="1" control={<Radio />} label="Very low" />
                <FormControlLabel value="2" control={<Radio />} label="Low" />
                <FormControlLabel value="3" control={<Radio />} label="Okay" />
                <FormControlLabel value="4" control={<Radio />} label="Good" />
              </RadioGroup>
            </Box>

            {/* Question 4 */}
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                How often do you have trouble sleeping?
              </Typography>
              <RadioGroup
                value={String(answers.sleep)}
                onChange={(e) => handleChange('sleep', Number(e.target.value))}
              >
                <FormControlLabel value="1" control={<Radio />} label="Never" />
                <FormControlLabel value="2" control={<Radio />} label="Rarely" />
                <FormControlLabel value="3" control={<Radio />} label="Often" />
                <FormControlLabel value="4" control={<Radio />} label="Every night" />
              </RadioGroup>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 4, backgroundColor: '#c17f76' }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
        </Card>
      </Container>
    </>
  );
}