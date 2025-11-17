import React from 'react';
import { Edit2Icon, PlusIcon } from 'lucide-react';
interface RemainingFundsProps {
  amount: number;
  salary: number;
  extraFunds: number;
  onUpdateSalary: () => void;
  onAddExtraFunds: () => void;
}
export function RemainingFunds({
  amount,
  salary,
  extraFunds,
  onUpdateSalary,
  onAddExtraFunds
}: RemainingFundsProps) {
  const isNegative = amount < 0;
  return <div className="text-center py-12">
      <div className="mb-6">
        <div onClick={onUpdateSalary} className="flex items-center justify-center gap-2 mb-2 cursor-pointer hover:bg-dark-card-hover rounded-lg py-1 px-3 inline-flex transition-colors">
          <div className="text-sm text-text-muted">Edit Salary</div>
          <Edit2Icon className="w-4 h-4 text-sage" />
        </div>
        {extraFunds > 0 && <div className="text-sm text-blue-400">
            + ${extraFunds.toFixed(2)} extra funds this month
          </div>}
      </div>
      <h2 className="text-xl font-medium text-text-secondary mb-3">
        Remaining This Month
      </h2>
      <div className={`text-8xl font-bold mb-4 ${isNegative ? 'text-red-400' : 'text-text-primary'}`}>
        ${Math.abs(amount).toFixed(2)}
      </div>
      {isNegative && <p className="text-red-400 text-sm mb-4">Over budget</p>}
      <button onClick={onAddExtraFunds} className="inline-flex items-center gap-2 px-6 py-3 bg-sage/20 text-sage rounded-xl hover:bg-sage hover:text-white transition-all font-medium">
        <PlusIcon className="w-5 h-5" />
        Add Extra Funds
      </button>
    </div>;
}