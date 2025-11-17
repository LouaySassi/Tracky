import React from 'react';
export interface InputProps {
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  min?: number;
  step?: number;
}
export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  fullWidth = false,
  autoFocus = false,
  min,
  step
}: InputProps) {
  return <div className={fullWidth ? 'w-full' : ''}>
      {label && <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} min={min} step={step} className="w-full px-4 py-3 text-lg bg-dark-bg border-2 border-dark-border text-text-primary rounded-lg focus:outline-none focus:border-sage transition-colors duration-200 placeholder-text-muted" />
    </div>;
}