import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const EmptyTransactions = ({
  variant = 'default', // 'default' | 'dashboard' | 'analysis'
  onLoadDemo,
  showDemoButton = true,
  containerProps,
  customMessage,
}) => {
  const navigate = useNavigate();

  const getContent = () => {
    switch (variant) {
      case 'dashboard':
        return {
          title: 'No Transactions Found',
          description:
            'Start tracking your finances by adding your first transaction in the transactions module. Your dashboard will become more informative as you add transactions.',
        };
      case 'analysis':
        return {
          title: 'No Transactions Available',
          description:
            'Start tracking your finances by adding your first transaction in the transactions module.',
        };
      default:
        return {
          title: 'No Transactions Available',
          description:
            'Get started by adding your first transaction or load demo data to explore the features. Track your income and expenses to better manage your finances.',
        };
    }
  };

  const content = customMessage || getContent();

  const renderActions = () => {
    if (variant === 'analysis') {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/transactions')}
          sx={{ mt: 2 }}
        >
          Add Your First Transaction
        </Button>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          color="inherit"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate('/transactions')}
        >
          Add Transaction
        </Button>
        {showDemoButton && onLoadDemo && (
          <Button
            color="inherit"
            size="small"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={onLoadDemo}
          >
            Load Demo Data
          </Button>
        )}
      </Box>
    );
  };

  if (variant === 'analysis') {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          ...containerProps?.sx,
        }}
        {...containerProps}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {content.description}
        </Typography>
        {renderActions()}
      </Box>
    );
  }

  return (
    <Alert
      severity="info"
      action={renderActions()}
      sx={{
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        '& .MuiAlert-message': {
          flex: 1,
        },
        '& .MuiAlert-action': {
          alignItems: 'center',
        },
        ...containerProps?.sx,
      }}
      {...containerProps}
    >
      <Box>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: 'medium' }}
        >
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.description}
        </Typography>
      </Box>
    </Alert>
  );
};

export default EmptyTransactions;
