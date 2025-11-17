import React, { useState } from 'react';
import { CheckCircle2Icon, CircleIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Bill } from '../types';
import { Button } from './Button';
import { Input } from './Input';
interface BillsCardProps {
  bills: Bill[];
  onTogglePaid: (id: string) => void;
  onAddBill: (name: string, amount: number) => void;
  onRemoveBill: (id: string) => void;
}
export function BillsCard({
  bills,
  onTogglePaid,
  onAddBill,
  onRemoveBill
}: BillsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const paidCount = bills.filter(b => b.isPaid).length;
  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const handleAdd = () => {
    const amount = parseFloat(newBillAmount);
    if (newBillName.trim() && amount > 0) {
      onAddBill(newBillName.trim(), amount);
      setNewBillName('');
      setNewBillAmount('');
      setIsAdding(false);
    }
  };
  return <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-warm-gray">Monthly Bills</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Add bill">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-warm-gray mb-1">
          ${totalAmount.toFixed(2)}
        </div>
        <div className="text-sm text-warm-gray-light">
          Paid: {paidCount} of {bills.length}
        </div>
      </div>

      {isAdding && <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <Input type="text" value={newBillName} onChange={setNewBillName} placeholder="Bill name" fullWidth />
          <Input type="number" value={newBillAmount} onChange={setNewBillAmount} placeholder="Amount" fullWidth min={0} step={0.01} />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm" fullWidth>
              Add
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}

      <div className="space-y-2">
        {bills.map(bill => <div key={bill.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
            <button onClick={() => onTogglePaid(bill.id)} className="flex items-center gap-3 flex-1">
              {bill.isPaid ? <CheckCircle2Icon className="w-5 h-5 text-sage flex-shrink-0" /> : <CircleIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />}
              <span className={`text-sm ${bill.isPaid ? 'text-warm-gray-light line-through' : 'text-warm-gray'}`}>
                {bill.name}
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${bill.isPaid ? 'text-warm-gray-light' : 'text-warm-gray'}`}>
                ${bill.amount.toFixed(2)}
              </span>
              <button onClick={() => onRemoveBill(bill.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all" aria-label="Remove bill">
                <Trash2Icon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>)}
      </div>

      {bills.length === 0 && !isAdding && <p className="text-center text-warm-gray-light text-sm py-4">
          No bills added yet
        </p>}
    </div>;
}