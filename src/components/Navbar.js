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

  if (!user) return null;

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold">Ethara</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-indigo-200">Dashboard</Link>
            <Link to="/projects" className="hover:text-indigo-200">Projects</Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-indigo-500">
              <span className="text-sm">
                {user.name}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-500">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
