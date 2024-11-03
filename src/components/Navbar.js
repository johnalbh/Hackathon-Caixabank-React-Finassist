import React, { useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useStore } from '@nanostores/react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Analytics as AnalysisIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
  AttachMoney as TransactionsIcon,
} from '@mui/icons-material';

import { authStore, logout } from '../stores/authStore';
import logoImage from '../assets/caixabank-icon-blue.png';
import { NotificationSection } from './NotificationComponents';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const auth = useStore(authStore);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const navItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Transactions', path: '/transactions', icon: <TransactionsIcon /> },
    { text: 'Analysis', path: '/analysis', icon: <AnalysisIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { text: 'Support', path: '/support', icon: <SupportIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box
          component="img"
          src={logoImage}
          alt="CaixaBankNow"
          sx={{ height: 24, mr: 1 }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CaixaBankNow
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      {auth.isAuthenticated && (
        <>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.grey[500],
                margin: '0 auto',
              }}
            >
              {auth.user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {auth.user?.email}
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {isMobile && auth.isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src={logoImage}
            alt="CaixaBankNow"
            sx={{ height: 24, mr: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            CaixaBankNow
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {auth.isAuthenticated && !isMobile && (
            <>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  disableRipple
                >
                  {item.text}
                </Button>
              ))}
            </>
          )}

          {auth.isAuthenticated && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <NotificationSection />
              {!isMobile && (
                <Button
                  onClick={handleLogout}
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 400,
                  }}
                >
                  Logout
                </Button>
              )}
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.grey[500],
                  ml: 1,
                }}
              >
                {auth.user?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </>
          )}

          {!auth.isAuthenticated && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/register"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
