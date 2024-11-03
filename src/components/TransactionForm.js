import React, { useEffect, useState } from 'react';

import { useStore } from '@nanostores/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { allCategories } from '../constants/categories';
import { transactionsStore } from '../stores/transactionStore';
import { categoryKeywords } from '../constants/categoryKeywords';

function TransactionForm({ transactionToEdit, onClose, showNotification }) {
  const transactions = useStore(transactionsStore);
  const [description, setDescription] = useState(
    transactionToEdit?.description || ''
  );
  const [amount, setAmount] = useState(transactionToEdit?.amount || '');
  const [type, setType] = useState(transactionToEdit?.type || 'expense');
  const [category, setCategory] = useState(transactionToEdit?.category || '');
  const [date, setDate] = useState(
    transactionToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState({});
  const assignCategory = (desc) => {
    const lowerDesc = desc.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (
        keywords.some((keyword) => lowerDesc.includes(keyword.toLowerCase()))
      ) {
        return category;
      }
    }
    return 'Other Expenses';
  };

  useEffect(() => {
    if (!transactionToEdit && description) {
      const suggestedCategory = assignCategory(description);
      setCategory(suggestedCategory);
    }
  }, [description, transactionToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount || amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!category) newErrors.category = 'Category is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const transactionData = {
      id: transactionToEdit?.id || Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    };

    if (transactionToEdit) {
      transactionsStore.set(
        transactions.map((t) =>
          t.id === transactionToEdit.id ? transactionData : t
        )
      );
      showNotification({
        message: 'Transaction updated successfully!',
        severity: 'info',
      });
    } else {
      transactionsStore.set([...transactions, transactionData]);
      showNotification({
        message: 'Transaction added successfully!',
        severity: 'success',
      });
    }
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                required
                name="description"
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (€)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0, step: '0.01' }}
                name="amount"
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                  name="type"
                  inputProps={{ name: 'filterTypeForm' }}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                required
                error={!!errors.category}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  name="category"
                >
                  {allCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
                required
                name="date"
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              px: 3,
              pb: 2,
              position: 'relative',
            }}
          >
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              data-testid="add-transaction-button"
            >
              <AddIcon />
              {transactionToEdit ? 'Update' : 'Add'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransactionForm;
