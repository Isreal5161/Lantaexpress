import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border shadow-sm p-5 flex items-center justify-between rounded-lg min-h-[140px] sm:min-h-[160px]">
      {/* Content */}
      <div>
        <p className="text-sm sm:text-base text-slate-500">{title}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{value}</h2>
      </div>
      {/* Icon */}
      <div className="text-green-600 text-3xl sm:text-4xl">{icon}</div>
    </div>
  );
}