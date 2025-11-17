import React, { useState } from 'react';
import { CheckCircle2Icon, CircleIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { MonthlyBillItem } from '../types';
import { EditableNumber } from './EditableNumber';
import { Button } from './Button';
import { Input } from './Input';
interface MonthlyBillsSectionProps {
  bills: MonthlyBillItem[];
  onTogglePaid: (id: string) => void;
  onUpdateBudget: (id: string, budget: number) => void;
  onAddBill: (name: string, budget: number) => void;
  onRemoveBill: (id: string) => void;
  onAddSpent: (id: string, amount: number) => void;
}
export function MonthlyBillsSection({
  bills,
  onTogglePaid,
  onUpdateBudget,
  onAddBill,
  onRemoveBill,
  onAddSpent
}: MonthlyBillsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [newBillBudget, setNewBillBudget] = useState('');
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const totalBudget = bills.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = bills.reduce((sum, b) => sum + b.spent, 0);
  const paidCount = bills.filter(b => b.isPaid).length;
  const handleAdd = () => {
    const budget = parseFloat(newBillBudget);
    if (newBillName.trim() && budget > 0) {
      onAddBill(newBillName.trim(), budget);
      setNewBillName('');
      setNewBillBudget('');
      setIsAdding(false);
    }
  };
  const handleAddSpent = (id: string) => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      onAddSpent(id, amount);
      setAddAmount('');
      setAddingToId(null);
    }
  };
  return <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-warm-gray">Monthly Bills</h2>
          <p className="text-sm text-warm-gray-light mt-1">
            Paid: {paidCount} of {bills.length} • ${totalSpent.toFixed(2)} / $
            {totalBudget.toFixed(2)}
          </p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Add bill">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>

      {isAdding && <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <Input type="text" value={newBillName} onChange={setNewBillName} placeholder="Bill name" fullWidth />
          <Input type="number" value={newBillBudget} onChange={setNewBillBudget} placeholder="Monthly budget" fullWidth min={0} step={0.01} />
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm" fullWidth>
              Add
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}

      <div className="space-y-3">
        {bills.map(bill => {
        const percentage = bill.spent / bill.budget * 100;
        const isOverBudget = bill.spent > bill.budget;
        return <div key={bill.id} className="p-4 border-2 border-gray-100 rounded-lg hover:border-sage transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => onTogglePaid(bill.id)} className="flex-shrink-0">
                    {bill.isPaid ? <CheckCircle2Icon className="w-6 h-6 text-sage" /> : <CircleIcon className="w-6 h-6 text-gray-300" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${bill.isPaid ? 'text-warm-gray-light line-through' : 'text-warm-gray'}`}>
                        {bill.name}
                      </span>
                      {bill.linkedGoalId && <span className="text-xs bg-sage-light text-sage-dark px-2 py-0.5 rounded">
                          Goal Payment
                        </span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={isOverBudget ? 'text-red-500 font-medium' : 'text-warm-gray-light'}>
                        ${bill.spent.toFixed(2)}
                      </span>
                      <span className="text-warm-gray-light">/</span>
                      <EditableNumber value={bill.budget} onSave={value => onUpdateBudget(bill.id, value)} className="text-warm-gray-light" />
                    </div>
                  </div>
                </div>
                <button onClick={() => onRemoveBill(bill.id)} className="p-1 hover:bg-red-50 rounded transition-all" aria-label="Remove bill">
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : 'bg-sage'}`} style={{
              width: `${Math.min(percentage, 100)}%`
            }} />
              </div>

              {/* Add Spent */}
              {addingToId === bill.id ? <div className="flex gap-2 items-center">
                  <Input type="number" value={addAmount} onChange={setAddAmount} placeholder="Amount" min={0} step={0.01} />
                  <Button onClick={() => handleAddSpent(bill.id)} size="sm">
                    Add
                  </Button>
                  <Button onClick={() => setAddingToId(null)} variant="ghost" size="sm">
                    ×
                  </Button>
                </div> : <Button onClick={() => setAddingToId(bill.id)} size="sm" variant="secondary" fullWidth>
                  Add Payment
                </Button>}
            </div>;
      })}
      </div>

      {bills.length === 0 && !isAdding && <p className="text-center text-warm-gray-light text-sm py-4">
          No bills added yet
        </p>}
    </div>;
}