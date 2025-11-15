// Shared types for the Expense feature

export type Category = {
  id: number | string;
  name: string;
  color?: string | null;
};

export type ExpenseRow = {
  id: number | string;
  date: string;                 // YYYY-MM-DD
  description: string;
  category?: string | null;     // category name
  amount: number;
};
