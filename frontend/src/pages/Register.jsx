import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, User, Lock, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, FileText } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'WORKER',
    // Worker specific fields
    skills: [],
    location: '',
    availability: 'Available',
    experience: '',
    dailyRate: '',
    description: '',
    // Contractor specific fields
    companyName: '',
    businessType: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full">
              <Building2 size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-700 mb-2">Maze the ace</h1>
          <p className="text-gray-600">Join our rural job portal</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>
        
        {error && <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700">{error}</div>}
        {success && <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg text-success-700">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.phone}
                  onChange={handleChange}
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
                  name="password"
                  className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.password}
                  onChange={handleChange}
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
                  name="role"
                  className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="WORKER">Worker</option>
                  <option value="CONTRACTOR">Contractor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Worker Specific Fields */}
          {formData.role === 'WORKER' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-primary-700">Worker Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="skills"
                      placeholder="e.g., Masonry, Carpentry, Plumbing"
                      className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={formData.skills.join(', ')}
                      onChange={handleSkillChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <select
                      name="availability"
                      className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={formData.availability}
                      onChange={handleChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="experience"
                      className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="dailyRate"
                      className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={formData.dailyRate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    rows="3"
                    className="mt-1 block w-full pl-10 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contractor Specific Fields */}
          {formData.role === 'CONTRACTOR' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-primary-700">Contractor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={formData.businessType}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows="3"
                  className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 underline font-medium transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 