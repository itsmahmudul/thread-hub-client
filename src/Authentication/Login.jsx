import React, { useState } from 'react';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router';
import SocialLogin from './SocialLogin';

const Login = () => {
  const { signInUser } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Login to ThreadHub</h2>

        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm text-gray-500 font-medium bg-white px-4">
            OR
          </div>
        </div>

        <SocialLogin />

        <p className="mt-8 text-center text-sm text-gray-600">
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
