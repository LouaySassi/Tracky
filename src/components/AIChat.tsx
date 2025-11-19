import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiClient } from '../api/client';
import { FinancialData, MonthlyBillItem, Transaction } from '../types';

interface AIChatProps {
  currentData: FinancialData;
  onUpdateData: (newData: FinancialData) => void;
  onAddMonthlyBill: (bill: MonthlyBillItem) => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function AIChat({ currentData, onUpdateData, onAddMonthlyBill }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Wait for animation
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    // Optimistically add user message
    const newMessages = [...messages, { role: 'user', text: userMessage } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await apiClient.chatWithAI(userMessage, currentData, messages);
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);

      if (response.actions && response.actions.length > 0) {
        let newData = { ...currentData };
        let actionsPerformed = 0;

        for (const action of response.actions) {
          try {
            switch (action.type) {
              case 'ADD_BILL': {
                if (!action.data?.name || !action.data?.budget) {
                  break;
                }
                const bill: MonthlyBillItem = {
                  id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: action.data.name,
                  budget: action.data.budget,
                  spent: 0,
                  isPaid: false,
                }
                onAddMonthlyBill(bill)
                newData.monthlyBills = [...newData.monthlyBills, bill]
                actionsPerformed++;
                break;
              }
              case 'REMOVE_BILL':
                newData.monthlyBills = newData.monthlyBills.filter(b => b.id !== action.id);
                actionsPerformed++;
                break;
              case 'UPDATE_BILL':
                newData.monthlyBills = newData.monthlyBills.map(b => 
                  b.id === action.id ? { ...b, ...action.data } : b
                );
                actionsPerformed++;
                break;
              case 'ADD_BILL_PAYMENT': {
                const bill = newData.monthlyBills.find((b) => b.id === action.id);
                const amount = action.data?.amount;
                if (!bill || !amount || amount <= 0) {
                  break;
                }
                const payment: Transaction = {
                  id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  date: new Date().toISOString(),
                  type: 'bill',
                  category: bill.name,
                  amount,
                  note: action.data?.note,
                  itemId: bill.id,
                };
                newData.monthlyBills = newData.monthlyBills.map((b) =>
                  b.id === bill.id ? { ...b, spent: b.spent + amount } : b
                );
                newData.transactions = [...newData.transactions, payment];
                actionsPerformed++;
                break;
              }
              case 'ADD_GOAL':
                newData.goals = [...newData.goals, {
                  id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: action.data.name,
                  totalAmount: action.data.totalAmount,
                  currentAmount: 0,
                  monthlyPayment: action.data.monthlyPayment
                }];
                actionsPerformed++;
                break;
              case 'REMOVE_GOAL':
                newData.goals = newData.goals.filter(g => g.id !== action.id);
                actionsPerformed++;
                break;
              case 'UPDATE_GOAL':
                newData.goals = newData.goals.map(g => 
                  g.id === action.id ? { ...g, ...action.data } : g
                );
                actionsPerformed++;
                break;
              case 'ADD_EXPENSE':
                newData.expenses = [...newData.expenses, {
                  id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: action.data.name,
                  amount: action.data.amount,
                  date: new Date().toISOString()
                }];
                actionsPerformed++;
                break;
              case 'UPDATE_SALARY':
                newData.monthlySalary = action.amount;
                actionsPerformed++;
                break;
            }
          } catch (err) {
            console.error('Error executing action:', action, err);
          }
        }

        if (actionsPerformed > 0) {
          onUpdateData(newData);
        }
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop for click outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-dark-card rounded-2xl shadow-2xl flex flex-col z-50 border border-dark-border overflow-hidden transition-all duration-300 origin-bottom-right ${
        isOpen 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="p-4 bg-dark-card border-b border-dark-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-text-primary">Tracky AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-dark-card-hover p-1 rounded text-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg/95">
          {messages.length === 0 && (
            <div className="text-center text-text-muted mt-10">
              <div className="w-12 h-12 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-3 border border-dark-border">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-text-primary font-medium">Hi! I'm Tracky AI.</p>
              <p className="text-sm mt-2">Ask me about your budget, or tell me to add bills and goals!</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-dark-card border border-dark-border text-text-primary rounded-bl-none'
              }`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-indigo-300" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-card border border-dark-border p-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-dark-card border-t border-dark-border">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask something..."
              className="w-full pl-4 pr-12 py-3 bg-dark-bg border border-dark-border text-text-primary rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none scrollbar-hide placeholder-text-muted"
              style={{ minHeight: '50px', maxHeight: '100px' }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
