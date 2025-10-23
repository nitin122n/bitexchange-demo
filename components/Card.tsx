'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`
      card
      ${hover ? 'hover:shadow-lg' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className = '' }: StatCardProps) {
  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-muted-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${
              change.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.isPositive ? '+' : ''}{change.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
    </Card>
  );
}
