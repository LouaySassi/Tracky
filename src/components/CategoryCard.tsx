import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from 'lucide-react';
import { Category, Transaction } from '../types';
import { EditableNumber } from './EditableNumber';
import { Input } from './Input';
import { Button } from './Button';
import { TransactionList } from './TransactionList';
interface CategoryCardProps {
  category: Category;
  transactions: Transaction[];
  onAddExpense: (amount: number, note?: string) => void;
  onUpdateBudget: (budget: number) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onRemove: () => void;
}
export function CategoryCard({
  category,
  transactions,
  onAddExpense,
  onUpdateBudget,
  onDeleteTransaction,
  onRemove
}: CategoryCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const percentage = category.spent / category.budget * 100;
  const isOverBudget = category.spent > category.budget;
  const handleAdd = () => {
    const expenseAmount = parseFloat(amount);
    if (expenseAmount > 0) {
      onAddExpense(expenseAmount, note.trim() || undefined);
      setAmount('');
      setNote('');
      setIsAdding(false);
    }
  };
  const handleQuickAdd = (quickAmount: number) => {
    onAddExpense(quickAmount);
  };
  const handleCardClick = () => {
    if (!isAdding && !showHistory) {
      setIsAdding(true);
    }
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl relative">
      <div onClick={handleCardClick} className={`p-6 cursor-pointer ${isAdding ? 'ring-2 ring-sage' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">
            {category.name}
          </h3>
          <button onClick={e => {
          e.stopPropagation();
          onRemove();
        }} className="p-1.5 hover:bg-red-500/20 rounded transition-all" aria-label="Remove category">
            <Trash2Icon className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {!isAdding ? <>
            <div className="mb-2">
              <div className="text-4xl font-bold text-text-primary mb-1">
                <span className={isOverBudget ? 'text-red-400' : ''}>
                  ${category.spent.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <span className="text-sm text-text-muted">of</span>
                <EditableNumber value={category.budget} onSave={onUpdateBudget} className="text-lg text-text-muted" />
              </div>
            </div>

            <div className="w-full bg-dark-bg rounded-full h-2 mb-4">
              <div className={`h-2 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : 'bg-sage'}`} style={{
            width: `${Math.min(percentage, 100)}%`
          }} />
            </div>

            <div className="text-sm text-text-muted mb-4">
              {isOverBudget ? <span className="text-red-400">
                  ${(category.spent - category.budget).toFixed(2)} over budget
                </span> : <span>
                  ${(category.budget - category.spent).toFixed(2)} remaining
                </span>}
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map(quickAmount => <button key={quickAmount} onClick={e => {
            e.stopPropagation();
            handleQuickAdd(quickAmount);
          }} className="px-3 py-2 bg-sage/20 text-sage rounded-lg hover:bg-sage hover:text-white transition-all text-sm font-medium">
                  +${quickAmount}
                </button>)}
            </div>
          </> : <div className="space-y-3" onClick={e => e.stopPropagation()}>
            <Input type="number" value={amount} onChange={setAmount} placeholder="Amount" fullWidth autoFocus min={0} step={0.01} />
            <Input type="text" value={note} onChange={setNote} placeholder="Note (optional)" fullWidth />
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm" fullWidth>
                Add Expense
              </Button>
              <Button onClick={e => {
            e.stopPropagation();
            setIsAdding(false);
            setAmount('');
            setNote('');
          }} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>}

        {/* History Toggle Button */}
        {transactions.length > 0 && <button onClick={e => {
        e.stopPropagation();
        setShowHistory(!showHistory);
      }} className="w-full mt-4 px-4 py-2 flex items-center justify-between bg-dark-bg hover:bg-dark-card-hover rounded-lg transition-colors">
            <span className="text-sm font-medium text-text-secondary">
              History ({transactions.length})
            </span>
            {showHistory ? <ChevronUpIcon className="w-4 h-4 text-text-muted" /> : <ChevronDownIcon className="w-4 h-4 text-text-muted" />}
          </button>}
      </div>

      {/* Transaction History Overlay */}
      {showHistory && transactions.length > 0 && <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border-2 border-dark-border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-text-primary">
                Transaction History
              </h4>
              <button onClick={e => {
            e.stopPropagation();
            setShowHistory(false);
          }} className="text-xs text-text-muted hover:text-text-secondary">
                Close
              </button>
            </div>
            <TransactionList transactions={transactions} onDelete={onDeleteTransaction} />
          </div>
        </div>}
    </div>;
}