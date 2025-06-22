import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Briefcase, MessageSquare, LogOut, Search, Phone, MapPin, Star, Send, RefreshCw, Building2, Users } from 'lucide-react';

const ContractorDashboard = () => {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showJobOfferModal, setShowJobOfferModal] = useState(false);
  const [jobOfferData, setJobOfferData] = useState({
    message: '',
    jobDetails: '',
    offeredRate: '',
    location: '',
    duration: '',
    sentVia: 'PORTAL'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'CONTRACTOR') {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchWorkers();
    fetchJobOffers(userData.id);
  }, [navigate]);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchJobOffers = async (contractorId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/job-offers/contractor/${contractorId}`);
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

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workers/search?skill=${searchTerm}`);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error searching workers:', error);
    }
  };

  const handleSendJobOffer = async () => {
    try {
      await axios.post(`http://localhost:8080/api/job-offers/send?contractorId=${user.id}`, {
        workerId: selectedWorker.id,
        ...jobOfferData
      });
      setShowJobOfferModal(false);
      setSelectedWorker(null);
      setJobOfferData({
        message: '',
        jobDetails: '',
        offeredRate: '',
        location: '',
        duration: '',
        sentVia: 'PORTAL'
      });
      fetchJobOffers(user.id);
    } catch (error) {
      console.error('Error sending job offer:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      fetchWorkers(); // Refresh workers data when switching to search tab
    }
  };

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    worker.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-sm text-gray-500">Contractor Dashboard</span>
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
            onClick={() => handleTabChange('search')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'search'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Search size={16} />
            <span>Search Workers</span>
          </button>
          <button
            onClick={() => handleTabChange('offers')}
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
            onClick={() => handleTabChange('inbox')}
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

        {/* Search Workers Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Search Workers</h2>
                <button
                  onClick={fetchWorkers}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search by name, skills, or location..."
                  className="flex-1 rounded-lg bg-gray-50 border-gray-300 text-gray-900 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <div key={worker.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <User size={20} className="text-primary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{worker.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      worker.available 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {worker.availability || (worker.available ? 'Available' : 'Busy')}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <Phone size={14} className="mr-2" />
                      {worker.phone}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-2" />
                      {worker.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Star size={14} className="mr-2" />
                      {worker.experience} years experience
                    </p>
                    <p className="text-gray-800 font-semibold">₹{worker.dailyRate}/day</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-1">
                      {worker.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedWorker(worker);
                      setShowJobOfferModal(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Job Offer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-secondary-400 mb-6">Sent Job Offers</h2>
            {jobOffers.length === 0 ? (
              <div className="bg-dark-800 rounded-lg p-8 text-center border border-dark-700">
                <Briefcase size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No job offers sent yet</p>
              </div>
            ) : (
              jobOffers.map((offer) => (
                <div key={offer.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{offer.workerName}</h3>
                      <p className="text-gray-400">{offer.jobDetails}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      offer.status === 'PENDING' 
                        ? 'bg-yellow-600 text-white' 
                        : offer.status === 'ACCEPTED'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Location</label>
                      <p className="text-white">{offer.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Rate</label>
                      <p className="text-white">₹{offer.offeredRate}/day</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Sent Via</label>
                      <p className="text-white">{offer.sentVia}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{offer.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-secondary-400 mb-6">Inbox</h2>
            <div className="space-y-4">
              {user.inbox?.length > 0 ? (
                user.inbox.map((message) => (
                  <div key={message.id} className="border-b border-dark-700 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{message.fromUserName}</h3>
                      <span className="text-sm text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No messages yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Offer Modal */}
      {showJobOfferModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Send Job Offer to {selectedWorker.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Job Details</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.jobDetails}
                  onChange={(e) => setJobOfferData({...jobOfferData, jobDetails: e.target.value})}
                  placeholder="e.g., House construction, 2 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.location}
                  onChange={(e) => setJobOfferData({...jobOfferData, location: e.target.value})}
                  placeholder="Job location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Daily Rate (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.offeredRate}
                  onChange={(e) => setJobOfferData({...jobOfferData, offeredRate: e.target.value})}
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                <input
                  type="text"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.duration}
                  onChange={(e) => setJobOfferData({...jobOfferData, duration: e.target.value})}
                  placeholder="e.g., 2 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  rows="3"
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.message}
                  onChange={(e) => setJobOfferData({...jobOfferData, message: e.target.value})}
                  placeholder="Describe the job and requirements..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Send Via</label>
                <select
                  className="w-full rounded-md bg-dark-700 border-dark-600 text-white shadow-sm focus:ring-secondary-500 focus:border-secondary-500"
                  value={jobOfferData.sentVia}
                  onChange={(e) => setJobOfferData({...jobOfferData, sentVia: e.target.value})}
                >
                  <option value="PORTAL">Portal Only</option>
                  <option value="SMS">SMS Only</option>
                  <option value="BOTH">Portal & SMS</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowJobOfferModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendJobOffer}
                className="flex-1 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md transition-colors"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard; 