import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

function BalanceOverTime() {
  const transactions = useStore(transactionsStore);

  const data = transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, transaction) => {
      const amount =
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;
      const previousBalance = acc.length > 0 ? acc[acc.length - 1].Balance : 0;
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
        details: `${transaction.description}: ${Math.abs(amount).toFixed(2)}€ (${transaction.type})`,
      });
      return acc;
    }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dateTransactions = transactions.filter((t) => t.date === label);
      const formattedDate = new Date(label).toLocaleDateString();

      return (
        <div className="p-4 bg-white border rounded shadow">
          <p className="font-medium mb-2">{formattedDate}</p>
          <p className="text-purple-600 font-medium">
            Balance: {payload[0].value.toFixed(2)}€
          </p>
          <div className="mt-2 text-sm">
            {dateTransactions.map((t, i) => (
              <p
                key={i}
                className={
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }
              >
                {t.description}: {t.amount.toFixed(2)}€
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    return `${value.toFixed(0)}€`;
  };

  const formatXAxis = (value) => {
    return new Date(value).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
    });
  };

  const minBalance = Math.min(...data.map((d) => d.Balance));
  const maxBalance = Math.max(...data.map((d) => d.Balance));
  const padding = (maxBalance - minBalance) * 0.1;

  return (
    <div className="mt-8">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={formatYAxis}
            domain={[minBalance - padding, maxBalance + padding]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="Balance"
            stroke="#8884d8"
            dot={false}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BalanceOverTime;
