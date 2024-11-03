import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

function TransactionRow({ transaction, onEdit, onDelete }) {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
  });

  const handleDeleteClick = () => {
    setDeleteDialog({ open: true });
  };

  const handleConfirmDelete = () => {
    onDelete(transaction);
    setDeleteDialog({ open: false });
  };

  const amountStyle =
    transaction.type === 'income'
      ? {
          fontWeight: 'bold',
          color: 'green',
        }
      : {
          fontWeight: 'bold',
        };

  const getFormattedAmount = () => {
    const sign = transaction.type === 'income' ? '+' : '-';
    const amount = transaction.amount.toFixed(2);
    return `${sign}${amount}€`;
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{transaction.description}</TableCell>
        <TableCell>
          <Typography sx={amountStyle}>{getFormattedAmount()}</Typography>
        </TableCell>
        <TableCell>
          {transaction.type === 'income' ? 'Income' : 'Expense'}
        </TableCell>
        <TableCell>{transaction.category}</TableCell>
        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button
            onClick={() => onEdit(transaction)}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button onClick={handleDeleteClick} color="error" size="small">
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the transaction
            <Typography component="span" fontWeight="bold" color="error">
              {` "${transaction.description}"`}
            </Typography>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransactionRow;
