import React from 'react';

interface DailyLogisticsCardProps {
  className?: string;
  label?: string;
  headline?: string;
  description?: string;
}

export default function DailyLogisticsCard({
  className = '',
  label = 'DAILY LOGISTICS',
  headline = '94% of Orders Dispatched',
  description = "Out of today's harvest transactions, 312 orders are successfully in transit between farmers and retailers.",
}: DailyLogisticsCardProps) {
  return (
    <div className={`w-full rounded-2xl bg-[#1E4D1E] p-6 text-white shadow-md ${className}`}>
      <div className="inline-block bg-white/10 text-[#a9d5b2] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {label}
      </div>

      <h3 className="mt-6 text-2xl font-extrabold leading-snug text-white">
        {headline}
      </h3>

      <p className="mt-3 text-sm text-[#c7e7cf]">
        {description}
      </p>
    </div>
  );
}
