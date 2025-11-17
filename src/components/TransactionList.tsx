import React from 'react';
import { Trash2Icon } from 'lucide-react';
import { Transaction } from '../types';
interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (transactionId: string) => void;
}
export function TransactionList({
  transactions,
  onDelete
}: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (transactions.length === 0) {
    return <p className="text-center text-text-muted text-sm py-4">
        No transactions yet
      </p>;
  }
  return <div className="space-y-2">
      {transactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-card-hover transition-colors group">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">
                ${transaction.amount.toFixed(2)}
              </span>
              {transaction.note && <span className="text-xs text-text-muted">
                  • {transaction.note}
                </span>}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {formatDate(transaction.date)}
            </p>
          </div>
          <button onClick={() => onDelete(transaction.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all" aria-label="Delete transaction">
            <Trash2Icon className="w-4 h-4 text-red-400" />
          </button>
        </div>)}
    </div>;
}