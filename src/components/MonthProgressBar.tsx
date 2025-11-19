import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function MonthProgressBar() {
  const [progress, setProgress] = useState(0)
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date()
      const currentDay = now.getDate()
      
      let lastPayday = new Date(now.getFullYear(), now.getMonth(), 25)
      let nextPayday = new Date(now.getFullYear(), now.getMonth() + 1, 25)

      if (currentDay < 25) {
        lastPayday = new Date(now.getFullYear(), now.getMonth() - 1, 25)
        nextPayday = new Date(now.getFullYear(), now.getMonth(), 25)
      }

      const totalDuration = nextPayday.getTime() - lastPayday.getTime()
      const elapsed = now.getTime() - lastPayday.getTime()
      
      const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
      const daysRemaining = Math.ceil((nextPayday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      setProgress(percentage)
      setDaysLeft(daysRemaining)
    }

    calculateProgress()
    const timer = setInterval(calculateProgress, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-xs text-text-secondary">
        <span>Next Payday</span>
        <span>{daysLeft} days left</span>
      </div>
      <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-sage"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
