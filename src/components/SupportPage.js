import React, {
  Profiler,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import PropTypes from 'prop-types';

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';

import { onRenderCallback } from '../utils/onRenderCallback';
import {
  CONTACTS_CONFIG,
  TIME_SIMULATE_LOADING,
} from '../constants/generalConstants';

const AvatarWithFallback = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Avatar
      src={imgError ? null : user.avatarUrl}
      onError={() => setImgError(true)}
      sx={{
        width: 56,
        height: 56,
        bgcolor: imgError ? 'primary.main' : 'transparent',
      }}
    >
      {imgError && user.name.charAt(0)}
    </Avatar>
  );
};

AvatarWithFallback.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const ContactsLoadingSkeleton = () => (
  <List>
    {[...Array(CONTACTS_CONFIG.DEFAULT_CONTACTS)].map((_, index) => (
      <ListItem
        key={index}
        alignItems="flex-start"
        sx={{
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          '&:last-child': { mb: 0 },
        }}
      >
        <ListItemAvatar sx={{ minWidth: 72 }}>
          <Skeleton variant="circular" width={56} height={56} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={
            <>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="30%" />
            </>
          }
          sx={{ mb: { xs: 1, sm: 0 } }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={36}
          sx={{
            borderRadius: 1,
            alignSelf: { xs: 'stretch', sm: 'center' },
            ml: { xs: 0, sm: 2 },
          }}
        />
      </ListItem>
    ))}
  </List>
);

const ContactListItem = ({ user }) => (
  <ListItem
    alignItems="flex-start"
    sx={{
      mb: 2,
      '&:last-child': { mb: 0 },
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 0 },
      '&:hover': {
        bgcolor: 'action.hover',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
      },
    }}
  >
    <ListItemAvatar sx={{ minWidth: 72 }}>
      <AvatarWithFallback user={user} />
    </ListItemAvatar>
    <ListItemText
      primary={
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          {user.name} - {user.email}
        </Typography>
      }
      secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary">
            Phone: {user.phone}
          </Typography>
          <br />
          <Typography component="span" variant="body2" color="text.secondary">
            Company: {user.company.name}
          </Typography>
        </>
      }
      sx={{ mb: { xs: 1, sm: 0 } }}
    />
    <Button variant="contained" color="primary" href={`mailto:${user.email}`}>
      Contact
    </Button>
  </ListItem>
);

ContactListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

function SupportPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch users`);
      }
      const data = await response.json();
      const limitedData = data.slice(0, CONTACTS_CONFIG.MAX_CONTACTS);
      const usersWithAvatars = limitedData.map((user) => ({
        ...user,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.email}`,
      }));
      setUsers(usersWithAvatars);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, TIME_SIMULATE_LOADING.LOADING_DELAY);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRetry = () => {
    setError(null);
    fetchUsers();
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  return (
    <Profiler id="SupportPage" onRender={onRenderCallback}>
      <Box sx={{ mt: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Support Contacts
        </Typography>

        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={!!error}
          sx={{ mb: 4 }}
        />

        <Suspense fallback={<CircularProgress />}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            {error ? (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  action={
                    <Button color="inherit" size="small" onClick={handleRetry}>
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Fade>
            ) : (
              <List>
                {loading ? (
                  <ContactsLoadingSkeleton />
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <ContactListItem key={user.id} user={user} />
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                  >
                    No contacts found matching your search.
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        </Suspense>
      </Box>
    </Profiler>
  );
}

export default SupportPage;
