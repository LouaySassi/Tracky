import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'lucide-react';
import { FinancialData } from '../types';
interface MonthlyAnalyticsProps {
  currentMonthData: FinancialData;
  previousMonthData?: FinancialData;
}
export function MonthlyAnalytics({
  currentMonthData,
  previousMonthData
}: MonthlyAnalyticsProps) {
  const calculateTotals = (data: FinancialData) => {
    const totalBills = data.monthlyBills.reduce((sum, b) => sum + b.spent, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSpent = totalBills + totalExpenses;
    return {
      totalBills,
      totalExpenses,
      totalSpent
    };
  };
  const current = calculateTotals(currentMonthData);
  const previous = previousMonthData ? calculateTotals(previousMonthData) : null;
  const getChange = (currentVal: number, previousVal: number | null) => {
    if (!previousVal) return null;
    const change = (currentVal - previousVal) / previousVal * 100;
    return change;
  };
  const renderStat = (label: string, value: number, previousValue: number | null, icon: React.ReactNode) => {
    const change = getChange(value, previousValue);
    return <div className="bg-dark-bg rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">{label}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">
          ${value.toFixed(2)}
        </div>
        {change !== null && <div className={`flex items-center gap-1 text-xs ${change > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {change > 0 ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
            <span>{Math.abs(change).toFixed(1)}% vs last month</span>
          </div>}
      </div>;
  };
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Monthly Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStat('Total Spent', current.totalSpent, previous?.totalSpent || null, <DollarSignIcon className="w-5 h-5 text-sage" />)}
        {renderStat('Bills', current.totalBills, previous?.totalBills || null, <DollarSignIcon className="w-5 h-5 text-blue-400" />)}
        {renderStat('Expenses', current.totalExpenses, previous?.totalExpenses || null, <DollarSignIcon className="w-5 h-5 text-orange-400" />)}
      </div>
    </div>;
}