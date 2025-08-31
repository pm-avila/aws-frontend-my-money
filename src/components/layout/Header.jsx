import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">My Money</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header;
