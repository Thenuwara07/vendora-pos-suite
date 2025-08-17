import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCheck,
  UserX,
  Shield,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Mail,
  Eye,
  EyeOff,
  Star,
  Crown,
  Zap,
  Activity,
  Filter,
  X,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 'user-1', name: 'Alex Thompson', email: 'alex.thompson@company.com', role: 'admin', isActive: true, createdAt: new Date('2023-01-15'), avatar: '👨‍💼', lastLogin: new Date() },
    { id: 'user-2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'cashier', isActive: true, createdAt: new Date('2023-03-20'), avatar: '👩‍💻', lastLogin: new Date(Date.now() - 86400000) },
    { id: 'user-3', name: 'Marcus Johnson', email: 'marcus.j@company.com', role: 'salesman', isActive: false, createdAt: new Date('2023-02-10'), avatar: '👨‍🚀', lastLogin: new Date(Date.now() - 259200000) },
    { id: 'user-4', name: 'Emily Rodriguez', email: 'emily.r@company.com', role: 'cashier', isActive: true, createdAt: new Date('2023-04-05'), avatar: '👩‍🎨', lastLogin: new Date(Date.now() - 3600000) },
    { id: 'user-5', name: 'David Park', email: 'david.park@company.com', role: 'salesman', isActive: true, createdAt: new Date('2023-05-12'), avatar: '👨‍🔬', lastLogin: new Date(Date.now() - 7200000) }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'cashier',
    isActive: true,
    avatar: '👤'
  });

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  const activeUsers = users.filter(u => u.isActive);
  const adminUsers = users.filter(u => u.role === 'admin');
  const cashierUsers = users.filter(u => u.role === 'cashier');
  const salesmanUsers = users.filter(u => u.role === 'salesman');

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      showNotification('Email already exists', 'error');
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      ...newUser,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: 'cashier', isActive: true, avatar: '👤' });
    setShowAddUser(false);
    showNotification(`${user.name} has been added as ${user.role}`);
  };

  const updateUser = () => {
    if (!editingUser) return;

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setEditingUser(null);
    setShowEditUser(false);
    showNotification(`${editingUser.name} has been updated`);
  };

  const deleteUser = (userToDelete) => {
    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
    showNotification(`${userToDelete.name} has been removed`);
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    
    const user = users.find(u => u.id === userId);
    showNotification(`${user?.name} is now ${user?.isActive ? 'inactive' : 'active'}`);
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { 
        icon: Crown, 
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        bgGradient: 'from-purple-50 to-pink-50',
        textColor: 'text-purple-600',
        label: 'Administrator',
        description: 'Full system access'
      },
      cashier: { 
        icon: ShoppingCart, 
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        textColor: 'text-blue-600',
        label: 'Cashier',
        description: 'POS operations'
      },
      salesman: { 
        icon: TrendingUp, 
        gradient: 'from-green-500 via-emerald-500 to-lime-500',
        bgGradient: 'from-green-50 to-emerald-50',
        textColor: 'text-green-600',
        label: 'Sales Manager',
        description: 'Inventory & sales'
      }
    };
    return configs[role] || configs.cashier;
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      subtitle: `${activeUsers.length} active`,
      icon: Users,
      gradient: 'from-slate-500 to-gray-600',
      bgGradient: 'from-slate-50 to-gray-50',
      change: '+12%'
    },
    {
      title: 'Administrators',
      value: adminUsers.length,
      subtitle: 'System admins',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+1'
    },
    {
      title: 'Active Cashiers',
      value: cashierUsers.filter(u => u.isActive).length,
      subtitle: `${cashierUsers.length} total`,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: '+3'
    },
    {
      title: 'Sales Team',
      value: salesmanUsers.filter(u => u.isActive).length,
      subtitle: `${salesmanUsers.length} total`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      change: '+2'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className={`backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 transform transition-all duration-500 animate-in slide-in-from-right ${
            notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-gray-900 to-black bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-slate-600 font-medium">Manage system users and permissions</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddUser(true)}
            className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 font-bold"
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add User</span>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-green-600 font-bold text-sm">
                      {stat.change}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wider">{stat.title}</p>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      {stat.value}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 hover:bg-white/80 text-slate-700"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 hover:bg-white/80 text-slate-700 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="cashier">Cashiers</option>
                <option value="salesman">Sales Team</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 backdrop-blur-sm border border-white/30 rounded-2xl transition-all duration-300 hover:bg-white/80 ${
                  showFilters ? 'bg-blue-500 text-white' : 'bg-white/60 text-slate-600'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const roleConfig = getRoleConfig(user.role);
            const RoleIcon = roleConfig.icon;
            const isOnline = Date.now() - user.lastLogin.getTime() < 300000; // 5 minutes
            
            return (
              <div key={user.id} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${roleConfig.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${roleConfig.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-2xl`}>
                          {user.avatar}
                        </div>
                        {isOnline && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full ring-2 ring-white animate-pulse"></div>
                        )}
                        {!user.isActive && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full ring-2 ring-white"></div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 group-hover:bg-clip-text transition-all duration-300">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${roleConfig.bgGradient} rounded-2xl border border-white/30 mb-4`}>
                    <RoleIcon className={`w-4 h-4 ${roleConfig.textColor}`} />
                    <div>
                      <span className={`font-bold text-sm ${roleConfig.textColor}`}>{roleConfig.label}</span>
                      <p className="text-xs text-slate-500">{roleConfig.description}</p>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-6 bg-white/40 rounded-2xl p-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {user.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-600">Active Status</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                        user.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-0.5 ${
                        user.isActive ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditUser(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => deleteUser(user)}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <UserX className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No Users Found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or add a new user</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Add New User</h2>
              <button 
                onClick={() => setShowAddUser(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Full Name</label>
                <input
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                >
                  <option value="admin">Administrator - Full Access</option>
                  <option value="cashier">Cashier - POS Operations</option>
                  <option value="salesman">Sales Manager - Inventory & Sales</option>
                </select>
              </div>
              
              <button
                onClick={addUser}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Edit User</h2>
              <button 
                onClick={() => setShowEditUser(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Full Name</label>
                <input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300"
                >
                  <option value="admin">Administrator - Full Access</option>
                  <option value="cashier">Cashier - POS Operations</option>
                  <option value="salesman">Sales Manager - Inventory & Sales</option>
                </select>
              </div>
              
              <button
                onClick={updateUser}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;