import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentTransactions from '../components/RecentTransactions';
import { TRANSACTIONS_CONFIG } from '../constants/generalConstants';

jest.mock('@mui/material', () => ({
  Paper: ({ children }) => <div data-testid="paper">{children}</div>,
  Table: ({ children }) => <table data-testid="table">{children}</table>,
  TableBody: ({ children }) => (
    <tbody data-testid="table-body">{children}</tbody>
  ),
  TableCell: ({ children }) => <td data-testid="table-cell">{children}</td>,
  TableContainer: ({ children }) => (
    <div data-testid="table-container">{children}</div>
  ),
  TableHead: ({ children }) => (
    <thead data-testid="table-head">{children}</thead>
  ),
  TableRow: ({ children }) => <tr data-testid="table-row">{children}</tr>,
}));

describe('RecentTransactions Component', () => {
  const mockTransactions = [
    {
      id: 1,
      description: 'Salary',
      amount: 2000.5,
      type: 'income',
      category: 'Work',
      date: '2024-01-01T10:00:00',
    },
    {
      id: 2,
      description: 'Rent',
      amount: 800.0,
      type: 'expense',
      category: 'Housing',
      date: '2024-01-02T15:00:00',
    },
    {
      id: 3,
      description: 'Groceries',
      amount: 150.75,
      type: 'expense',
      category: 'Food',
      date: '2024-01-03T16:00:00',
    },
  ];

  test('should render recent transactions in correct order', () => {
    // Arrange
    const sortedTransactions = [...mockTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Act
    render(<RecentTransactions transactions={mockTransactions} />);

    // Assert
    const descriptionCells = screen.getAllByTestId('table-cell');
    expect(descriptionCells[5].textContent).toBe('Groceries');
    expect(descriptionCells[10].textContent).toBe('Rent');
    expect(descriptionCells[15].textContent).toBe('Salary');
  });

  test('should limit the number of transactions displayed', () => {
    const manyTransactions = [
      ...mockTransactions,
      {
        id: 4,
        description: 'Extra Transaction',
        amount: 50.0,
        type: 'expense',
        category: 'Other',
        date: '2024-01-04T17:00:00',
      },
      {
        id: 5,
        description: 'Another Transaction',
        amount: 75.0,
        type: 'expense',
        category: 'Other',
        date: '2024-01-05T18:00:00',
      },
    ];

    render(<RecentTransactions transactions={manyTransactions} />);

    const rows = screen.getAllByTestId('table-row');
    expect(rows.length).toBe(
      TRANSACTIONS_CONFIG.NUMBER_OF_RECENT_TRANSACTIONS + 1
    );
  });

  test('should format amounts and dates correctly', () => {
    render(<RecentTransactions transactions={mockTransactions} />);

    const cells = screen.getAllByTestId('table-cell');

    expect(cells[6].textContent).toBe('€150.75');

    const expectedDate = new Date('2024-01-03T16:00:00').toLocaleDateString();
    expect(cells[9].textContent).toBe(expectedDate);
  });
});
