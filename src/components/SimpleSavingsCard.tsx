import React, { useState } from 'react';
import { PiggyBankIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Transaction } from '../types';
import { Button } from './Button';
import { Input } from './Input';
interface SimpleSavingsCardProps {
  totalSavings: number;
  allTransactions: Transaction[];
  onAddToSavings: (amount: number) => void;
  onDeleteTransaction: (transactionId: string) => void;
}
export function SimpleSavingsCard({
  totalSavings,
  allTransactions,
  onAddToSavings,
  onDeleteTransaction
}: SimpleSavingsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const handleAdd = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      onAddToSavings(amount);
      setAddAmount('');
      setIsAdding(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PiggyBankIcon className="w-6 h-6 text-sage" />
          <h2 className="text-2xl font-bold text-text-primary">
            Personal Savings
          </h2>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors" aria-label="Add to savings">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>
      <div className="mb-6">
        <div className="text-5xl font-bold text-sage mb-2">
          ${totalSavings.toFixed(2)}
        </div>
        <div className="text-sm text-text-muted">
          💡 Automatically saves leftover money on the 25th (payday)
        </div>
      </div>
      {isAdding && <div className="mb-6 p-4 bg-dark-bg rounded-lg space-y-3">
          <Input type="number" value={addAmount} onChange={setAddAmount} placeholder="Amount to add" fullWidth autoFocus min={0} step={0.01} />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm" fullWidth>
              Add to Savings
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}
      {/* All-time History */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-text-primary mb-3">
          All-Time History
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {allTransactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-card-hover transition-colors group">
              <div>
                <span className="text-sm text-text-secondary">
                  {formatDate(transaction.date)}
                </span>
                {transaction.note && <p className="text-xs text-text-muted mt-1">
                    {transaction.note}
                  </p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-sage">
                  +${transaction.amount.toFixed(2)}
                </span>
                <button onClick={() => onDeleteTransaction(transaction.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all" aria-label="Remove savings transaction">
                  <Trash2Icon className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>)}
        </div>
        {allTransactions.length === 0 && <p className="text-center text-text-muted text-sm py-4">
            No savings history yet
          </p>}
      </div>
    </div>;
}