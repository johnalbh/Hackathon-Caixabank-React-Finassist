import React, { useEffect, useState } from 'react';

import { useStore } from '@nanostores/react';
import {
  Alert,
  Box,
  CircularProgress,
  Fade,
  Paper,
  Typography,
} from '@mui/material';

import { transactionsStore } from '../stores/transactionStore';
import { TIME_SIMULATE_LOADING } from '../constants/generalConstants';

function Recommendations() {
  const transactions = useStore(transactionsStore);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState({
    currentMonth: { total: 0, expenses: [] },
    lastMonth: { total: 0, expenses: [] },
  });

  const calculateMonthlyExpenses = (transactions, monthsAgo = 0) => {
    const today = new Date();
    const targetMonth = new Date(
      today.getFullYear(),
      today.getMonth() - monthsAgo,
      1
    );

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === targetMonth.getMonth() &&
          transactionDate.getFullYear() === targetMonth.getFullYear() &&
          transaction.type === 'expense'
        );
      })
      .reduce(
        (acc, curr) => ({
          total: acc.total + curr.amount,
          expenses: [...acc.expenses, curr],
        }),
        { total: 0, expenses: [] }
      );
  };

  const generateMessage = (currentTotal, lastTotal) => {
    if (lastTotal === 0) {
      return {
        text: 'Start recording your expenses to receive personalized recommendations.',
        severity: 'info',
      };
    }

    const difference = currentTotal - lastTotal;
    const percentageChange = ((difference / lastTotal) * 100).toFixed(1);

    if (difference > 0) {
      return {
        text: `Your expenses have increased by ${percentageChange}% compared to last month. Consider reviewing your main spending categories to identify areas for improvement.`,
        severity: 'warning',
      };
    } else if (difference < 0) {
      return {
        text: `Congratulations! You've reduced your expenses by ${Math.abs(percentageChange)}% compared to last month. Keep up the great work!`,
        severity: 'success',
      };
    } else {
      return {
        text: 'Your expenses have remained stable compared to last month.',
        severity: 'info',
      };
    }
  };

  useEffect(() => {
    const analyzeTransactions = async () => {
      setLoading(true);
      try {
        if (!transactions || transactions.length === 0) {
          throw new Error('No transactions available');
        }

        const currentMonthData = calculateMonthlyExpenses(transactions, 0);
        const lastMonthData = calculateMonthlyExpenses(transactions, 1);

        setAnalysisData({
          currentMonth: currentMonthData,
          lastMonth: lastMonthData,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, TIME_SIMULATE_LOADING.LOADING_DELAY);
      }
    };

    analyzeTransactions();
  }, [transactions]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Fade in>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Fade>
    );
  }

  const message = generateMessage(
    analysisData.currentMonth.total,
    analysisData.lastMonth.total
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Alert severity={message.severity} sx={{ mt: 2 }}>
        {message.text}
      </Alert>

      {analysisData.currentMonth.expenses.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Month Summary:
          </Typography>
          <Typography variant="body1">
            Total expenses: ${analysisData.currentMonth.total.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Number of transactions: {analysisData.currentMonth.expenses.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Recommendations;
