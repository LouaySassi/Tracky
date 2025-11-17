import React, { useState } from 'react';
import { PlusIcon, Trash2Icon, ShoppingBagIcon } from 'lucide-react';
import { Expense } from '../types';
import { Button } from './Button';
import { Input } from './Input';
interface ExpensesListProps {
  expenses: Expense[];
  onAddExpense: (name: string, amount: number) => void;
  onRemoveExpense: (id: string) => void;
}
export function ExpensesList({
  expenses,
  onAddExpense,
  onRemoveExpense
}: ExpensesListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const handleAdd = () => {
    const amount = parseFloat(expenseAmount);
    if (expenseName.trim() && amount > 0) {
      onAddExpense(expenseName.trim(), amount);
      setExpenseName('');
      setExpenseAmount('');
      setIsAdding(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingBagIcon className="w-6 h-6 text-sage" />
          <h2 className="text-2xl font-bold text-text-primary">
            One-Time Expenses
          </h2>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors" aria-label="Add expense">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>
      <div className="mb-6">
        <div className="text-3xl font-bold text-text-primary mb-1">
          ${totalExpenses.toFixed(2)}
        </div>
        <div className="text-sm text-text-muted">Total Expenses This Month</div>
      </div>
      {isAdding && <div className="mb-6 p-4 bg-dark-bg rounded-lg space-y-3">
          <Input type="text" value={expenseName} onChange={setExpenseName} placeholder="What did you buy? (e.g., Shoes)" fullWidth autoFocus />
          <Input type="number" value={expenseAmount} onChange={setExpenseAmount} placeholder="Amount" fullWidth min={0} step={0.01} />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm" fullWidth>
              Add Expense
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => <div key={expense.id} className="flex items-center justify-between p-4 bg-dark-bg hover:bg-dark-card-hover rounded-lg transition-colors group">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-text-primary">
                    {expense.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-red-400">
                  -${expense.amount.toFixed(2)}
                </span>
                <button onClick={() => onRemoveExpense(expense.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all" aria-label="Remove expense">
                  <Trash2Icon className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>)}
      </div>
      {expenses.length === 0 && !isAdding && <p className="text-center text-text-muted text-sm py-8">
          No expenses yet. Click + to add one-time purchases.
        </p>}
    </div>;
}