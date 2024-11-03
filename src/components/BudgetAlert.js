import React, { useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { userSettingsStore } from '../stores/userSettingsStore';
import { showNotification } from '../stores/notificationStore';

const BudgetAlert = () => {
  const userSettings = useStore(userSettingsStore);
  const transactions = useStore(transactionsStore);

  const { alerts } = useMemo(() => {
    const totalExp = transactions.reduce((total, transaction) => {
      return total + (transaction.amount > 0 ? transaction.amount : 0);
    }, 0);

    const catExpenses = transactions.reduce((acc, transaction) => {
      if (transaction.amount > 0 && transaction.category) {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    const alertsArray = [];

    if (totalExp > userSettings.totalBudgetLimit) {
      const percentageExceeded = (
        ((totalExp - userSettings.totalBudgetLimit) /
          userSettings.totalBudgetLimit) *
        100
      ).toFixed(1);

      alertsArray.push({
        id: 'total-budget',
        message:
          `Total Budget exceeded by ${percentageExceeded}%\n` +
          `Limit: €${userSettings.totalBudgetLimit.toFixed(2)} | ` +
          `Current: €${totalExp.toFixed(2)}`,
      });
    }

    Object.entries(userSettings.categoryLimits || {}).forEach(
      ([category, limit]) => {
        const categoryExpense = catExpenses[category] || 0;
        if (categoryExpense > limit) {
          const percentage = (
            ((categoryExpense - limit) / limit) *
            100
          ).toFixed(1);

          alertsArray.push({
            id: `category-${category}`,
            message:
              `${category} budget exceeded by ${percentage}%\n` +
              `Limit: €${limit.toFixed(2)} | Current: €${categoryExpense.toFixed(2)}`,
          });
        }
      }
    );

    return { alerts: alertsArray };
  }, [
    transactions,
    userSettings.categoryLimits,
    userSettings.totalBudgetLimit,
  ]);

  useEffect(() => {
    if (!userSettings.alertsEnabled || alerts.length === 0) {
      return;
    }

    alerts.forEach((alert) => {
      showNotification({
        message: alert.message,
        severity: 'warning',
        duration: 6000,
      });
    });
  }, [userSettings.alertsEnabled, alerts]);

  return null;
};

export default BudgetAlert;
