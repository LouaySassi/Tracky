export interface MonthlyBillItem {
  id: string;
  name: string;
  budget: number;
  spent: number;
  isPaid: boolean;
  linkedGoalId?: string;
  pinned?: boolean;
}
export interface Goal {
  id: string;
  name: string;
  totalAmount: number;
  currentAmount: number;
  monthlyPayment: number;
}
export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
}
export interface Transaction {
  id: string;
  date: string;
  type: 'expense' | 'bill' | 'savings' | 'goal' | 'extra-funds';
  category: string;
  amount: number;
  note?: string;
  itemId: string;
}
export interface FinancialData {
  monthlySalary: number | null;
  extraFunds: number;
  monthlyBills: MonthlyBillItem[];
  expenses: Expense[];
  totalSavings: number;
  goals: Goal[];
  transactions: Transaction[];
  lastPayday?: string;
  lastPaydayConfirmed?: string; // Only set when user confirms payday
}
export interface GlobalSettings {
  defaultSalary: number;
}