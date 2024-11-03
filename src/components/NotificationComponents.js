import React from 'react';
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Divider,
  Badge,
  useTheme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircleOutline,
  Warning,
  Info,
  Error,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useStore } from '@nanostores/react';
import {
  notificationStore,
  markAsRead,
  markAllAsRead,
} from '../stores/notificationStore';

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'success':
      return <CheckCircleOutline color="success" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'error':
      return <Error color="error" />;
    default:
      return <Info color="info" />;
  }
};

export const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (notifications.length === 0) {
    return (
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications</Typography>
        </Box>
      </Menu>
    );
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 360, maxHeight: 500 },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Notifications</Typography>
        <Button size="small" onClick={onMarkAllRead}>
          Mark all as read
        </Button>
      </Box>
      <Divider />
      {notifications.map((notification) => (
        <MenuItem
          key={notification.id}
          sx={{
            py: 1.5,
            px: 2,
            borderLeft: 3,
            borderColor: notification.read ? 'transparent' : 'primary.main',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => {
            if (!notification.read) {
              markAsRead(notification.id);
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <Box sx={{ mt: 0.5 }}>{getSeverityIcon(notification.severity)}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(notification.timestamp, {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
};

export const NotificationSection = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { notifications, unreadCount } = useStore(notificationStore);
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" size="large" onClick={handleClick}>
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              right: -3,
              top: 3,
              border: `2px solid ${theme.palette.background.paper}`,
              padding: '0 4px',
              minWidth: '20px',
              height: '20px',
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
};
