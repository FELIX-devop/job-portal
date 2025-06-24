import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, User, Lock, Mail, Phone } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('WORKER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
        role,
      });
      const user = res.data.user;
      // Ensure MongoDB _id is always available as 'id'
      const userWithId = { ...user, id: user._id || user.id };
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userWithId));
      if (userWithId.role === 'WORKER') {
        navigate('/worker/dashboard');
      } else {
        navigate('/contractor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full">
              <Building2 size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-700 mb-2">Maze the ace</h1>
          <p className="text-gray-600">Rural Job Portal</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input
                type="email"
                className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type="password"
                className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <select
                className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="WORKER">Worker</option>
                <option value="CONTRACTOR">Contractor</option>
              </select>
            </div>
          </div>
          {error && <div className="text-error-600 text-sm bg-error-50 p-3 rounded-lg border border-error-200">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          New user?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 underline font-medium transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 