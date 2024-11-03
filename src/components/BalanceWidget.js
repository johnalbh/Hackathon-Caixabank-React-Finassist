import React from 'react';

import { Badge, Box, IconButton, Typography } from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { showNotification } from '../stores/notificationStore';

const AlertIndicator = ({ severity, count }) => {
  const Icon = severity === 'error' ? ErrorIcon : WarningIcon;

  return (
    <Badge
      badgeContent={count}
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          right: -3,
          top: 3,
        },
      }}
    >
      <Icon
        sx={{
          color: severity === 'error' ? 'error.main' : 'warning.main',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
        }}
      />
    </Badge>
  );
};

const BalanceWidget = ({
  balance,
  isOverBudget,
  BUDGET_LIMIT,
  formatCurrency,
}) => {
  const alerts = [
    ...(balance < 0
      ? [
          {
            severity: 'warning',
            title: 'Negative Balance',
            message: 'Your balance is negative. Consider reducing expenses.',
          },
        ]
      : []),
    ...(isOverBudget
      ? [
          {
            severity: 'error',
            title: 'Budget Limit Exceeded',
            message: `You have exceeded your monthly budget limit of ${formatCurrency(BUDGET_LIMIT)}`,
          },
        ]
      : []),
  ];

  const alertCount = alerts.length;

  const handleShowAlerts = (e) => {
    e.stopPropagation();
    e.preventDefault();
    alerts.forEach((alert) => {
      showNotification({
        message: `${alert.title}: ${alert.message}`,
        severity: alert.severity,
        duration: 6000,
      });
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        data-testid="balance"
        color={balance >= 0 ? 'success.main' : 'error.main'}
        sx={{ textAlign: 'center' }}
      >
        {formatCurrency(balance)}
      </Typography>

      {alertCount > 0 && (
        <Box
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{ cursor: 'pointer' }}
        >
          <IconButton
            onClick={handleShowAlerts}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <AlertIndicator severity={alerts[0].severity} count={alertCount} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default BalanceWidget;
