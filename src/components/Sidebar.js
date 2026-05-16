import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <h2 className="text-xl font-bold mb-8">Taskflow</h2>
      <nav className="flex flex-col gap-1 flex-1">
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

      <div className="border-t border-white/20 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm leading-tight">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-white/60">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
