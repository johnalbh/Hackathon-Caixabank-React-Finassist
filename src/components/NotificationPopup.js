import React from 'react';
import { useStore } from '@nanostores/react';
import { Alert, Stack } from '@mui/material';
import { notificationStore, hideAlert } from '../stores/notificationStore';

const NotificationPopup = () => {
  const { activeAlerts } = useStore(notificationStore);

  const handleClose = (id) => (event, reason) => {
    if (reason === 'clickaway') return;
    hideAlert(id);
  };

  if (activeAlerts.length === 0) return null;

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        maxWidth: '400px',
        zIndex: 2000,
      }}
    >
      {activeAlerts.map((alert) => (
        <Alert
          key={alert.id}
          onClose={handleClose(alert.id)}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      ))}
    </Stack>
  );
};

export default NotificationPopup;
