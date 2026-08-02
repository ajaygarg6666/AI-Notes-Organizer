import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/subjects', label: 'Subjects', icon: '📁' },
  { to: '/upload', label: 'Upload Note', icon: '⬆️' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
];

const Sidebar = () => (
  <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface-dark">
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-700/20 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`
          }
        >
          <span>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
