import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, Wrench, MapPin, Package, ClipboardList, FileText, Menu
} from 'lucide-react';
import DefectForm from './forms/DefectForm';
import QubeForm from './forms/QubeForm';
import KhataForm from './forms/KhataForm';
import VehicleTracker from './VehicleTracker';
import DataTable from './DataTable';
import api from '../services/api';

const SupervisorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'defect' | 'track' | 'qube' | 'khata' | 'complaints'>('defect');
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState({
    defects: [],
    qubes: [],
    khatas: [],
    complaints: []
  });
  const { logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [defectsRes, qubesRes, khatasRes, complaintsRes] = await Promise.all([
        api.get('/defects'),
        api.get('/qubes'),
        api.get('/khata'),
        api.get('/complaints')
      ]);

      setData({
        defects: defectsRes.data,
        qubes: qubesRes.data,
        khatas: khatasRes.data,
        complaints: complaintsRes.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchData();
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

  const renderStatusBadge = (status: string) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );

  const renderDate = (date: string) => new Date(date).toLocaleDateString();

  const defectColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'machineName', label: 'Machine' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', render: renderStatusBadge },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const qubeColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'category', label: 'Category' },
    { key: 'cubeNumber', label: 'Cube #' },
    { key: 'status', label: 'Status', render: renderStatusBadge },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const khataColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'generation', label: 'Generation' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status', render: renderStatusBadge },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const complaintColumns = [
    { key: 'citizenName', label: 'Citizen' },
    { key: 'category', label: 'Category' },
    { key: 'area', label: 'Area' },
    { key: 'status', label: 'Status', render: renderStatusBadge },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const tabs = [
    { key: 'defect', label: 'Machinery Defect', icon: Wrench },
    { key: 'track', label: 'Track Vehicle', icon: MapPin },
    { key: 'qube', label: 'Qube Fulfillment', icon: Package },
    { key: 'khata', label: 'Mo Khata Entry', icon: ClipboardList },
    { key: 'complaints', label: 'Citizen Complaints', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'defect':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Report Machinery Defect
                </h2>
                <p className="text-gray-600 mb-6">
                  Report any issues with waste management machinery
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Report Defect
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-green-100">
              <div className="p-6 border-b border-green-100">
                <h3 className="text-lg font-semibold text-green-800">Machinery Defects</h3>
              </div>
              <div className="p-6">
                <DataTable data={data.defects} columns={defectColumns} />
              </div>
            </div>
          </div>
        );

      case 'track':
        return <VehicleTracker />;

      case 'qube':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Qube Fulfillment Report
                </h2>
                <p className="text-gray-600 mb-6">
                  Submit qube fulfillment information
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-green-100">
              <div className="p-6 border-b border-green-100">
                <h3 className="text-lg font-semibold text-green-800">Qube Reports</h3>
              </div>
              <div className="p-6">
                <DataTable data={data.qubes} columns={qubeColumns} />
              </div>
            </div>
          </div>
        );

      case 'khata':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Mo Khata Entry
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter Mo Khata generation and stock information
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Add Entry
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-green-100">
              <div className="p-6 border-b border-green-100">
                <h3 className="text-lg font-semibold text-green-800">Mo Khata Entries</h3>
              </div>
              <div className="p-6">
                <DataTable data={data.khatas} columns={khataColumns} />
              </div>
            </div>
          </div>
        );

      case 'complaints':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-green-100">
            <div className="p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-green-800">Citizen Complaints</h3>
              <p className="text-gray-600">View all citizen complaints (read-only)</p>
            </div>
            <div className="p-6">
              <DataTable data={data.complaints} columns={complaintColumns} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Supervisor Dashboard</h1>
              <p className="text-green-600">Manage waste collection operations</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded text-green-700 hover:bg-green-100"
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
          <div className="md:hidden flex flex-col gap-2 mb-6 bg-gray-100 p-4 rounded-lg">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as any);
                  setShowForm(false);
                  setMenuOpen(false);
                }}
                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition ${
                  activeTab === key ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}

        {/* Desktop Tabs */}
        <div className="hidden md:flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key as any);
                setShowForm(false);
              }}
              className={`flex items-center px-4 py-3 rounded-md font-medium transition-all text-sm ${
                activeTab === key
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Forms */}
      {showForm && activeTab === 'defect' && (
        <DefectForm onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} />
      )}
      {showForm && activeTab === 'qube' && (
        <QubeForm onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} />
      )}
      {showForm && activeTab === 'khata' && (
        <KhataForm onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default SupervisorDashboard;
