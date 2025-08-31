import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-500">My Money</h2>
      </div>
      <nav className="mt-6">
        <Link to="/" className="block px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
        <Link to="/transactions" className="block px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">Transactions</Link>
        <Link to="/categories" className="block px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">Categories</Link>
        <Link to="/reports" className="block px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">Reports</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
