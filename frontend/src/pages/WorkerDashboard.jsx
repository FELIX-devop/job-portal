import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Briefcase, MessageSquare, LogOut, Phone, MapPin, Star, Edit, X, Building2, Users, Award, Clock, Mail, DollarSign } from 'lucide-react';

const WorkerDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    location: '',
    skills: [],
    experience: '',
    dailyRate: '',
    description: '',
    availability: 'Available',
    available: true
  });
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'WORKER') {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchJobOffers(userData.id);
  }, [navigate]);

  const fetchJobOffers = async (workerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/job-offers/worker/${workerId}`);
      setJobOffers(response.data);
    } catch (error) {
      console.error('Error fetching job offers:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleJobOfferResponse = async (offerId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/job-offers/${offerId}/status?status=${status}`);
      fetchJobOffers(user.id);
    } catch (error) {
      console.error('Error updating job offer:', error);
    }
  };

  const handleEditProfile = () => {
    setEditData({
      name: user.name,
      phone: user.phone,
      location: user.location || '',
      skills: user.skills || [],
      experience: user.experience || '',
      dailyRate: user.dailyRate || '',
      description: user.description || '',
      availability: user.availability || 'Available',
      available: user.available !== false
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/workers/${user.id}`, editData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData({
        ...editData,
        skills: [...editData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg">
                <Building2 size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary-700">Maze the ace</h1>
              <span className="text-sm text-gray-500">Worker Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'offers'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Briefcase size={16} />
            <span>Job Offers</span>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'inbox'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={16} />
            <span>Inbox</span>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User size={16} className="mr-2 text-primary-600" />
                  Name
                </label>
                <p className="text-gray-800">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail size={16} className="mr-2 text-primary-600" />
                  Email
                </label>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone size={16} className="mr-2 text-primary-600" />
                  Phone
                </label>
                <p className="text-gray-800 flex items-center">
                  <Phone size={16} className="mr-2" />
                  {user.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2 text-primary-600" />
                  Location
                </label>
                <p className="text-gray-800 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {user.location || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Briefcase size={16} className="mr-2 text-primary-600" />
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign size={16} className="mr-2 text-primary-600" />
                  Daily Rate
                </label>
                <p className="text-gray-800">₹{user.dailyRate || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Award size={16} className="mr-2 text-primary-600" />
                  Experience
                </label>
                <p className="text-gray-800 flex items-center">
                  <Star size={16} className="mr-2" />
                  {user.experience || 'Not specified'} years
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-2 text-primary-600" />
                  Availability
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.availability === 'Available' 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {user.availability}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Job Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Job Offers</h2>
            {jobOffers.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No job offers yet</p>
              </div>
            ) : (
              jobOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{offer.contractorName}</h3>
                      <p className="text-gray-600">{offer.jobDetails}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      offer.status === 'PENDING' 
                        ? 'bg-warning-100 text-warning-800' 
                        : offer.status === 'ACCEPTED'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-800">{offer.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rate</label>
                      <p className="text-gray-800">₹{offer.offeredRate}/day</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <p className="text-gray-800">{offer.duration}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{offer.message}</p>
                  {offer.status === 'PENDING' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleJobOfferResponse(offer.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleJobOfferResponse(offer.id, 'REJECTED')}
                        className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Inbox</h2>
            <div className="space-y-4">
              {user.inbox?.length > 0 ? (
                user.inbox.map((message) => (
                  <div key={message.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{message.fromUserName}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">No messages yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-dark-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Experience (years)</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.experience}
                  onChange={(e) => setEditData({...editData, experience: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Daily Rate (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.dailyRate}
                  onChange={(e) => setEditData({...editData, dailyRate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Availability</label>
                <select
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  value={editData.availability}
                  onChange={(e) => setEditData({...editData, availability: e.target.value})}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full flex items-center"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                rows="3"
                className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                placeholder="Describe your work experience and specialties..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard; 