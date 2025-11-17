import React from 'react';
import { DollarSignIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
interface PaydayPromptProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  remainingAmount: number;
}
export function PaydayPrompt({
  isOpen,
  onYes,
  onNo,
  remainingAmount
}: PaydayPromptProps) {
  return <Modal isOpen={isOpen} onClose={onNo} title="Payday Check-In">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center">
            <DollarSignIcon className="w-10 h-10 text-sage" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Did you receive your paycheck?
          </h3>
          <p className="text-sm text-text-muted">
            It's the 25th! Let me know if you received your monthly salary.
          </p>
        </div>
        {remainingAmount > 0 && <div className="bg-sage/10 border-2 border-sage/30 rounded-xl p-4 text-center">
            <p className="text-sm text-text-muted mb-1">
              Remaining funds from this month
            </p>
            <p className="text-3xl font-bold text-sage">
              ${remainingAmount.toFixed(2)}
            </p>
            <p className="text-xs text-text-muted mt-2">
              💡 This will be added to your savings if you confirm
            </p>
          </div>}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={onNo} variant="ghost" size="lg" fullWidth>
            Not Yet
          </Button>
          <Button onClick={onYes} size="lg" fullWidth>
            Yes, I Got Paid!
          </Button>
        </div>
        <p className="text-xs text-text-muted text-center">
          Selecting "Yes" will save your remaining funds and start a fresh month
        </p>
      </div>
    </Modal>;
}