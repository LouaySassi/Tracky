import React from 'react';
import { CalendarIcon } from 'lucide-react';
export function MonthProgressBar() {
  const now = new Date();
  const currentDay = now.getDate();
  const payday = 25;
  // Calculate progress (1st to 25th)
  const progress = Math.min(currentDay / payday * 100, 100);
  // Format date
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  // Days until payday
  const daysUntilPayday = currentDay <= payday ? payday - currentDay : payday + (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - currentDay);
  return <div className="bg-dark-card rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-sage" />
          <div>
            <p className="text-sm text-text-muted">Today</p>
            <p className="text-lg font-bold text-text-primary">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Days until payday</p>
          <p className="text-2xl font-bold text-sage">{daysUntilPayday}</p>
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-dark-bg rounded-full h-3">
          <div className="bg-gradient-to-r from-sage to-sage-light h-3 rounded-full transition-all duration-500" style={{
          width: `${progress}%`
        }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>1st</span>
          <span className="text-sage font-medium">Day {currentDay}</span>
          <span>25th (Payday)</span>
        </div>
      </div>
    </div>;
}