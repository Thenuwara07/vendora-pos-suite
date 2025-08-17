import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package,
  User,
  Calendar,
  MessageSquare,
  Plus,
  Minus,
  Edit,
  Eye,
  Filter,
  Search,
  Bell,
  Sparkles,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Send
} from 'lucide-react';

const RequestsManagement = () => {
  const [requests, setRequests] = useState([
    {
      id: 'req-001',
      salesmanId: 'user-3',
      salesmanName: 'Marcus Johnson',
      salesmanAvatar: '👨‍🚀',
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      processedAt: null,
      priority: 'high',
      message: 'Urgent: Running low on premium coffee beans and organic milk. Customer demand is increasing.',
      items: [
        { itemName: 'Premium Coffee Beans', quantity: 50, isNewItem: false, category: 'Beverages' },
        { itemName: 'Organic Milk', quantity: 20, isNewItem: false, category: 'Dairy' },
        { itemName: 'Eco-friendly Cups', quantity: 100, isNewItem: true, category: 'Supplies', suggestedPrice: 0.15 }
      ]
    },
    {
      id: 'req-002',
      salesmanId: 'user-5',
      salesmanName: 'David Park',
      salesmanAvatar: '👨‍🔬',
      status: 'approved',
      createdAt: new Date('2024-01-14'),
      processedAt: new Date('2024-01-14'),
      priority: 'medium',
      message: 'Weekly stock replenishment for pastries and sandwiches.',
      adminResponse: 'Approved. Items will be delivered by tomorrow.',
      items: [
        { itemName: 'Croissants', quantity: 30, isNewItem: false, category: 'Bakery' },
        { itemName: 'Sandwiches', quantity: 25, isNewItem: false, category: 'Food' }
      ]
    },
    {
      id: 'req-003',
      salesmanId: 'user-3',
      salesmanName: 'Marcus Johnson',
      salesmanAvatar: '👨‍🚀',
      status: 'rejected',
      createdAt: new Date('2024-01-13'),
      processedAt: new Date('2024-01-13'),
      priority: 'low',
      message: 'Requesting exotic tea varieties for premium customers.',
      adminResponse: 'Rejected due to limited storage capacity and uncertain demand.',
      items: [
        { itemName: 'Dragon Well Tea', quantity: 10, isNewItem: true, category: 'Beverages', suggestedPrice: 25.00 },
        { itemName: 'Earl Grey Premium', quantity: 15, isNewItem: true, category: 'Beverages', suggestedPrice: 20.00 }
      ]
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [editedItems, setEditedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');
  const urgentRequests = requests.filter(req => req.priority === 'high' && req.status === 'pending');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.salesmanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.items.some(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        gradient: 'from-amber-400 via-orange-500 to-red-500',
        bgGradient: 'from-amber-50 to-orange-50',
        textColor: 'text-amber-600',
        label: 'Pending Review'
      },
      approved: {
        icon: CheckCircle,
        gradient: 'from-green-400 via-emerald-500 to-teal-500',
        bgGradient: 'from-green-50 to-emerald-50',
        textColor: 'text-green-600',
        label: 'Approved'
      },
      rejected: {
        icon: XCircle,
        gradient: 'from-red-400 via-pink-500 to-rose-500',
        bgGradient: 'from-red-50 to-pink-50',
        textColor: 'text-red-600',
        label: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle, label: 'High Priority' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Medium Priority' },
      low: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Low Priority' }
    };
    return configs[priority] || configs.medium;
  };

  const processRequest = (requestId, status, response = '') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status,
            processedAt: new Date(),
            adminResponse: response
          }
        : req
    ));

    showNotification(`Request has been ${status}`);
    setShowRequestDetails(false);
    setSelectedRequest(null);
    setAdminResponse('');
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setEditedItems([...request.items]);
    setShowRequestDetails(true);
  };

  const updateItemQuantity = (index, quantity) => {
    setEditedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const stats = [
    {
      title: 'Pending Reviews',
      value: pendingRequests.length,
      subtitle: `${urgentRequests.length} urgent`,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      change: pendingRequests.length > 0 ? 'Needs attention' : 'All clear'
    },
    {
      title: 'Approved Today',
      value: approvedRequests.length,
      subtitle: 'This month',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      change: '+15%'
    },
    {
      title: 'Total Requests',
      value: requests.length,
      subtitle: 'Last 30 days',
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      change: '+8%'
    },
    {
      title: 'Response Time',
      value: '2.4h',
      subtitle: 'Average',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-600',
      change: '-12%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className={`backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 transform transition-all duration-500 animate-in slide-in-from-right ${
            notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
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
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-gray-900 to-black bg-clip-text text-transparent">
                  Requests Center
                </h1>
                <p className="text-slate-600 font-medium">Review and process stock requests from your team</p>
              </div>
            </div>
          </div>
          
          {urgentRequests.length > 0 && (
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-200/50 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center space-x-2 text-red-600">
                <Bell className="w-5 h-5 animate-bounce" />
                <span className="font-bold">{urgentRequests.length} Urgent Requests</span>
              </div>
            </div>
          )}
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
                    <div className={`text-sm font-bold ${stat.change.includes('+') ? 'text-green-600' : stat.change.includes('-') ? 'text-red-600' : 'text-amber-600'}`}>
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

        {/* Urgent Requests Alert */}
        {urgentRequests.length > 0 && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-red-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-2xl">
                      <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {urgentRequests.length} Urgent Request{urgentRequests.length > 1 ? 's' : ''}
                      </h3>
                      <p className="text-slate-600 font-medium">High priority items need immediate review</p>
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                {urgentRequests.slice(0, 3).map(request => (
                  <div 
                    key={request.id}
                    onClick={() => openRequestDetails(request)}
                    className="group/item backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-5 rounded-2xl border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{request.salesmanAvatar}</div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover/item:text-red-600 transition-colors">
                            {request.salesmanName}
                          </p>
                          <p className="text-sm text-slate-600">{request.items.length} items requested</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg">
                        URGENT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <input
                type="text"
                placeholder="Search requests by salesman, message, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 hover:bg-white/80 text-slate-700"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 hover:bg-white/80 text-slate-700 font-medium"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="space-y-6">
          {filteredRequests.map(request => {
            const statusConfig = getStatusConfig(request.status);
            const priorityConfig = getPriorityConfig(request.priority);
            const StatusIcon = statusConfig.icon;
            const PriorityIcon = priorityConfig.icon;
            
            return (
              <div key={request.id} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-all duration-500 blur-xl`}></div>
                <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  
                  {/* Request Header */}
                  <div className={`bg-gradient-to-r ${statusConfig.bgGradient} backdrop-blur-sm px-8 py-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{request.salesmanAvatar}</div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{request.salesmanName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>{request.createdAt.toLocaleDateString()}</span>
                            {request.processedAt && (
                              <>
                                <span>•</span>
                                <span>Processed: {request.processedAt.toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl ${priorityConfig.bg}`}>
                          <PriorityIcon className={`w-4 h-4 ${priorityConfig.color}`} />
                          <span className={`text-sm font-bold ${priorityConfig.color}`}>{priorityConfig.label}</span>
                        </div>
                        
                        <div className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${statusConfig.gradient} text-white rounded-2xl shadow-lg`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-bold text-sm">{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Message */}
                      <div>
                        <h4 className="font-black text-lg mb-4 flex items-center text-slate-900">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Request Message
                        </h4>
                        <div className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-4 rounded-2xl border border-white/30">
                          <p className="text-slate-700 leading-relaxed">{request.message}</p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div>
                        <h4 className="font-black text-lg mb-4 flex items-center text-slate-900">
                          <Package className="w-5 h-5 mr-2" />
                          Items ({request.items.length})
                        </h4>
                        <div className="space-y-2">
                          {request.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between items-center backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-3 rounded-2xl border border-white/30">
                              <div>
                                <span className={`font-medium ${item.isNewItem ? 'text-blue-600' : 'text-slate-900'}`}>
                                  {item.itemName}
                                </span>
                                {item.isNewItem && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-slate-700">Qty: {item.quantity}</span>
                            </div>
                          ))}
                          {request.items.length > 3 && (
                            <p className="text-sm text-slate-500 font-medium text-center py-2">
                              +{request.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Response */}
                    {request.adminResponse && (
                      <div className="mt-6 pt-6 border-t border-white/30">
                        <h4 className="font-black text-lg mb-3 text-slate-900">Admin Response</h4>
                        <div className="backdrop-blur-sm bg-gradient-to-r from-blue-50/60 to-indigo-50/60 p-4 rounded-2xl border border-blue-200/30">
                          <p className="text-slate-700 leading-relaxed">{request.adminResponse}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => openRequestDetails(request)}
                        className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-center space-x-2">
                          <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                          <span>View Details</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No Requests Found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or check back later</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm px-8 py-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{selectedRequest.salesmanAvatar}</div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Request Details</h2>
                    <p className="text-slate-600 font-medium">From {selectedRequest.salesmanName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRequestDetails(false)}
                  className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-2xl transition-all duration-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              
              {/* Request Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Status', value: selectedRequest.status, color: getStatusConfig(selectedRequest.status).textColor },
                  { label: 'Priority', value: selectedRequest.priority, color: getPriorityConfig(selectedRequest.priority).color },
                  { label: 'Date Requested', value: selectedRequest.createdAt.toLocaleDateString() },
                  { label: 'Total Items', value: selectedRequest.items.length }
                ].map((item, index) => (
                  <div key={index} className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-4 rounded-2xl border border-white/30 text-center">
                    <p className="text-sm font-semibold text-slate-600 mb-1">{item.label}</p>
                    <p className={`font-black text-lg ${item.color || 'text-slate-900'} capitalize`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div>
                <h4 className="font-black text-xl mb-4 text-slate-900 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Request Message
                </h4>
                <div className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-6 rounded-2xl border border-white/30">
                  <p className="text-slate-700 leading-relaxed">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-black text-xl mb-4 text-slate-900 flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  Requested Items
                </h4>
                <div className="space-y-3">
                  {editedItems.map((item, index) => (
                    <div key={index} className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-6 rounded-2xl border border-white/30">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-bold text-lg text-slate-900">{item.itemName}</h5>
                          {item.isNewItem && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-bold rounded-full">
                                NEW ITEM
                              </span>
                              <span className="text-sm text-slate-600">Category: {item.category}</span>
                              {item.suggestedPrice && (
                                <span className="text-sm text-slate-600">Price: ${item.suggestedPrice}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {selectedRequest.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                                className="w-20 px-3 py-2 text-center bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                min="1"
                              />
                              <button
                                onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg">
                              Qty: {item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Response Input */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <label className="font-black text-xl mb-4 text-slate-900 block">Admin Response</label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add any comments or reasons for your decision..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 resize-none"
                  />
                </div>
              )}

              {/* Previous Admin Response */}
              {selectedRequest.adminResponse && (
                <div>
                  <h4 className="font-black text-xl mb-4 text-slate-900">Previous Admin Response</h4>
                  <div className="backdrop-blur-sm bg-gradient-to-r from-blue-50/60 to-indigo-50/60 p-6 rounded-2xl border border-blue-200/30">
                    <p className="text-slate-700 leading-relaxed">{selectedRequest.adminResponse}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-4 pt-6 border-t border-white/30">
                  <button
                    onClick={() => processRequest(selectedRequest.id, 'approved', adminResponse)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve Request</span>
                    </div>
                  </button>
                  <button
                    onClick={() => processRequest(selectedRequest.id, 'rejected', adminResponse)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Reject Request</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsManagement;