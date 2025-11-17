import React from 'react';
import { XIcon } from 'lucide-react';
import { Transaction } from '../types';
interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}
export function TransactionHistory({
  isOpen,
  onClose,
  transactions
}: TransactionHistoryProps) {
  if (!isOpen) return null;
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'text-red-400';
      case 'bill':
        return 'text-orange-400';
      case 'savings':
        return 'text-sage';
      case 'extra-funds':
        return 'text-blue-400';
      default:
        return 'text-text-muted';
    }
  };
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'expense':
        return 'Expense';
      case 'bill':
        return 'Bill Payment';
      case 'savings':
        return 'Savings';
      case 'extra-funds':
        return 'Extra Funds';
      default:
        return type;
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col border border-dark-border">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-2xl font-bold text-text-primary">
            Transaction History
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-dark-card-hover rounded-lg transition-colors" aria-label="Close">
            <XIcon className="w-6 h-6 text-text-muted" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          {sortedTransactions.length === 0 ? <p className="text-center text-text-muted py-8">
              No transactions yet
            </p> : <div className="space-y-3">
              {sortedTransactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-4 bg-dark-bg hover:bg-dark-card-hover rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-text-primary">
                        {transaction.category}
                      </span>
                      <span className={`text-xs uppercase font-medium px-2 py-1 rounded ${getTypeColor(transaction.type)} bg-opacity-20`}>
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                    {transaction.note && <p className="text-sm text-text-muted">
                        {transaction.note}
                      </p>}
                    <p className="text-xs text-text-muted mt-1">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === 'extra-funds' ? 'text-blue-400' : getTypeColor(transaction.type)}`}>
                    {transaction.type === 'extra-funds' ? '+' : '-'}$
                    {transaction.amount.toFixed(2)}
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
}