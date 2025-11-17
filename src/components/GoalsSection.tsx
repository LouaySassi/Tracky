import React, { useState } from 'react';
import { PlusIcon, Trash2Icon, TargetIcon } from 'lucide-react';
import { Goal } from '../types';
import { EditableNumber } from './EditableNumber';
import { Button } from './Button';
import { Input } from './Input';
interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (name: string, totalAmount: number, monthlyPayment: number) => void;
  onRemoveGoal: (id: string) => void;
  onUpdateMonthlyPayment: (id: string, payment: number) => void;
}
export function GoalsSection({
  goals,
  onAddGoal,
  onRemoveGoal,
  onUpdateMonthlyPayment
}: GoalsSectionProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTotal, setNewGoalTotal] = useState('');
  const [newGoalMonthly, setNewGoalMonthly] = useState('');
  const handleAddGoal = () => {
    const total = parseFloat(newGoalTotal);
    const monthly = parseFloat(newGoalMonthly);
    if (newGoalName.trim() && total > 0 && monthly > 0) {
      onAddGoal(newGoalName.trim(), total, monthly);
      setNewGoalName('');
      setNewGoalTotal('');
      setNewGoalMonthly('');
      setIsAddingGoal(false);
    }
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TargetIcon className="w-6 h-6 text-sage" />
          <h2 className="text-2xl font-bold text-text-primary">Goals</h2>
        </div>
        <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors" aria-label="Add goal">
          <PlusIcon className="w-5 h-5 text-sage" />
        </button>
      </div>

      {isAddingGoal && <div className="mb-6 p-4 bg-dark-bg rounded-lg space-y-3">
          <Input type="text" value={newGoalName} onChange={setNewGoalName} placeholder="Goal name (e.g., Car Payment)" fullWidth />
          <Input type="number" value={newGoalTotal} onChange={setNewGoalTotal} placeholder="Total amount" fullWidth min={0} step={0.01} />
          <Input type="number" value={newGoalMonthly} onChange={setNewGoalMonthly} placeholder="Monthly payment" fullWidth min={0} step={0.01} />
          <div className="flex gap-2">
            <Button onClick={handleAddGoal} size="sm" fullWidth>
              Add Goal
            </Button>
            <Button onClick={() => setIsAddingGoal(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>}

      <div className="space-y-4">
        {goals.map(goal => {
        const percentage = goal.currentAmount / goal.totalAmount * 100;
        const remaining = goal.totalAmount - goal.currentAmount;
        const isComplete = goal.currentAmount >= goal.totalAmount;
        return <div key={goal.id} className="p-5 border-2 border-dark-border rounded-lg hover:border-sage transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {goal.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <span>Monthly Payment:</span>
                    <EditableNumber value={goal.monthlyPayment} onSave={value => onUpdateMonthlyPayment(goal.id, value)} className="text-sm font-medium text-sage" />
                  </div>
                </div>
                <button onClick={() => onRemoveGoal(goal.id)} className="p-1 hover:bg-red-500/20 rounded transition-all" aria-label="Remove goal">
                  <Trash2Icon className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-text-primary">
                    ${goal.currentAmount.toFixed(2)}
                  </span>
                  <span className="text-sm text-text-muted">
                    of ${goal.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3 mb-2">
                  <div className={`h-3 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-sage'}`} style={{
                width: `${Math.min(percentage, 100)}%`
              }} />
                </div>
                <div className="text-sm text-text-muted">
                  {isComplete ? <span className="text-green-400 font-medium">
                      Goal Complete! 🎉
                    </span> : <span>${remaining.toFixed(2)} remaining</span>}
                </div>
              </div>

              <p className="text-xs text-text-muted bg-dark-bg p-3 rounded-lg">
                💡 Progress updates automatically from monthly bill payments
              </p>
            </div>;
      })}
      </div>

      {goals.length === 0 && !isAddingGoal && <p className="text-center text-text-muted text-sm py-4">
          No goals added yet. Goals automatically create monthly bill items.
        </p>}
    </div>;
}