import { atom } from 'nanostores';

export const userSettingsStore = atom({
    totalBudgetLimit: 1000,
    categoryLimits: {},
    alertsEnabled: true,
    budgetExceeded: false,
});

if (process.env.NODE_ENV === 'development') {
    window.userSettingsStore = userSettingsStore;
}
