import React from 'react';
import { render, screen } from '@testing-library/react';
import BalanceOverTime from '../components/BalanceOverTime';
import { mockTransactions } from '../__mocks__/stores';

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(),
}));

jest.mock('../stores/transactionStore', () => ({
  transactionsStore: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: ({ tickFormatter }) => (
    <div data-testid="x-axis">
      {tickFormatter && tickFormatter('2024-01-01T10:00:00')}
    </div>
  ),
  YAxis: ({ tickFormatter }) => (
    <div data-testid="y-axis">{tickFormatter && tickFormatter(1000)}</div>
  ),
  Tooltip: ({ content }) => <div data-testid="tooltip">{content}</div>,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe('BalanceOverTime Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('@nanostores/react').useStore.mockReturnValue([]);
  });

  test('should correctly calculate cumulative balance from transactions', () => {
    const { useStore } = require('@nanostores/react');
    useStore.mockReturnValue(mockTransactions);
    render(<BalanceOverTime />);
    const displayedData = mockTransactions
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .reduce((acc, transaction) => {
        const amount =
          transaction.type === 'income'
            ? transaction.amount
            : -transaction.amount;
        const previousBalance =
          acc.length > 0 ? acc[acc.length - 1].Balance : 0;
        const newBalance = previousBalance + amount;

        acc.push({
          date: transaction.date,
          Balance: newBalance,
        });
        return acc;
      }, []);

    expect(displayedData[0].Balance).toBe(1000);
    expect(displayedData[2].Balance).toBe(400);
  });

  test('should render chart with all necessary components', () => {
    const { useStore } = require('@nanostores/react');
    useStore.mockReturnValue([]);
    render(<BalanceOverTime />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('reference-line')).toBeInTheDocument();
  });

  test('should handle multiple transactions on the same date', () => {
    const { useStore } = require('@nanostores/react');
    const sameDataTransactions = [
      {
        date: '2024-01-01T10:00:00',
        amount: 1000,
        type: 'income',
        description: 'Salary',
      },
      {
        date: '2024-01-01T15:00:00',
        amount: 500,
        type: 'expense',
        description: 'Rent',
      },
    ];
    useStore.mockReturnValue(sameDataTransactions);
    render(<BalanceOverTime />);
    const processedData = sameDataTransactions
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .reduce((acc, transaction) => {
        const amount =
          transaction.type === 'income'
            ? transaction.amount
            : -transaction.amount;
        const previousBalance =
          acc.length > 0 ? acc[acc.length - 1].Balance : 0;
        const newBalance = previousBalance + amount;

        const existingEntry = acc.find(
          (entry) => entry.date === transaction.date
        );
        if (existingEntry) {
          existingEntry.Balance = newBalance;
          return acc;
        }

        acc.push({
          date: transaction.date,
          Balance: newBalance,
        });
        return acc;
      }, []);

    expect(processedData.length).toBe(2);
    expect(processedData[0].Balance).toBe(1000);
  });
});
