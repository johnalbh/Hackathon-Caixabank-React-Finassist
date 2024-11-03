import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function AnalysisGraph() {
  const transactions = useStore(transactionsStore);

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  const data = categories
    .map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category === category
      );

      const income = categoryTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = categoryTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category,
        Income: income,
        Expense: expense * -1,
      };
    })
    .filter((item) => item.Income !== 0 || item.Expense !== 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {Math.abs(item.value).toFixed(2)}€
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 50,
          }}
        >
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis tickFormatter={(value) => `${Math.abs(value)}€`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Income" fill="#82ca9d" name="Income" />
          <Bar dataKey="Expense" fill="#8884d8" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalysisGraph;
