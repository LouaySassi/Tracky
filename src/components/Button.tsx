import React from 'react';
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  const variantStyles = {
    primary: 'bg-sage text-white hover:bg-sage-dark active:bg-sage-dark disabled:bg-dark-border disabled:text-text-muted',
    secondary: 'bg-dark-card-hover text-sage border-2 border-sage hover:bg-sage hover:text-white active:bg-sage-dark',
    ghost: 'bg-transparent text-text-secondary hover:bg-dark-card-hover active:bg-dark-border'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  const widthStyle = fullWidth ? 'w-full' : '';
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle}`}>
      {children}
    </button>;
}