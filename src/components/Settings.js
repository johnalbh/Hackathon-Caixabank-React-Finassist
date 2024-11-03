import React from 'react';

import { useStore } from '@nanostores/react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { expenseCategories } from '../constants/categories';
import { showNotification } from '../stores/notificationStore';
import { transactionsStore } from '../stores/transactionStore';
import { updateBudgetAlert } from '../stores/budgetAlertStore';
import { userSettingsStore } from '../stores/userSettingsStore';
import { generateRandomBudgetSettings } from '../utils/demoSettingsGenerator';

const Settings = () => {
  const userSettings = useStore(userSettingsStore);
  const transactions = useStore(transactionsStore);

  const handleLoadDemoBudget = () => {
    const randomBudget = generateRandomBudgetSettings();
    userSettingsStore.set(randomBudget);
    showNotification({
      message: 'Demo budget settings loaded successfully!',
      severity: 'info',
    });
  };

  const totalExpense = transactions.reduce((total, transaction) => {
    return total + (transaction.amount > 0 ? transaction.amount : 0);
  }, 0);

  const handleAlertsToggle = (event) => {
    userSettingsStore.set({
      ...userSettings,
      alertsEnabled: event.target.checked,
    });

    if (!event.target.checked) {
      checkAndUpdateBudgetStatus(totalExpense, userSettings.totalBudgetLimit);
    }
  };

  const handleTotalBudgetChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    userSettingsStore.set({
      ...userSettings,
      totalBudgetLimit: value,
    });
    checkAndUpdateBudgetStatus(totalExpense, value);
  };

  const handleCategoryLimitChange = (category) => (event) => {
    const value = parseFloat(event.target.value) || 0;
    userSettingsStore.set({
      ...userSettings,
      categoryLimits: {
        ...userSettings.categoryLimits,
        [category]: value,
      },
    });
  };

  const checkAndUpdateBudgetStatus = (expenses, limit) => {
    const isExceeded = expenses > limit;

    userSettingsStore.set({
      ...userSettings,
      budgetExceeded: isExceeded,
    });

    if (isExceeded && userSettings.alertsEnabled) {
      const percentageExceeded = (((expenses - limit) / limit) * 100).toFixed(
        1
      );
      const warningMessage = `Warning! You have exceeded your budget by ${percentageExceeded}%. 
        Budget Limit: €${limit.toFixed(2)}, 
        Current Expenses: €${expenses.toFixed(2)}`;
      updateBudgetAlert(warningMessage);
      showNotification({
        message: warningMessage,
        severity: 'warning',
      });
    }
  };

  const handleSave = () => {
    const totalCategoryLimits = Object.values(
      userSettings.categoryLimits
    ).reduce((sum, limit) => sum + (limit || 0), 0);

    if (totalCategoryLimits > userSettings.totalBudgetLimit) {
      showNotification({
        message: `Total category limits (€${totalCategoryLimits.toFixed(2)}) cannot exceed total budget limit (€${userSettings.totalBudgetLimit.toFixed(2)})`,
        severity: 'error',
      });
      return;
    }

    showNotification({
      message: 'Settings saved successfully!',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" color="primary" data-tour="settings-header">
          Settings
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLoadDemoBudget}
            startIcon={<PlayCircleOutlineIcon />}
          >
            Load Demo Budget
          </Button>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={userSettings.alertsEnabled}
            onChange={handleAlertsToggle}
            color="primary"
          />
        }
        label="Enable Alerts"
      />

      <Paper sx={{ padding: 2, mt: 2, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Total Budget Limit (€)
        </Typography>
        <TextField
          type="number"
          name="totalBudgetLimit"
          value={userSettings.totalBudgetLimit}
          onChange={handleTotalBudgetChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, step: '0.01' }}
          sx={{ mt: 1 }}
        />
      </Paper>

      <Paper sx={{ padding: 2, mt: 2, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Category Budget Limits (€)
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {expenseCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <TextField
                label={category}
                type="number"
                value={userSettings.categoryLimits[category] || ''}
                onChange={handleCategoryLimitChange(category)}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
          sx={{ boxShadow: 2 }}
        >
          Save Settings
        </Button>
      </Box>

      {userSettings.budgetExceeded && userSettings.alertsEnabled && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Budget limit exceeded! Please review your expenses.
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
