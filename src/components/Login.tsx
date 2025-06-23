import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Users, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import nacLogo from '../assest/naclogo.png';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'supervisor' | 'admin'>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    username: '',
    password: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        await api.post('/auth/citizen-login', { phone: formData.phone });
        setOtpSent(true);
      } else {
        const response = await api.post('/auth/verify-otp', {
          phone: formData.phone,
          otp: formData.otp
        });
        login(response.data);
        navigate('/citizen');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password,
        role: activeTab
      });
      login(response.data);
      navigate(`/${activeTab}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultUsers = async () => {
    try {
      await api.post('/auth/create-defaults');
      alert('Default users created! Supervisor: supervisor1/supervisor123, Admin: admin1/admin123');
    } catch (error) {
      console.error('Error creating default users:', error);
    }
  };

  const tabConfig = {
    citizen: { icon: Users, label: 'Citizen', color: 'bg-green-600' },
    supervisor: { icon: User, label: 'Supervisor', color: 'bg-green-700' },
    admin: { icon: Shield, label: 'Admin', color: 'bg-green-800' }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-100 to-white">
      {/* Left Branding Section - Hidden on mobile */}
      <div className="hidden md:flex w-full md:w-[70%] p-6 sm:p-8 md:p-16 bg-green-700 text-white flex-col justify-between">
        <div className="flex items-center gap-4 mb-10">
          <img src={nacLogo} alt="NAC Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold">GOPALPUR N.A.C</h1>
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Solid Waste Management
          </h2>
          <p className="text-sm md:text-base text-white text-opacity-80">
            Join our mission for a cleaner, greener Gopalpur by managing waste effectively.
          </p>

          <div className="flex justify-between mt-8 gap-2">
            {['Paper', 'Plastic', 'Glass', 'Organic'].map((item) => (
              <div
                key={item}
                className="flex-1 mx-1 text-center bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition"
              >
                <div className="text-2xl">♻️</div>
                <div className="text-sm font-semibold mt-1">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-white text-opacity-70 mt-10">
          © 2025 Solid Waste Management System
        </p>
      </div>

      {/* Right Login Form Section - Always visible */}
      <div className="w-full md:w-[30%] bg-white p-6 sm:p-8 md:p-12 flex flex-col justify-center min-h-screen md:min-h-0">
        <div className="w-full max-w-md space-y-6">
          {/* Logo (only for mobile view) */}
          <div className="flex justify-center md:hidden">
            <img src={nacLogo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>

          {/* Tabs */}
          <div className="flex justify-between border-b border-gray-200">
            {Object.entries(tabConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key as any);
                    setOtpSent(false);
                    setFormData({ phone: '', otp: '', username: '', password: '' });
                  }}
                  className={`flex-1 text-sm font-semibold pb-2 border-b-2 ${
                    activeTab === key
                      ? 'text-green-700 border-green-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Icon className="inline mr-2" size={16} />
                  {config.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login
            </h2>
            <p className="text-sm text-gray-500">Welcome back to the SWM system</p>
          </div>

          {/* Login Form */}
          {activeTab === 'citizen' ? (
            <form onSubmit={handleCitizenLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter phone number"
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="text-sm font-medium">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength={6}
                    placeholder="Enter 1111 as OTP"
                    className="w-full px-4 py-2 border rounded-lg text-center focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="text-xs text-green-600 mt-1">OTP sent to your phone</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${tabConfig[activeTab].color} w-full text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          <button
            onClick={createDefaultUsers}
            className="w-full text-sm text-green-600 hover:text-green-700 text-center mt-4"
          >
            Create Default Users (Dev)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
