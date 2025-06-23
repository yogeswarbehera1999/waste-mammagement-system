import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, MapPin, Menu } from 'lucide-react';
import ComplaintForm from './forms/ComplaintForm';
import VehicleTracker from './VehicleTracker';
import DataTable from './DataTable';
import api from '../services/api';

const CitizenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'complaint' | 'track'>('complaint');
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleComplaintSubmit = () => {
    setShowForm(false);
    fetchComplaints();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'citizenName', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'area', label: 'Area' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Citizen Dashboard</h1>
              <p className="text-green-600">Report and track waste management issues</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-green-700 hover:bg-green-100 rounded"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={logout}
                className="hidden md:flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-2 mb-6">
            <button
              onClick={() => {
                setActiveTab('complaint');
                setMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 rounded-md font-medium ${
                activeTab === 'complaint' ? 'bg-green-500 text-white' : 'text-gray-700 bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Post Complaint
            </button>
            <button
              onClick={() => {
                setActiveTab('track');
                setMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 rounded-md font-medium ${
                activeTab === 'track' ? 'bg-green-500 text-white' : 'text-gray-700 bg-gray-100'
              }`}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Track Vehicle
            </button>
            <button
              onClick={logout}
              className="md:hidden flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        )}

        {/* Tabs for Desktop */}
        <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('complaint')}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'complaint'
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Post Complaint
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'track'
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Track Vehicle
          </button>
        </div>

        {/* Content */}
        {activeTab === 'complaint' ? (
          <div className="space-y-6">
            {/* Post Complaint Section */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Report a Waste Management Issue
                </h2>
                <p className="text-gray-600 mb-6">
                  Help us keep our city clean by reporting waste management problems
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Post New Complaint
                </button>
              </div>
            </div>

            {/* My Complaints */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100">
              <div className="p-6 border-b border-green-100">
                <h3 className="text-lg font-semibold text-green-800">My Complaints</h3>
                <p className="text-gray-600">Track the status of your submitted complaints</p>
              </div>
              <div className="p-6">
                <DataTable data={complaints} columns={columns} />
              </div>
            </div>
          </div>
        ) : (
          <VehicleTracker />
        )}
      </div>

      {/* Complaint Form Modal */}
      {showForm && (
        <ComplaintForm
          onClose={() => setShowForm(false)}
          onSubmit={handleComplaintSubmit}
        />
      )}
    </div>
  );
};

export default CitizenDashboard;
