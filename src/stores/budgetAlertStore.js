import { atom } from 'nanostores';

export const budgetAlertStore = atom({
  isVisible: false,
  alerts: [],
  notificationCount: 0,
});

export const updateBudgetAlert = (alerts) => {
  budgetAlertStore.set({
    isVisible: true,
    alerts: Array.isArray(alerts) ? alerts : [alerts],
    notificationCount: budgetAlertStore.get().notificationCount + 1,
  });
};

export const resetBudgetAlert = () => {
  budgetAlertStore.set({
    isVisible: false,
    alerts: [],
    notificationCount: 0,
  });
};

export const getBudgetAlertState = () => budgetAlertStore.get();
