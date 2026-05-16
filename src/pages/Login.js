import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_CREDENTIALS = {
  email: 'admin@ethara.com',
  password: 'admin123',
};

const ADMIN_CODE = 'admin2024';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleAdminCode = async (e) => {
    e.preventDefault();
    if (adminCode !== ADMIN_CODE) {
      setError('Invalid admin code');
      return;
    }
    try {
      await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#4338ca]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#1e1b4b] mb-6">Acme Corp</h1>
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-600">Sign In</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-sm text-[#4338ca] font-medium hover:underline w-full text-center"
          >
            {showAdmin ? 'Cancel' : '🔑 Admin Access'}
          </button>

          {showAdmin && (
            <form onSubmit={handleAdminCode} className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Go
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Don't have an account? <Link to="/signup" className="text-[#4338ca] font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
