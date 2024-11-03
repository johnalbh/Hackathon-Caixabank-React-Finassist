import { expenseCategories } from '../constants/categories';

export const generateRandomBudgetSettings = () => {
  const totalBudget = Math.floor(Math.random() * (5000 - 2000) + 2000);
  const categoryBudgets = {};
  let remainingBudget = totalBudget;

  expenseCategories.forEach((category, index) => {
    if (index === expenseCategories.length - 1) {
      categoryBudgets[category] = Math.floor(remainingBudget);
    } else {
      const maxBudget = remainingBudget / (expenseCategories.length - index);
      const budget = Math.floor(Math.random() * maxBudget);
      categoryBudgets[category] = budget;
      remainingBudget -= budget;
    }
  });

  return {
    totalBudgetLimit: totalBudget,
    categoryLimits: categoryBudgets,
    alertsEnabled: true,
    budgetExceeded: false,
  };
};
