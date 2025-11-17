import React, { useState } from 'react';
import { Edit2Icon, CheckIcon, XIcon } from 'lucide-react';
interface EditableNumberProps {
  value: number;
  onSave: (value: number) => void;
  prefix?: string;
  suffix?: string;
  className?: string;
}
export function EditableNumber({
  value,
  onSave,
  prefix = '$',
  suffix = '',
  className = ''
}: EditableNumberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue >= 0) {
      onSave(newValue);
      setIsEditing(false);
    }
  };
  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditValue(value.toString());
    setIsEditing(false);
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  if (isEditing) {
    return <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <input type="number" value={editValue} onChange={e => {
        e.stopPropagation();
        setEditValue(e.target.value);
      }} onClick={e => e.stopPropagation()} className="w-24 px-2 py-1 text-sm bg-dark-bg border-2 border-sage text-text-primary rounded focus:outline-none" autoFocus onKeyDown={e => {
        e.stopPropagation();
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
      }} />
        <button onClick={handleSave} className="p-1 hover:bg-green-500/20 rounded transition-colors" aria-label="Save">
          <CheckIcon className="w-4 h-4 text-green-400" />
        </button>
        <button onClick={handleCancel} className="p-1 hover:bg-red-500/20 rounded transition-colors" aria-label="Cancel">
          <XIcon className="w-4 h-4 text-red-400" />
        </button>
      </div>;
  }
  return <div className="flex items-center gap-2 group">
      <span className={className}>
        {prefix}
        {value.toFixed(2)}
        {suffix}
      </span>
      <button onClick={handleEditClick} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-card-hover rounded transition-all" aria-label="Edit">
        <Edit2Icon className="w-3 h-3 text-text-muted" />
      </button>
    </div>;
}