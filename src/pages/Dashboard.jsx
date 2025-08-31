import React, { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import DashboardStats from '../components/features/dashboard/DashboardStats';
import RecentTransactions from '../components/features/dashboard/RecentTransactions';
import BalanceChart from '../components/features/dashboard/BalanceChart';

export const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Since we don't have a backend, we'll use mock data.
        // In a real app, you'd make API calls here.
        const mockAccount = { balance: 12345.67 };
        const mockTransactions = [
          { id: 1, description: 'Groceries', amount: -50.25 },
          { id: 2, description: 'Salary', amount: 2000.00 },
          { id: 3, description: 'Rent', amount: -800.00 },
          { id: 4, description: 'Coffee', amount: -4.75 },
          { id: 5, description: 'Freelance work', amount: 300.00 },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setAccount(mockAccount);
        setRecentTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <DashboardStats account={account} />
      <BalanceChart />
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;
