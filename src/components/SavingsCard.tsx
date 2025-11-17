import React, { useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { SavingsGoal } from '../types';
import { Button } from './Button';
import { Input } from './Input';
interface SavingsCardProps {
  savings: SavingsGoal[];
  onAddGoal: (name: string) => void;
  onRemoveGoal: (id: string) => void;
  onAddToSavings: (id: string, amount: number) => void;
}
export function SavingsCard({
  savings,
  onAddGoal,
  onRemoveGoal,
  onAddToSavings
}: SavingsCardProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [addingToGoal, setAddingToGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const handleAddGoal = () => {
    if (newGoalName.trim()) {
      onAddGoal(newGoalName.trim());
      setNewGoalName('');
      setIsAddingGoal(false);
    }
  };
  const handleAddToSavings = (id: string) => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      onAddToSavings(id, amount);
      setAddAmount('');
      setAddingToGoal(null);
    }
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Savings</h2>
        <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors" aria-label="Add savings goal">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-text-primary mb-1">
          ${totalSavings.toFixed(2)}
        </div>
        <div className="text-sm text-text-muted">Total Saved</div>
      </div>

      {isAddingGoal && <div className="mb-4 p-4 bg-dark-bg rounded-lg space-y-3">
          <Input type="text" value={newGoalName} onChange={setNewGoalName} placeholder="Goal name (e.g., Vacation Fund)" fullWidth />
          <div className="flex gap-2">
            <Button onClick={handleAddGoal} size="sm" fullWidth>
              Add Goal
            </Button>
            <Button onClick={() => setIsAddingGoal(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}

      <div className="space-y-3">
        {savings.map(goal => <div key={goal.id} className="p-3 bg-dark-bg hover:bg-dark-card-hover rounded-lg transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                {goal.name}
              </span>
              <button onClick={() => onRemoveGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all" aria-label="Remove goal">
                <Trash2Icon className="w-4 h-4 text-red-400" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-sage">
                ${goal.currentAmount.toFixed(2)}
              </span>
              {addingToGoal === goal.id ? <div className="flex gap-2 items-center">
                  <Input type="number" value={addAmount} onChange={setAddAmount} placeholder="Amount" min={0} step={0.01} />
                  <Button onClick={() => handleAddToSavings(goal.id)} size="sm">
                    Add
                  </Button>
                  <Button onClick={() => setAddingToGoal(null)} variant="ghost" size="sm">
                    ×
                  </Button>
                </div> : <Button onClick={() => setAddingToGoal(goal.id)} size="sm" variant="secondary">
                  Add Funds
                </Button>}
            </div>
          </div>)}
      </div>

      {savings.length === 0 && !isAddingGoal && <p className="text-center text-text-muted text-sm py-4">
          No savings goals yet
        </p>}
    </div>;
}