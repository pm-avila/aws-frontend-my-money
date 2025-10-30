import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">My Money 2</h1>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Olá, {user?.name}
        </span>
        <ThemeToggle />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;
