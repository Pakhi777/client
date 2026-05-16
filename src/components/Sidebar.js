import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/team', label: 'Team' },
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <div className="w-60 min-h-screen bg-gradient-to-b from-[#1e1b4b] to-[#4338ca] text-white p-5 flex flex-col shrink-0">
      <h2 className="text-xl font-bold mb-8">Acme Corp</h2>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm transition ${
                isActive ? 'bg-white/20' : 'hover:bg-white/10'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
