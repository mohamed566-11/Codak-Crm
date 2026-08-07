import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientHeader?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, gradientHeader, ...props }) => {
  return (
    <div
      className={clsx(
        'relative rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-linear transition-all duration-300 hover:border-slate-700/80 hover:shadow-stripe overflow-hidden',
        className
      )}
      {...props}
    >
      {gradientHeader && (
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-accent to-purple-500" />
      )}
      {children}
    </div>
  );
};
