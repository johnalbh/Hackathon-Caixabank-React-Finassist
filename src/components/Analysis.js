import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '@nanostores/react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ExportButton from './ExportButton';
import { transactionsStore } from '../stores/transactionStore';
import { userSettingsStore } from '../stores/userSettingsStore';
import EmptyTransactions from './EmptyTransactions';

function Analysis() {
  const transactions = useStore(transactionsStore);
  const userSettings = useStore(userSettingsStore);
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [reportType, setReportType] = useState('trend');
  const navigate = useNavigate();

  const groupTransactionsByDate = (transactions, timeFrame) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      let key;

      switch (timeFrame) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekNumber = Math.ceil((date.getDate() + date.getDay()) / 7);
          key = `Week ${weekNumber}, ${date.getFullYear()}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
        case 'monthly':
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        acc[key].income += transaction.amount;
      } else {
        acc[key].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.entries(grouped).map(([key, values]) => ({
      key,
      ...values,
    }));
  };

  const trendData = useMemo(() => {
    return groupTransactionsByDate(transactions, timeFrame);
  }, [transactions, timeFrame]);

  const budgetData = useMemo(() => {
    const categories = Object.keys(userSettings.categoryLimits);

    return categories.map((category) => {
      const actualExpenses = transactions
        .filter((t) => t.category === category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category,
        budget: userSettings.categoryLimits[category] || 0,
        actual: actualExpenses,
      };
    });
  }, [transactions, userSettings.categoryLimits]);

  const getExportData = () => {
    if (reportType === 'trend') {
      return trendData.map((item) => ({
        Period: item.key,
        Income: item.income,
        Expenses: item.expense,
        Balance: item.income - item.expense,
      }));
    }
    return budgetData.map((item) => ({
      Category: item.category,
      Budget: item.budget,
      Actual: item.actual,
      Variance: item.budget - item.actual,
    }));
  };

  const exportHeaders =
    reportType === 'trend'
      ? ['Period', 'Income', 'Expenses', 'Balance']
      : ['Category', 'Budget', 'Actual', 'Variance'];

  const totalBudget = userSettings.totalBudgetLimit;
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const budgetUtilization = (totalExpenses / totalBudget) * 100;

  const EmptyState = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
      }}
    >
      <EmptyTransactions variant="analysis" />
    </Box>
  );

  return (
    <Box sx={{ mt: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Advanced Analysis
      </Typography>

      {transactions.length === 0 ? (
        <Paper sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
          <EmptyState />
        </Paper>
      ) : (
        <>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="timeframe-select-label">Time Frame</InputLabel>
                <Select
                  labelId="timeframe-select-label"
                  id="timeframe-select"
                  value={timeFrame}
                  label="Time Frame"
                  onChange={(e) => setTimeFrame(e.target.value)}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="report-type-select-label">
                  Report Type
                </InputLabel>
                <Select
                  labelId="report-type-select-label"
                  id="report-type-select"
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="trend">Trend Analysis</MenuItem>
                  <MenuItem value="budget">Budget vs. Actual</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ExportButton
                data={getExportData()}
                filename={`financial-report-${reportType}-${timeFrame}`}
                headers={exportHeaders}
              />
            </Grid>
          </Grid>

          {reportType === 'trend' && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Income and Expenses Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={trendData}>
                      <XAxis dataKey="key" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#28B463"
                        name="Income"
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#E74C3C"
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {reportType === 'budget' && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Budget vs. Actual Expenses
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Total Budget Utilization: {budgetUtilization.toFixed(1)}%
                    {budgetUtilization > 100 && userSettings.alertsEnabled && (
                      <span style={{ color: '#E74C3C' }}> (Over Budget)</span>
                    )}
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={budgetData}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="budget" fill="#3498DB" name="Budget" />
                      <Bar dataKey="actual" fill="#E74C3C" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Budget Overview
                </Typography>
                <Typography>Total Budget: ${totalBudget.toFixed(2)}</Typography>
                <Typography>
                  Total Expenses: ${totalExpenses.toFixed(2)}
                </Typography>
                <Typography>
                  Remaining Budget: ${(totalBudget - totalExpenses).toFixed(2)}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Net Worth Over Time
                </Typography>
                <Typography>
                  Current Net Worth: $
                  {transactions
                    .reduce(
                      (acc, curr) =>
                        acc +
                        (curr.type === 'income' ? curr.amount : -curr.amount),
                      0
                    )
                    .toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default Analysis;
