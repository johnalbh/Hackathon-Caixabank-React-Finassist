import { PersonAdd, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../stores/authStore';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long and contain both letters and numbers'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({ email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    }
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
        Register
      </Typography>
      <form onSubmit={handleRegister}>
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
          type={showPassword.password ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!error && !formData.password}
          helperText="Password must be at least 8 characters long and contain both letters and numbers"
          required
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => handleClickShowPassword('password')}
                edge="end"
                size="small"
                sx={{ minWidth: 'auto' }}
              >
                {showPassword.password ? <VisibilityOff /> : <Visibility />}
              </Button>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showPassword.confirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!error && !formData.confirmPassword}
          required
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => handleClickShowPassword('confirmPassword')}
                edge="end"
                size="small"
                sx={{ minWidth: 'auto' }}
              >
                {showPassword.confirmPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
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
          startIcon={<PersonAdd />}
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Account created successfully! Redirecting to dashboard...
        </Alert>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          component={Link}
          to="/login"
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          Already have an account? Sign in
        </Button>
      </Box>
    </Box>
  );
}

export default RegisterPage;
