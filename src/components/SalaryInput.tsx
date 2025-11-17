import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
interface SalaryInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salary: number) => void;
  currentSalary: number;
}
export function SalaryInput({
  isOpen,
  onClose,
  onSave,
  currentSalary
}: SalaryInputProps) {
  const [salary, setSalary] = useState(currentSalary?.toString() || '');
  const handleSave = () => {
    const amount = parseFloat(salary);
    if (amount && amount > 0) {
      onSave(amount);
      onClose();
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Update Default Salary">
      <div className="space-y-6">
        <p className="text-sm text-text-muted">
          This will update your default monthly salary for all future months.
        </p>
        <Input type="number" value={salary} onChange={setSalary} placeholder="Enter your monthly salary" label="Monthly Salary" fullWidth autoFocus min={0} step={0.01} />
        <Button onClick={handleSave} fullWidth size="lg">
          Update Salary
        </Button>
      </div>
    </Modal>;
}