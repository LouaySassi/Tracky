import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Navigation } from './components/Navigation';
import { PaydayPrompt } from './components/PaydayPrompt';
import { FinancialData, MonthlyBillItem, Goal, Expense, Transaction, GlobalSettings } from './types';
const STORAGE_KEY = 'financial-tracker-data';
const SETTINGS_KEY = 'financial-tracker-settings';
const getEmptyMonthData = (defaultSalary: number): FinancialData => ({
  monthlySalary: defaultSalary,
  extraFunds: 0,
  monthlyBills: [{
    id: `bill-gas-${Date.now()}`,
    name: 'Gas Money',
    budget: 300,
    spent: 0,
    isPaid: false
  }, {
    id: `bill-car-${Date.now()}`,
    name: 'Car Payment Money',
    budget: 500,
    spent: 0,
    isPaid: false,
    linkedGoalId: 'goal-1'
  }, {
    id: `bill-school-${Date.now()}`,
    name: 'School Tuition Money',
    budget: 300,
    spent: 0,
    isPaid: false,
    linkedGoalId: 'goal-2'
  }],
  expenses: [],
  totalSavings: 0,
  goals: [{
    id: 'goal-1',
    name: 'Car Payment',
    totalAmount: 15000,
    currentAmount: 0,
    monthlyPayment: 500
  }, {
    id: 'goal-2',
    name: 'School',
    totalAmount: 3000,
    currentAmount: 0,
    monthlyPayment: 300
  }],
  transactions: []
});
interface MonthlyDataStore {
  [monthKey: string]: FinancialData;
}
export function App() {
  const [currentMonthKey, setCurrentMonthKey] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [allMonthsData, setAllMonthsData] = useState<MonthlyDataStore>({});
  const [settings, setSettings] = useState<GlobalSettings>({
    defaultSalary: 1300
  });
  const [isPaydayPromptOpen, setIsPaydayPromptOpen] = useState(false);
  const currentData = allMonthsData[currentMonthKey] || getEmptyMonthData(settings.defaultSalary);
  // Load settings
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);
  // Save settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  // Load all months data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAllMonthsData(parsed);
      } catch (e) {
        console.error('Failed to parse stored data:', e);
        setAllMonthsData({
          [currentMonthKey]: getEmptyMonthData(settings.defaultSalary)
        });
      }
    } else {
      setAllMonthsData({
        [currentMonthKey]: getEmptyMonthData(settings.defaultSalary)
      });
    }
  }, []);
  // Save all months data
  useEffect(() => {
    if (Object.keys(allMonthsData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allMonthsData));
    }
  }, [allMonthsData]);
  // Check for payday prompt - UPDATED LOGIC
  useEffect(() => {
    const checkPaydayPrompt = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      // Only check if we're viewing the current month
      if (currentMonthKey !== currentMonthYear) {
        return;
      }
      // Check if it's on or after the 25th
      if (currentDay >= 25) {
        const lastConfirmed = currentData.lastPaydayConfirmed;
        const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        // Only skip prompt if user has CONFIRMED payday for this month
        // If they clicked "Not Yet", lastPaydayConfirmed won't be updated, so prompt will show again
        if (!lastConfirmed || !lastConfirmed.startsWith(currentYearMonth)) {
          setIsPaydayPromptOpen(true);
        }
      }
    };
    const timer = setTimeout(checkPaydayPrompt, 500);
    return () => clearTimeout(timer);
  }, [currentMonthKey, currentData.lastPaydayConfirmed]);
  const updateCurrentMonth = (updater: (prev: FinancialData) => FinancialData) => {
    setAllMonthsData(prev => ({
      ...prev,
      [currentMonthKey]: updater(prev[currentMonthKey] || getEmptyMonthData(settings.defaultSalary))
    }));
  };
  const calculateRemainingFunds = () => {
    if (!currentData.monthlySalary) return 0;
    const totalBillsSpent = currentData.monthlyBills.reduce((sum, b) => sum + b.spent, 0);
    const totalExpenses = currentData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const manualSavingsThisMonth = currentData.transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);
    return currentData.monthlySalary + currentData.extraFunds - totalBillsSpent - totalExpenses - manualSavingsThisMonth;
  };
  const handlePaydayYes = () => {
    const remaining = calculateRemainingFunds();
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    // Add remaining to savings if positive
    if (remaining > 0) {
      const savingsTransaction: Transaction = {
        id: `trans-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString(),
        type: 'savings',
        category: 'Auto-Save from Previous Month',
        amount: remaining,
        note: 'Automatic savings from leftover funds',
        itemId: 'savings'
      };
      updateCurrentMonth(prev => ({
        ...prev,
        totalSavings: prev.totalSavings + remaining,
        transactions: [...prev.transactions, savingsTransaction],
        lastPaydayConfirmed: todayKey // Only set when confirmed
      }));
    } else {
      updateCurrentMonth(prev => ({
        ...prev,
        lastPaydayConfirmed: todayKey // Only set when confirmed
      }));
    }
    // Move to next month
    const nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
    if (!allMonthsData[nextMonthKey]) {
      const newMonthData: FinancialData = {
        ...getEmptyMonthData(settings.defaultSalary),
        totalSavings: currentData.totalSavings + (remaining > 0 ? remaining : 0),
        goals: currentData.goals.map(g => ({
          ...g
        }))
      };
      setAllMonthsData(prev => ({
        ...prev,
        [nextMonthKey]: newMonthData
      }));
    }
    setCurrentMonthKey(nextMonthKey);
    setIsPaydayPromptOpen(false);
  };
  const handlePaydayNo = () => {
    // Don't update lastPaydayConfirmed - this allows prompt to show again tomorrow
    setIsPaydayPromptOpen(false);
  };
  return <BrowserRouter>
      <div className="min-h-screen bg-dark-bg">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard currentMonthKey={currentMonthKey} setCurrentMonthKey={setCurrentMonthKey} allMonthsData={allMonthsData} setAllMonthsData={setAllMonthsData} settings={settings} setSettings={setSettings} currentData={currentData} updateCurrentMonth={updateCurrentMonth} />} />
          <Route path="/analytics" element={<Analytics allMonthsData={allMonthsData} settings={settings} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PaydayPrompt isOpen={isPaydayPromptOpen} onYes={handlePaydayYes} onNo={handlePaydayNo} remainingAmount={calculateRemainingFunds()} />
      </div>
    </BrowserRouter>;
}