import {
  Key,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showNotification } from '../stores/notificationStore';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const generatePassword = () => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      showNotification({
        message: 'Please enter your email address',
        severity: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      showNotification({
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((user) => user.email === email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userExists || email === 'default@example.com') {
        const generatedPassword = generatePassword();
        setNewPassword(generatedPassword);

        const updatedUsers = users.map((user) => {
          if (user.email === email) {
            return { ...user, password: generatedPassword };
          }
          return user;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        showNotification({
          message: 'Password has been reset successfully',
          severity: 'success',
        });

        setDialogOpen(true);
      } else {
        showNotification({
          message: 'No account found with this email address',
          severity: 'error',
        });
      }
    } catch (error) {
      showNotification({
        message: 'An error occurred. Please try again later.',
        severity: 'error',
      });
    }

    setIsSubmitting(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEmail('');
    navigate('/login');
  };

  return (
    <>
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
          Forgot Password
        </Typography>

        <Typography color="textSecondary" align="center" sx={{ mb: 4 }}>
          Enter your email address and we'll generate a new password for you.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoComplete="email"
            disabled={isSubmitting}
            InputProps={{
              startAdornment: <EmailIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
            startIcon={<Key />}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? 'Generating...' : 'Generate New Password'}
          </Button>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </form>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'New Password Generated'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your new password is: <strong>{newPassword}</strong>
            <br />
            <br />
            Please make sure to save this password in a secure location. You
            will need it to log in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Got it, take me to login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ForgotPasswordPage;
