export const mockTransactions = [
  {
    date: '2024-01-01T10:00:00',
    amount: 1000,
    type: 'income',
    description: 'Salary',
  },
  {
    date: '2024-01-02T15:00:00',
    amount: 500,
    type: 'expense',
    description: 'Rent',
  },
  {
    date: '2024-01-02T16:00:00',
    amount: 100,
    type: 'expense',
    description: 'Groceries',
  },
];

export const mockUserSettings = {
  totalBudgetLimit: 1000,
  categoryLimits: {
    Food: 200,
    Transport: 150,
  },
  alertsEnabled: true,
  budgetExceeded: false,
};

export const userSettingsStore = {
  get: jest.fn(() => mockUserSettings),
  set: jest.fn(),
};

export const transactionsStore = {
  get: jest.fn(() => mockTransactions),
  set: jest.fn(),
};
