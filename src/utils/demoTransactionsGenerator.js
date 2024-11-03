import { expenseCategories, incomeCategories } from '../constants/categories';

export const generateRandomTransactions = (count = 10) => {
  const incomeDescriptions = {
    Salary: ['Monthly Salary', 'Bonus Payment', 'Overtime Payment'],
    Freelance: [
      'Web Development Project',
      'Design Work',
      'Consulting Hours',
      'Content Writing',
    ],
    'Interest and Dividends': [
      'Stock Dividends',
      'Savings Interest',
      'Investment Returns',
    ],
    Gifts: ['Birthday Money', 'Holiday Gift', 'Family Gift'],
    Sales: ['Online Sale', 'Used Items Sale', 'Product Sales'],
    'Other Income': ['Refund', 'Cashback', 'Survey Reward', 'Lottery Win'],
  };

  const expenseDescriptions = {
    Food: [
      'Grocery Shopping',
      'Restaurant Dinner',
      'Coffee Shop',
      'Food Delivery',
    ],
    Transportation: [
      'Gas',
      'Train Pass',
      'Bus Ticket',
      'Taxi Ride',
      'Car Maintenance',
    ],
    Housing: [
      'Rent',
      'Electricity Bill',
      'Water Bill',
      'Internet Bill',
      'Home Repairs',
    ],
    Entertainment: [
      'Movie Tickets',
      'Netflix Subscription',
      'Concert Tickets',
      'Gaming',
    ],
    Health: [
      'Doctor Visit',
      'Medication',
      'Gym Membership',
      'Health Insurance',
    ],
    Education: [
      'Online Course',
      'Books',
      'School Supplies',
      'Training Program',
    ],
    Clothing: ['New Clothes', 'Shoes', 'Accessories', 'Winter Coat'],
    'Gifts and Donations': [
      'Birthday Gift',
      'Charity Donation',
      'Wedding Gift',
    ],
    Travel: [
      'Hotel Booking',
      'Flight Tickets',
      'Travel Insurance',
      'Vacation Activities',
    ],
    'Other Expenses': [
      'Office Supplies',
      'Pet Supplies',
      'Miscellaneous',
      'Emergency Expense',
    ],
  };

  const getRandomElement = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const getRandomAmount = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);

  const getRandomDateThisYear = () => {
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date();
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return randomDate.toISOString().split('T')[0];
  };

  const getRandomDescription = (category, type) => {
    const descriptions =
      type === 'income' ? incomeDescriptions : expenseDescriptions;
    const categoryDescriptions = descriptions[category] || ['Payment'];
    return getRandomElement(categoryDescriptions);
  };

  const transactions = Array.from({ length: count }, (_, index) => {
    const type = Math.random() > 0.3 ? 'expense' : 'income';
    const category = getRandomElement(
      type === 'income' ? incomeCategories : expenseCategories
    );

    const amount =
      type === 'income' ? getRandomAmount(100, 3000) : getRandomAmount(5, 1000);

    return {
      id: `demo-${Date.now()}-${index}`,
      description: getRandomDescription(category, type),
      amount: parseFloat(amount),
      type,
      category,
      date: getRandomDateThisYear(),
    };
  });

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};
