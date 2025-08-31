import React from 'react';

export const DashboardStats = ({ account }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Stats</h2>
      <p className="text-gray-600 dark:text-gray-400">Account Balance: {account?.balance}</p>
    </div>
  );
};

export default DashboardStats;
