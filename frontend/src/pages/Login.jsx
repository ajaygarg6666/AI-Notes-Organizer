import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-surface-dark">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-surface-dark">
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Welcome back</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <button type="submit" className="w-full rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          Log in
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          No account? <Link to="/signup" className="text-primary-600 font-medium">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
