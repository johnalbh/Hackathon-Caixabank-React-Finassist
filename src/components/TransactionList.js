import React, { useCallback, useMemo, useState } from 'react';

import { useStore } from '@nanostores/react';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import TransactionRow from './TransactionRow';
import TransactionForm from './TransactionForm';
import EmptyTransactions from './EmptyTransactions';
import { showNotification } from '../stores/notificationStore';
import { transactionsStore } from '../stores/transactionStore';
import { generateRandomTransactions } from '../utils/demoTransactionsGenerator';

function TransactionList() {
  const transactions = useStore(transactionsStore);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editTransaction, setEditTransaction] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLoadDemoData = () => {
    const randomTransactions = generateRandomTransactions(15);
    transactionsStore.set(randomTransactions);
    showNotification({
      message: 'Random demo transactions loaded successfully!',
      severity: 'info',
    });
  };

  const handleAddMoreRandomData = () => {
    const additionalTransactions = generateRandomTransactions(5);
    transactionsStore.set([...transactions, ...additionalTransactions]);
    showNotification({
      message: 'Added 5 more random transactions!',
      severity: 'success',
    });
  };

  const handleDeleteClick = useCallback(
    (transaction) => {
      transactionsStore.set(
        transactions.filter((t) => t.id !== transaction.id)
      );
      showNotification({
        message: `Transaction "${transaction.description}" deleted successfully!`,
        severity: 'success',
      });
    },
    [transactions]
  );

  const handleEditClick = useCallback((transaction) => {
    setEditTransaction(transaction);
  }, []);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filterCategory) {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }
    if (filterType) {
      filtered = filtered.filter((t) => t.type === filterType);
    }
    if (sortField) {
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'amount':
            const amountA = parseFloat(a.amount);
            const amountB = parseFloat(b.amount);
            comparison = amountB - amountA;
            break;

          case 'date':
            comparison = new Date(b.date) - new Date(a.date);
            break;

          default:
            return 0;
        }
        return sortDirection === 'asc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [transactions, filterCategory, filterType, sortField, sortDirection]);

  const uniqueCategories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const EmptyStateMessage = () => (
    <EmptyTransactions onLoadDemo={handleLoadDemoData} />
  );

  const ActionButtons = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAddForm(true)}
        data-tour="add-transaction"
      >
        Add Transaction
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleLoadDemoData}
        startIcon={<PlayCircleOutlineIcon />}
      >
        Load Random Demo Data
      </Button>

      <Tooltip title="Add 5 more random transactions">
        <IconButton
          color="secondary"
          onClick={handleAddMoreRandomData}
          sx={{ ml: 1 }}
        >
          <ShuffleIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const FilterControls = () => (
    <Box sx={{ display: 'flex', gap: 2, my: 2 }} data-tour="filter-controls">
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="filter-category-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {uniqueCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="filter-type-label">Type</InputLabel>
        <Select
          labelId="filter-type-label"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          label="Type"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="sort-field-label">Sort By</InputLabel>
        <Select
          labelId="sort-field-label"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>

      {sortField && (
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-direction-label">Order</InputLabel>
          <Select
            labelId="sort-direction-label"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            label="Order"
          >
            <MenuItem value="desc">
              {sortField === 'amount'
                ? 'Highest to Lowest (DESC)'
                : 'Newest to Oldest (DESC)'}
            </MenuItem>
            <MenuItem value="asc">
              {sortField === 'amount'
                ? 'Lowest to Highest (ASC)'
                : 'Oldest to Newest (ASC)'}
            </MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>
      {transactions.length === 0 && <EmptyStateMessage />}
      <Typography
        variant="h4"
        gutterBottom
        color="primary"
        data-tour="transactions-header"
      >
        Transaction List
      </Typography>

      <ActionButtons />
      <FilterControls />

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount (€)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    {transactions.length === 0
                      ? 'No transactions available. Add your first transaction to get started.'
                      : 'No transactions found with the current filters.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {(showAddForm || editTransaction) && (
        <TransactionForm
          transactionToEdit={editTransaction}
          onClose={() => {
            setShowAddForm(false);
            setEditTransaction(null);
          }}
          showNotification={showNotification}
        />
      )}
    </Box>
  );
}

export default TransactionList;
