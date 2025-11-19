import React, { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, CalendarIcon, PiggyBankIcon, AlertCircleIcon } from 'lucide-react';
import { FinancialData, GlobalSettings } from '../types';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
interface MonthlyDataStore {
  [monthKey: string]: FinancialData;
}
interface AnalyticsProps {
  allMonthsData: MonthlyDataStore;
  settings: GlobalSettings;
}
const COLORS = ['#86A789', '#4F46E5', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
export function Analytics({
  allMonthsData,
  settings
}: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'3' | '6' | '12' | 'all'>('6');
  const monthKeys = useMemo(() => {
    return Object.keys(allMonthsData).sort();
  }, [allMonthsData]);
  const filteredMonthKeys = useMemo(() => {
    if (timeRange === 'all') return monthKeys;
    const count = parseInt(timeRange);
    return monthKeys.slice(-count);
  }, [monthKeys, timeRange]);
  // Spending Trends Over Time
  const spendingTrends = useMemo(() => {
    return filteredMonthKeys.map(key => {
      const data = allMonthsData[key];
      const totalBills = data.monthlyBills.reduce((sum, b) => sum + b.spent, 0);
      const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalSavings = data.transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleDateString('en-US', {
        month: 'short'
      });
      return {
        month: monthName,
        bills: totalBills,
        expenses: totalExpenses,
        savings: totalSavings,
        total: totalBills + totalExpenses
      };
    });
  }, [filteredMonthKeys, allMonthsData]);
  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const categories: {
      [key: string]: number;
    } = {};
    filteredMonthKeys.forEach(key => {
      const data = allMonthsData[key];
      data.monthlyBills.forEach(bill => {
        categories[bill.name] = (categories[bill.name] || 0) + bill.spent;
      });
      data.expenses.forEach(expense => {
        categories[expense.name] = (categories[expense.name] || 0) + expense.amount;
      });
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [filteredMonthKeys, allMonthsData]);
  // Key Metrics
  const metrics = useMemo(() => {
    const latestKey = filteredMonthKeys[filteredMonthKeys.length - 1];
    const previousKey = filteredMonthKeys[filteredMonthKeys.length - 2];
    if (!latestKey) {
      return {
        avgMonthlySpending: 0,
        totalSavings: 0,
        savingsRate: 0,
        budgetAdherence: 0,
        latestSpending: 0,
        previousSpending: 0
      };
    }
    const latestData = allMonthsData[latestKey];
    const totalSpending = filteredMonthKeys.reduce((sum, key) => {
      const data = allMonthsData[key];
      const bills = data.monthlyBills.reduce((s, b) => s + b.spent, 0);
      const expenses = data.expenses.reduce((s, e) => s + e.amount, 0);
      return sum + bills + expenses;
    }, 0);
    const avgMonthlySpending = totalSpending / filteredMonthKeys.length;
    const totalSavings = Object.values(allMonthsData).reduce((sum, data) => Math.max(sum, data.totalSavings), 0);
    const latestBills = latestData.monthlyBills.reduce((s, b) => s + b.spent, 0);
    const latestExpenses = latestData.expenses.reduce((s, e) => s + e.amount, 0);
    const latestSpending = latestBills + latestExpenses;
    const latestIncome = latestData.monthlySalary || settings.defaultSalary;
    const savingsRate = latestIncome > 0 ? (latestIncome - latestSpending) / latestIncome * 100 : 0;
    const budgetTotal = latestData.monthlyBills.reduce((s, b) => s + b.budget, 0);
    const spentTotal = latestData.monthlyBills.reduce((s, b) => s + b.spent, 0);
    const budgetAdherence = budgetTotal > 0 ? (budgetTotal - spentTotal) / budgetTotal * 100 : 0;
    let previousSpending = 0;
    if (previousKey) {
      const prevData = allMonthsData[previousKey];
      const prevBills = prevData.monthlyBills.reduce((s, b) => s + b.spent, 0);
      const prevExpenses = prevData.expenses.reduce((s, e) => s + e.amount, 0);
      previousSpending = prevBills + prevExpenses;
    }
    return {
      avgMonthlySpending,
      totalSavings,
      savingsRate,
      budgetAdherence,
      latestSpending,
      previousSpending
    };
  }, [filteredMonthKeys, allMonthsData, settings]);
  const spendingChange = metrics.previousSpending > 0 ? (metrics.latestSpending - metrics.previousSpending) / metrics.previousSpending * 100 : 0;
  // Top Spending Categories
  const topCategories = useMemo(() => {
    return categoryBreakdown.slice(0, 5);
  }, [categoryBreakdown]);
  // Insights
  const insights = useMemo(() => {
    const tips: Array<{
      type: 'success' | 'warning' | 'info';
      message: string;
    }> = [];
    if (metrics.savingsRate > 20) {
      tips.push({
        type: 'success',
        message: `Great job! You're saving ${metrics.savingsRate.toFixed(1)}% of your income.`
      });
    } else if (metrics.savingsRate < 10) {
      tips.push({
        type: 'warning',
        message: `Your savings rate is ${metrics.savingsRate.toFixed(1)}%. Try to increase it to at least 20%.`
      });
    }
    if (metrics.budgetAdherence < 0) {
      tips.push({
        type: 'warning',
        message: `You're over budget by ${Math.abs(metrics.budgetAdherence).toFixed(1)}%. Review your spending habits.`
      });
    } else if (metrics.budgetAdherence > 20) {
      tips.push({
        type: 'success',
        message: `You're ${metrics.budgetAdherence.toFixed(1)}% under budget! Consider saving the difference.`
      });
    }
    if (spendingChange > 10) {
      tips.push({
        type: 'warning',
        message: `Your spending increased by ${spendingChange.toFixed(1)}% this month.`
      });
    } else if (spendingChange < -10) {
      tips.push({
        type: 'success',
        message: `Excellent! You reduced spending by ${Math.abs(spendingChange).toFixed(1)}% this month.`
      });
    }
    if (topCategories.length > 0) {
      tips.push({
        type: 'info',
        message: `Your top expense is "${topCategories[0].name}" at $${topCategories[0].value.toFixed(2)}.`
      });
    }
    return tips;
  }, [metrics, spendingChange, topCategories]);

  const absoluteLatestKey = monthKeys[monthKeys.length - 1];
  const absolutePreviousKey = monthKeys[monthKeys.length - 2];
  const absoluteLatestData = allMonthsData[absoluteLatestKey];
  const absolutePreviousData = absolutePreviousKey ? allMonthsData[absolutePreviousKey] : undefined;

  return <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Financial Analytics
        </h1>
        <div className="flex gap-2">
          {(['3', '6', '12', 'all'] as const).map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === range ? 'bg-sage text-white' : 'bg-dark-card text-text-secondary hover:bg-dark-card-hover'}`}>
              {range === 'all' ? 'All Time' : `${range} Months`}
            </button>)}
        </div>
      </div>
      
      {absoluteLatestData && (
        <MonthlyAnalytics 
          currentMonthData={absoluteLatestData} 
          previousMonthData={absolutePreviousData} 
        />
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">
              Avg Monthly Spending
            </span>
            <DollarSignIcon className="w-5 h-5 text-sage" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            ${metrics.avgMonthlySpending.toFixed(2)}
          </div>
        </div>
        <div className="bg-dark-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">Total Savings</span>
            <PiggyBankIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            ${metrics.totalSavings.toFixed(2)}
          </div>
        </div>
        <div className="bg-dark-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">Savings Rate</span>
            <TrendingUpIcon className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {metrics.savingsRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-dark-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">Budget Status</span>
            {metrics.budgetAdherence >= 0 ? <TrendingUpIcon className="w-5 h-5 text-green-400" /> : <TrendingDownIcon className="w-5 h-5 text-red-400" />}
          </div>
          <div className={`text-3xl font-bold ${metrics.budgetAdherence >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.budgetAdherence >= 0 ? 'Under' : 'Over'}
          </div>
          <div className="text-sm text-text-muted mt-1">
            {Math.abs(metrics.budgetAdherence).toFixed(1)}%
          </div>
        </div>
      </div>
      {/* Insights */}
      {insights.length > 0 && <div className="bg-dark-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5 text-sage" />
            Insights & Recommendations
          </h2>
          <div className="space-y-3">
            {insights.map((insight, index) => <div key={index} className={`p-4 rounded-lg border-2 ${insight.type === 'success' ? 'bg-green-500/10 border-green-500/30' : insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                <p className={`text-sm ${insight.type === 'success' ? 'text-green-400' : insight.type === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>
                  {insight.message}
                </p>
              </div>)}
          </div>
        </div>}
      {/* Spending Trends Chart */}
      <div className="bg-dark-card rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Spending Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #4B5563',
            borderRadius: '8px'
          }} />
            <Legend />
            <Line type="monotone" dataKey="bills" stroke="#86A789" strokeWidth={2} name="Bills" />
            <Line type="monotone" dataKey="expenses" stroke="#F59E0B" strokeWidth={2} name="Expenses" />
            <Line type="monotone" dataKey="savings" stroke="#4F46E5" strokeWidth={2} name="Savings" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Comparison */}
        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Monthly Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px'
            }} />
              <Legend />
              <Bar dataKey="total" fill="#86A789" name="Total Spending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Category Breakdown */}
        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Top Spending Categories
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" labelLine={false} label={({
              name,
              percent
            }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {categoryBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px'
            }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Categories List */}
      <div className="bg-dark-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Spending Breakdown
        </h2>
        <div className="space-y-4">
          {topCategories.map((category, index) => {
          const total = topCategories.reduce((sum, c) => sum + c.value, 0);
          const percentage = category.value / total * 100;
          return <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    {category.name}
                  </span>
                  <span className="text-sm font-bold text-sage">
                    ${category.value.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div className="h-2 rounded-full" style={{
                width: `${percentage}%`,
                backgroundColor: COLORS[index % COLORS.length]
              }} />
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
}