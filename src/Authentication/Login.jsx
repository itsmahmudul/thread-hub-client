import React, { useState } from 'react';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router';
import SocialLogin from './SocialLogin';

const Login = () => {
  const { signInUser, darkMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    signInUser(email, password)
      .then((res) => {
        toast.success(`Welcome back, ${res.user?.displayName || 'User'}!`);
        navigate('/'); // Redirect to home page
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to login');
      });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 sm:py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className={`w-full max-w-md space-y-8 p-8 rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700 shadow-black text-gray-200' : 'bg-white border-gray-200 text-gray-900'
        }`}>
        <h2 className="text-3xl font-extrabold text-center">
          Login to ThreadHub
        </h2>

        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`mt-1 block w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition ${darkMode
                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-400'
                  : 'bg-white border-gray-300 placeholder-gray-400 text-gray-700 focus:ring-blue-500'
                }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition ${darkMode
                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:ring-blue-400'
                  : 'bg-white border-gray-300 placeholder-gray-400 text-gray-700 focus:ring-blue-500'
                }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          >
            Log In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}></div>
          </div>
          <div className={`relative flex justify-center text-sm font-medium bg-white px-4 ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'
            }`}>
            OR
          </div>
        </div>

        <SocialLogin />

        <p className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
          Don’t have an account?{' '}
          <Link
            to="/signUp"
            className="font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:underline transition"
          >
            Join Us
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
