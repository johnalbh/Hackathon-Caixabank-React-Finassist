import React, { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { budgetAlertStore } from '../stores/budgetAlertStore';
import { Paper, Typography, Box, Divider } from '@mui/material';

function Statistics() {
  const transactions = useStore(transactionsStore);
  const budgetAlert = useStore(budgetAlertStore);

  const {
    expenses,
    totalExpense,
    uniqueDates,
    averageDailyExpense,
    categoryExpenses,
    maxCategory,
  } = useMemo(() => {
    const expenses = transactions.filter(
      (transaction) => transaction.type === 'expense'
    );

    const totalExpense = expenses.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const uniqueDates = [
      ...new Set(expenses.map((transaction) => transaction.date.split('T')[0])),
    ];
    const averageDailyExpense =
      uniqueDates.length > 0 ? totalExpense / uniqueDates.length : 0;

    const categoryExpenses = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});
    let maxCategory = null;
    let maxAmount = 0;

    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    });

    return {
      expenses,
      totalExpense,
      uniqueDates,
      averageDailyExpense,
      categoryExpenses,
      maxCategory,
    };
  }, [transactions]);

  const hasActiveAlerts = budgetAlert.alerts.length > 0;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Key Statistics
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Total Expenses: {totalExpense.toFixed(2)} €
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Number of Expense Transactions: {expenses.length}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Days with Expenses: {uniqueDates.length}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Average Daily Expense: {averageDailyExpense.toFixed(2)} €
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Category Analysis
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Highest Spending Category:{' '}
          {maxCategory
            ? `${maxCategory} (${categoryExpenses[maxCategory].toFixed(2)} €)`
            : 'No data available'}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Expenses by Category:
        </Typography>

        {Object.entries(categoryExpenses)
          .sort(([, a], [, b]) => b - a)
          .map(([category, amount]) => (
            <Typography key={category} variant="body2" sx={{ ml: 2 }}>
              {category}: {amount.toFixed(2)} €
            </Typography>
          ))}
      </Box>

      {hasActiveAlerts && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Budget Alerts
          </Typography>
          {budgetAlert.alerts.map((alert, index) => (
            <Typography
              key={index}
              variant="body2"
              color="error"
              sx={{ mb: 1 }}
            >
              {alert}
            </Typography>
          ))}
        </>
      )}
    </>
  );
}

export default Statistics;
