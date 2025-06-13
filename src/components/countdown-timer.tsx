
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AlarmClock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  className, 
  textClassName, 
  iconClassName = 'h-5 w-5' 
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const targetTimestamp = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  useEffect(() => {
    if (!isClient) return;

    const calculateTimeLeft = () => {
      const difference = targetTimestamp - new Date().getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft()); // Initial calculation

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp, isClient]);

  if (!isClient || timeLeft === null) {
    return (
      <div className={`flex items-center space-x-1 font-headline ${className || ''} animate-pulse`}>
        <AlarmClock className={`${iconClassName}`} />
        <span className={`${textClassName || ''} text-xs`}>Chargement...</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0 && (targetTimestamp < new Date().getTime())) {
    return (
      <div className={`flex items-center space-x-2 font-headline ${className || ''}`}>
        <AlarmClock className={`${iconClassName} text-destructive`} />
        <span className={`text-destructive ${textClassName || ''}`}>Sondage Terminé !</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1.5 font-headline ${className || ''}`}>
      <AlarmClock className={`${iconClassName} text-accent`} />
      <div className={`flex items-baseline space-x-1 ${textClassName || ''}`}>
        {days > 0 && (
          <>
            <span>{days}</span><span className="text-xs">J</span>
            <span className="text-xs mx-0.5">:</span>
          </>
        )}
        <span>{String(hours).padStart(2, '0')}</span><span className="text-xs">H</span>
        <span className="text-xs mx-0.5">:</span>
        <span>{String(minutes).padStart(2, '0')}</span><span className="text-xs">M</span>
        <span className="text-xs mx-0.5">:</span>
        <span>{String(seconds).padStart(2, '0')}</span><span className="text-xs">S</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
