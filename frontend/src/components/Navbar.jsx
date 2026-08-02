import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-surface-dark">
      <Link to="/" className="font-display text-lg font-semibold text-primary-600">
        📚 Notes Organizer
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/search" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300">
          Search
        </Link>
        <Link to="/analytics" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300">
          Analytics
        </Link>
        {user && (
          <>
            <span className="text-sm text-gray-500">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
