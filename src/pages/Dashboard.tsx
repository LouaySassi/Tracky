import React, { useState } from 'react';
import { HistoryIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from 'lucide-react';
import { FinancialData, MonthlyBillItem, Goal, Expense, Transaction, GlobalSettings } from '../types';
import { RemainingFunds } from '../components/RemainingFunds';
import { SalaryInput } from '../components/SalaryInput';
import { BillCard } from '../components/BillCard';
import { SimpleSavingsCard } from '../components/SimpleSavingsCard';
import { ExpensesList } from '../components/ExpensesList';
import { GoalsSection } from '../components/GoalsSection';
import { TransactionHistory } from '../components/TransactionHistory';
import { MonthProgressBar } from '../components/MonthProgressBar';
import { MonthlyAnalytics } from '../components/MonthlyAnalytics';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
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
interface DashboardProps {
  currentMonthKey: string;
  setCurrentMonthKey: (key: string) => void;
  allMonthsData: MonthlyDataStore;
  setAllMonthsData: React.Dispatch<React.SetStateAction<MonthlyDataStore>>;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  currentData: FinancialData;
  updateCurrentMonth: (updater: (prev: FinancialData) => FinancialData) => void;
}
export function Dashboard({
  currentMonthKey,
  setCurrentMonthKey,
  allMonthsData,
  setAllMonthsData,
  settings,
  setSettings,
  currentData,
  updateCurrentMonth
}: DashboardProps) {
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isExtraFundsModalOpen, setIsExtraFundsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [newBillBudget, setNewBillBudget] = useState('');
  const [extraFundsAmount, setExtraFundsAmount] = useState('');
  const [extraFundsNote, setExtraFundsNote] = useState('');
  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    const date = new Date(year, month - 1);
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const newKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonthKey(newKey);
    if (!allMonthsData[newKey]) {
      setAllMonthsData(prev => ({
        ...prev,
        [newKey]: getEmptyMonthData(settings.defaultSalary)
      }));
    }
  };
  const getCurrentMonthName = () => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  const getPreviousMonthData = () => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    const prevDate = new Date(year, month - 2);
    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    return allMonthsData[prevKey];
  };
  const handleUpdateDefaultSalary = (salary: number) => {
    setSettings({
      ...settings,
      defaultSalary: salary
    });
    updateCurrentMonth(prev => ({
      ...prev,
      monthlySalary: salary
    }));
  };
  const handleAddExtraFunds = () => {
    const amount = parseFloat(extraFundsAmount);
    if (amount > 0) {
      const transaction: Transaction = {
        id: `trans-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString(),
        type: 'extra-funds',
        category: 'Extra Funds',
        amount,
        note: extraFundsNote.trim() || undefined,
        itemId: 'extra-funds'
      };
      updateCurrentMonth(prev => ({
        ...prev,
        extraFunds: prev.extraFunds + amount,
        transactions: [...prev.transactions, transaction]
      }));
      setExtraFundsAmount('');
      setExtraFundsNote('');
      setIsExtraFundsModalOpen(false);
    }
  };
  const handleUpdateBillBudget = (id: string, budget: number) => {
    updateCurrentMonth(prev => ({
      ...prev,
      monthlyBills: prev.monthlyBills.map(bill => bill.id === id ? {
        ...bill,
        budget
      } : bill)
    }));
  };
  const handleAddBill = () => {
    const budget = parseFloat(newBillBudget);
    if (newBillName.trim() && budget > 0) {
      const newBill: MonthlyBillItem = {
        id: `bill-${Date.now()}-${Math.random()}`,
        name: newBillName.trim(),
        budget,
        spent: 0,
        isPaid: false
      };
      updateCurrentMonth(prev => ({
        ...prev,
        monthlyBills: [...prev.monthlyBills, newBill]
      }));
      setNewBillName('');
      setNewBillBudget('');
      setIsAddBillOpen(false);
    }
  };
  const handleRemoveBill = (id: string) => {
    updateCurrentMonth(prev => ({
      ...prev,
      monthlyBills: prev.monthlyBills.filter(b => b.id !== id),
      transactions: prev.transactions.filter(t => t.itemId !== id)
    }));
  };
  const handleAddBillPayment = (id: string, amount: number, note?: string) => {
    updateCurrentMonth(prev => {
      const bill = prev.monthlyBills.find(b => b.id === id);
      if (!bill) return prev;
      const transaction: Transaction = {
        id: `trans-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString(),
        type: 'bill',
        category: bill.name,
        amount,
        note,
        itemId: id
      };
      const updatedBills = prev.monthlyBills.map(b => b.id === id ? {
        ...b,
        spent: b.spent + amount
      } : b);
      let updatedGoals = prev.goals;
      if (bill.linkedGoalId) {
        updatedGoals = prev.goals.map(g => g.id === bill.linkedGoalId ? {
          ...g,
          currentAmount: Math.min(g.currentAmount + amount, g.totalAmount)
        } : g);
      }
      return {
        ...prev,
        monthlyBills: updatedBills,
        goals: updatedGoals,
        transactions: [...prev.transactions, transaction]
      };
    });
  };
  const handleAddExpense = (name: string, amount: number) => {
    const newExpense: Expense = {
      id: `expense-${Date.now()}-${Math.random()}`,
      name: name.trim(),
      amount,
      date: new Date().toISOString()
    };
    const transaction: Transaction = {
      id: `trans-${Date.now()}-${Math.random()}`,
      date: new Date().toISOString(),
      type: 'expense',
      category: name.trim(),
      amount,
      itemId: newExpense.id
    };
    updateCurrentMonth(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
      transactions: [...prev.transactions, transaction]
    }));
  };
  const handleRemoveExpense = (id: string) => {
    updateCurrentMonth(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
      transactions: prev.transactions.filter(t => t.itemId !== id)
    }));
  };
  const handleAddToSavings = (amount: number) => {
    const transaction: Transaction = {
      id: `trans-${Date.now()}-${Math.random()}`,
      date: new Date().toISOString(),
      type: 'savings',
      category: 'Personal Savings',
      amount,
      itemId: 'savings'
    };
    updateCurrentMonth(prev => ({
      ...prev,
      totalSavings: prev.totalSavings + amount,
      transactions: [...prev.transactions, transaction]
    }));
  };
  const handleAddGoal = (name: string, totalAmount: number, monthlyPayment: number) => {
    const goalId = `goal-${Date.now()}-${Math.random()}`;
    const newGoal: Goal = {
      id: goalId,
      name,
      totalAmount,
      currentAmount: 0,
      monthlyPayment
    };
    const newBill: MonthlyBillItem = {
      id: `bill-${Date.now()}-${Math.random()}`,
      name: `${name} Payment`,
      budget: monthlyPayment,
      spent: 0,
      isPaid: false,
      linkedGoalId: goalId
    };
    updateCurrentMonth(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
      monthlyBills: [...prev.monthlyBills, newBill]
    }));
  };
  const handleRemoveGoal = (id: string) => {
    updateCurrentMonth(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      monthlyBills: prev.monthlyBills.filter(b => b.linkedGoalId !== id)
    }));
  };
  const handleUpdateGoalMonthlyPayment = (id: string, payment: number) => {
    updateCurrentMonth(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? {
        ...g,
        monthlyPayment: payment
      } : g),
      monthlyBills: prev.monthlyBills.map(b => b.linkedGoalId === id ? {
        ...b,
        budget: payment
      } : b)
    }));
  };
  const handleDeleteTransaction = (transactionId: string) => {
    updateCurrentMonth(prev => {
      const transaction = prev.transactions.find(t => t.id === transactionId);
      if (!transaction) return prev;
      let updatedData = {
        ...prev
      };
      if (transaction.type === 'bill') {
        updatedData.monthlyBills = prev.monthlyBills.map(b => {
          if (b.id === transaction.itemId) {
            const bill = {
              ...b,
              spent: Math.max(0, b.spent - transaction.amount)
            };
            if (bill.linkedGoalId) {
              updatedData.goals = prev.goals.map(g => g.id === bill.linkedGoalId ? {
                ...g,
                currentAmount: Math.max(0, g.currentAmount - transaction.amount)
              } : g);
            }
            return bill;
          }
          return b;
        });
      } else if (transaction.type === 'expense') {
        updatedData.expenses = prev.expenses.filter(e => e.id !== transaction.itemId);
      } else if (transaction.type === 'savings') {
        updatedData.totalSavings = Math.max(0, prev.totalSavings - transaction.amount);
      } else if (transaction.type === 'extra-funds') {
        updatedData.extraFunds = Math.max(0, prev.extraFunds - transaction.amount);
      }
      updatedData.transactions = prev.transactions.filter(t => t.id !== transactionId);
      return updatedData;
    });
  };
  const getTransactionsForItem = (itemId: string) => {
    return currentData.transactions.filter(t => t.itemId === itemId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  const getAllSavingsTransactions = () => {
    return Object.values(allMonthsData).flatMap(data => data.transactions).filter(t => t.type === 'savings').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  const calculateRemainingFunds = () => {
    if (!currentData.monthlySalary) return 0;
    const totalBillsSpent = currentData.monthlyBills.reduce((sum, b) => sum + b.spent, 0);
    const totalExpenses = currentData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const manualSavingsThisMonth = currentData.transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);
    return currentData.monthlySalary + currentData.extraFunds - totalBillsSpent - totalExpenses - manualSavingsThisMonth;
  };
  const isCurrentMonth = () => {
    const now = new Date();
    const nowKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return currentMonthKey === nowKey;
  };
  return <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-dark-card rounded-lg transition-colors">
          <ChevronLeftIcon className="w-6 h-6 text-text-secondary" />
        </button>
        <h1 className="text-3xl font-bold text-text-primary">
          {getCurrentMonthName()}
        </h1>
        <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-dark-card rounded-lg transition-colors">
          <ChevronRightIcon className="w-6 h-6 text-text-secondary" />
        </button>
      </div>
      {isCurrentMonth() && <MonthProgressBar />}
      <MonthlyAnalytics currentMonthData={currentData} previousMonthData={getPreviousMonthData()} />
      <div className="mb-12">
        <RemainingFunds amount={calculateRemainingFunds()} salary={currentData.monthlySalary || 0} extraFunds={currentData.extraFunds} onUpdateSalary={() => setIsSalaryModalOpen(true)} onAddExtraFunds={() => setIsExtraFundsModalOpen(true)} />
      </div>
      {/* Monthly Bills Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Monthly Bills
          </h2>
          <Button onClick={() => setIsAddBillOpen(true)} variant="secondary" size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.monthlyBills.map(bill => <BillCard key={bill.id} bill={bill} transactions={getTransactionsForItem(bill.id)} onUpdateBudget={budget => handleUpdateBillBudget(bill.id, budget)} onAddPayment={(amount, note) => handleAddBillPayment(bill.id, amount, note)} onDeleteTransaction={handleDeleteTransaction} onRemove={() => handleRemoveBill(bill.id)} />)}
        </div>
      </div>
      <div className="mb-8">
        <ExpensesList expenses={currentData.expenses} onAddExpense={handleAddExpense} onRemoveExpense={handleRemoveExpense} />
      </div>
      <div className="mb-8">
        <SimpleSavingsCard totalSavings={currentData.totalSavings} allTransactions={getAllSavingsTransactions()} onAddToSavings={handleAddToSavings} onDeleteTransaction={handleDeleteTransaction} />
      </div>
      <div className="mb-8">
        <GoalsSection goals={currentData.goals} onAddGoal={handleAddGoal} onRemoveGoal={handleRemoveGoal} onUpdateMonthlyPayment={handleUpdateGoalMonthlyPayment} />
      </div>
      <div className="flex justify-center">
        <Button onClick={() => setIsHistoryOpen(true)} variant="ghost" size="lg">
          <HistoryIcon className="w-5 h-5 mr-2" />
          View Transaction History
        </Button>
      </div>
      {/* Modals */}
      <SalaryInput isOpen={isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(false)} onSave={handleUpdateDefaultSalary} currentSalary={settings.defaultSalary} />
      <Modal isOpen={isExtraFundsModalOpen} onClose={() => setIsExtraFundsModalOpen(false)} title="Extra Funds">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Add one-time extra funds for this month only (e.g., gift, bonus)
          </p>
          <Input type="number" value={extraFundsAmount} onChange={setExtraFundsAmount} placeholder="Amount" label="Amount" fullWidth autoFocus min={0} step={0.01} />
          <Input type="text" value={extraFundsNote} onChange={setExtraFundsNote} placeholder="Note (optional)" label="Note" fullWidth />
          <Button onClick={handleAddExtraFunds} fullWidth size="lg">
            Add Funds
          </Button>
          {currentData.transactions.filter(t => t.type === 'extra-funds').length > 0 && <div className="mt-6 pt-6 border-t border-dark-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">
                This Month's Extra Funds
              </h3>
              <div className="space-y-2">
                {currentData.transactions.filter(t => t.type === 'extra-funds').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => <div key={transaction.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-card-hover transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-400">
                            +${transaction.amount.toFixed(2)}
                          </span>
                          {transaction.note && <span className="text-xs text-text-muted">
                              • {transaction.note}
                            </span>}
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteTransaction(transaction.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all" aria-label="Delete extra funds">
                        <Trash2Icon className="w-4 h-4 text-red-400" />
                      </button>
                    </div>)}
              </div>
            </div>}
        </div>
      </Modal>
      <TransactionHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} transactions={currentData.transactions} />
      <Modal isOpen={isAddBillOpen} onClose={() => setIsAddBillOpen(false)} title="Add Monthly Bill">
        <div className="space-y-4">
          <Input type="text" value={newBillName} onChange={setNewBillName} placeholder="Bill name (e.g., Internet)" label="Name" fullWidth />
          <Input type="number" value={newBillBudget} onChange={setNewBillBudget} placeholder="Monthly budget" label="Budget" fullWidth min={0} step={0.01} />
          <Button onClick={handleAddBill} fullWidth size="lg">
            Add Bill
          </Button>
        </div>
      </Modal>
    </div>;
}