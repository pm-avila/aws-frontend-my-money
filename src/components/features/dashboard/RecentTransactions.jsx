import React from 'react';

export const RecentTransactions = ({ transactions }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h2>
      <ul>
        {transactions?.map(t => (
          <li key={t.id} className="text-gray-600 dark:text-gray-400">{t.description}: {t.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
