import { render, screen } from '@testing-library/react';
import Statistics from '../components/Statistics';
import { useStore } from '@nanostores/react';

jest.mock('../stores/transactionStore', () => ({
  transactionsStore: {
    get: () => [],
  },
}));

jest.mock('../stores/budgetAlertStore', () => ({
  budgetAlertStore: {
    get: () => ({ alerts: [] }),
  },
}));

describe('Statistics Component', () => {
  const mockTransactions = [
    {
      type: 'expense',
      amount: 100,
      date: '2024-01-01T10:00:00',
      category: 'Food',
    },
    {
      type: 'expense',
      amount: 200,
      date: '2024-01-02T15:00:00',
      category: 'Transport',
    },
    {
      type: 'expense',
      amount: 150,
      date: '2024-01-01T18:00:00',
      category: 'Food',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockImplementation(() => []);
  });

  test('renders without crashing', () => {
    useStore.mockReturnValueOnce([]).mockReturnValueOnce({ alerts: [] });
    render(<Statistics />);
    expect(screen.getByText('Key Statistics')).toBeInTheDocument();
  });

  test('displays correct total expenses', () => {
    useStore
      .mockReturnValueOnce(mockTransactions)
      .mockReturnValueOnce({ alerts: [] });

    render(<Statistics />);
    expect(screen.getByText('Total Expenses: 450.00 €')).toBeInTheDocument();
  });
});
