import React, { Profiler, Suspense, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { useStore } from '@nanostores/react';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';

import ExportButton from './ExportButton';
import BalanceWidget from './BalanceWidget';
import { authStore } from '../stores/authStore';
import { formatCurrency } from '../utils/utils';
import EmptyTransactions from './EmptyTransactions';
import DownloadProfilerData from './DownloadProfilerData';
import { onRenderCallback } from '../utils/onRenderCallback';
import { transactionsStore } from '../stores/transactionStore';
import {
  dashboardLayoutActions,
  dashboardLayoutStore,
} from '../stores/dashboardStore';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import 'shepherd.js/dist/css/shepherd.css';

const AnalysisGraph = React.lazy(() => import('./AnalysisGraph'));
const BalanceOverTime = React.lazy(() => import('./BalanceOverTime'));
const Statistics = React.lazy(() => import('./Statistics'));
const Recommendations = React.lazy(() => import('./Recommendations'));
const RecentTransactions = React.lazy(() => import('./RecentTransactions'));

const ResponsiveGridLayout = WidthProvider(Responsive);

const Widget = ({ children, title }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: (theme) => theme.shadows[6],
      },
    }}
  >
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        fontWeight: 600,
        color: 'primary.main',
        mb: 2,
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  </Paper>
);

function Dashboard() {
  const transactions = useStore(transactionsStore);
  const { user } = useStore(authStore);
  const layout = useStore(dashboardLayoutStore);
  const navigate = useNavigate();
  const [hasSeenTour, setHasSeenTour] = useState(
    localStorage.getItem('dashboardTourSeen') === 'true'
  );

  useEffect(() => {
    if (user?.email) {
      dashboardLayoutActions.loadLayout(user.email);
    }
  }, [user?.email]);

  const totalIncome = transactions.reduce(
    (sum, transaction) =>
      transaction.type === 'income' ? sum + transaction.amount : sum,
    0
  );

  const totalExpense = transactions.reduce(
    (sum, transaction) =>
      transaction.type === 'expense' ? sum + transaction.amount : sum,
    0
  );

  const balance = totalIncome - totalExpense;
  const BUDGET_LIMIT = 5000;
  const isOverBudget = totalExpense > BUDGET_LIMIT;

  const LoadingFallback = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <CircularProgress />
    </Box>
  );

  const handleResetLayout = () => {
    if (user?.email) {
      dashboardLayoutActions.resetLayout(user.email);
    }
  };

  const handleLayoutChange = (newLayout) => {
    if (user?.email) {
      dashboardLayoutActions.saveLayout(user.email, { lg: newLayout });
    }
  };

  const startTour = () => {
    if (window.startTour) {
      window.startTour();
      setHasSeenTour(true);
      localStorage.setItem('dashboardTourSeen', 'true');
    }
  };

  const TourButton = () => (
    <Button
      variant="outlined"
      startIcon={<HelpOutlineIcon />}
      onClick={startTour}
    >
      Start Tour
    </Button>
  );

  const renderWidget = (widgetId) => {
    const widgets = {
      income: (
        <Widget title="Total Income">
          <Typography
            variant="h4"
            data-testid="total-income"
            color="success.main"
            sx={{ textAlign: 'center' }}
          >
            {formatCurrency(totalIncome)}
          </Typography>
        </Widget>
      ),
      expenses: (
        <Widget title="Total Expenses">
          <Typography
            variant="h4"
            data-testid="total-expenses"
            color="error.main"
            sx={{ textAlign: 'center' }}
          >
            {formatCurrency(totalExpense)}
          </Typography>
        </Widget>
      ),
      balance: (
        <Widget title="Balance">
          <BalanceWidget
            balance={balance}
            isOverBudget={isOverBudget}
            BUDGET_LIMIT={BUDGET_LIMIT}
            formatCurrency={formatCurrency}
          />
        </Widget>
      ),
      statistics: (
        <Suspense fallback={<LoadingFallback />}>
          <Widget title="Statistics">
            <Statistics transactions={transactions} />
          </Widget>
        </Suspense>
      ),
      recommendations: (
        <Suspense fallback={<LoadingFallback />}>
          <Widget title="Recommendations">
            <Recommendations
              balance={balance}
              expenses={totalExpense}
              income={totalIncome}
            />
          </Widget>
        </Suspense>
      ),
      analysisGraph: (
        <Suspense fallback={<LoadingFallback />}>
          <Widget title="Income vs Expenses by Category">
            <AnalysisGraph transactions={transactions} />
          </Widget>
        </Suspense>
      ),
      balanceOverTime: (
        <Suspense fallback={<LoadingFallback />}>
          <Widget title="Balance Over Time">
            <BalanceOverTime transactions={transactions} />
          </Widget>
        </Suspense>
      ),
      recentTransactions: (
        <Suspense fallback={<LoadingFallback />}>
          <Widget title="Recent Transactions">
            <RecentTransactions transactions={transactions} />
          </Widget>
        </Suspense>
      ),
    };

    return widgets[widgetId];
  };

  if (!layout) {
    return <LoadingFallback />;
  }

  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <Box sx={{ p: 4 }}>
        {transactions.length === 0 && (
          <EmptyTransactions variant="dashboard" showDemoButton={false} />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            data-tour="dashboard-header"
          >
            Dashboard
            <Typography variant="caption" sx={{ ml: 2 }}>
              (Drag widgets to customize layout)
            </Typography>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetLayout}
              data-tour="reset-layout"
            >
              Reset Layout
            </Button>
            <TourButton />
          </Box>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <ExportButton data={transactions} filename="transactions.csv" />
          <DownloadProfilerData />
        </Box>

        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={50}
          onLayoutChange={(layout) => handleLayoutChange(layout)}
          isDraggable
          isResizable
          margin={[16, 16]}
          containerPadding={[0, 0]}
          resizeHandles={['se']}
          data-tour="dashboard-widgets"
        >
          {layout.lg.map((item) => (
            <div key={item.i} data-grid={item}>
              {renderWidget(item.i)}
            </div>
          ))}
        </ResponsiveGridLayout>
      </Box>
    </Profiler>
  );
}

export default Dashboard;
