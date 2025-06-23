import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  FileText,
  Wrench,
  Package,
  ClipboardList,
  Shield,
  Menu
} from 'lucide-react';
import DataTable from './DataTable';
import api from '../services/api';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'complaints' | 'defects' | 'qubes' | 'khatas'>('complaints');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState({
    complaints: [],
    defects: [],
    qubes: [],
    khatas: []
  });
  const { logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, defectsRes, qubesRes, khatasRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/defects'),
        api.get('/qubes'),
        api.get('/khata')
      ]);

      setData({
        complaints: complaintsRes.data,
        defects: defectsRes.data,
        qubes: qubesRes.data,
        khatas: khatasRes.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateStatus = async (type: string, id: string, status: string) => {
    try {
      await api.patch(`/${type}/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
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

  const renderStatusColumn = (status: string, id: string, type: string) => (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
      <select
        value={status}
        onChange={(e) => updateStatus(type, id, e.target.value)}
        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        <option value="started">Started</option>
        <option value="in-progress">In Progress</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );

  const renderDate = (date: string) => new Date(date).toLocaleDateString();

  const complaintColumns = [
    { key: 'citizenName', label: 'Citizen Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
    { key: 'area', label: 'Area' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string, row: any) => renderStatusColumn(status, row._id, 'complaints')
    },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const defectColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'machineName', label: 'Machine' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string, row: any) => renderStatusColumn(status, row._id, 'defects')
    },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const qubeColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'category', label: 'Category' },
    { key: 'cubeNumber', label: 'Cube Number' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string, row: any) => renderStatusColumn(status, row._id, 'qubes')
    },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const khataColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'generation', label: 'Generation' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string, row: any) => renderStatusColumn(status, row._id, 'khata')
    },
    { key: 'createdAt', label: 'Date', render: renderDate }
  ];

  const tabs = [
    { key: 'complaints', label: 'Citizen Complaints', icon: FileText, count: data.complaints.length },
    { key: 'defects', label: 'Machinery Defects', icon: Wrench, count: data.defects.length },
    { key: 'qubes', label: 'Qube Fulfillment', icon: Package, count: data.qubes.length },
    { key: 'khatas', label: 'Mo Khata Entries', icon: ClipboardList, count: data.khatas.length }
  ];

  const getTabData = () => {
    switch (activeTab) {
      case 'complaints': return { data: data.complaints, columns: complaintColumns };
      case 'defects': return { data: data.defects, columns: defectColumns };
      case 'qubes': return { data: data.qubes, columns: qubeColumns };
      case 'khatas': return { data: data.khatas, columns: khataColumns };
      default: return { data: [], columns: [] };
    }
  };

  const { data: currentData, columns } = getTabData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-green-800">Admin Dashboard</h1>
                <p className="text-green-600">Manage all waste management operations</p>
              </div>
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-green-600 hover:text-green-800 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={logout}
              className="hidden lg:flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-sm border-t border-b border-green-100 px-4 py-2">
          <div className="grid grid-cols-1 gap-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as any);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === key ? 'bg-green-500 text-white' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <span className="flex items-center">
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </span>
                <span className="text-sm font-semibold">{tabs.find(t => t.key === key)?.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Tabs */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <div
              key={key}
              className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                activeTab === key ? 'border-green-500 ring-2 ring-green-100' : 'border-green-100'
              }`}
              onClick={() => setActiveTab(key as any)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-green-800">{count}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  activeTab === key ? 'bg-green-500' : 'bg-green-100'
                }`}>
                  <Icon className={`w-6 h-6 ${activeTab === key ? 'text-white' : 'text-green-600'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100">
          <div className="p-6 border-b border-green-100">
            <h3 className="text-lg font-semibold text-green-800">
              {tabs.find(tab => tab.key === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              Manage and update the status of all {activeTab.replace('s', '')} records
            </p>
          </div>
          <div className="p-6">
            <DataTable data={currentData} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
