import {
  Key,
  Login as LoginIcon,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../stores/authStore';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const defaultCredentials = {
    email: 'default@example.com',
    password: 'password123',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (
        user ||
        (email === defaultCredentials.email &&
          password === defaultCredentials.password)
      ) {
        await login({ email });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const handleShowDefaultCredentials = () => {
    setFormData({
      email: defaultCredentials.email,
      password: defaultCredentials.password,
    });
    setShowCredentials(!showCredentials);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        border: '1px solid #ddd',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!error && !formData.email}
          required
          autoComplete="email"
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!error && !formData.password}
          required
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
                sx={{ minWidth: 'auto' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Button>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<LoginIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            fullWidth
            startIcon={<PersonAdd />}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
            }}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            onClick={handleShowDefaultCredentials}
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<Key />}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
            }}
          >
            Demo Access
          </Button>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Button component={Link} to="/forgot-password" color="primary">
              Forgot Password?
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {showCredentials && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <AlertTitle>Demo Credentials</AlertTitle>
          <strong>Email:</strong> {defaultCredentials.email}
          <br />
          <strong>Password:</strong> {defaultCredentials.password}
        </Alert>
      )}
    </Box>
  );
}

export default LoginPage;
