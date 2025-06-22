import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-md transition-colors border border-dark-700"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-md transition-colors"
          >
            <Home size={16} />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 