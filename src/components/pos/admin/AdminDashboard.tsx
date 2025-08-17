import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle,
  ShoppingCart,
  Calendar,
  Award,
  ChevronRight,
  Activity,
  Zap,
  Bell,
  Search,
  Settings,
  ArrowUp,
  Eye,
  MoreVertical,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data functions
  const getSalesByPeriod = (period) => {
    const mockData = {
      daily: { totalSales: 2450.50, totalTransactions: 45 },
      weekly: { totalSales: 15230.75, totalTransactions: 287 },
      monthly: { totalSales: 68420.30, totalTransactions: 1245 }
    };
    return mockData[period];
  };
  
  const getLowStockItems = () => [
    { id: 1, name: 'Coffee Beans Premium', stock: 5 },
    { id: 2, name: 'Organic Milk', stock: 8 },
    { id: 3, name: 'Sugar Packets', stock: 12 }
  ];
  
  const dummySales = [
    { id: 1, invoiceId: 'INV-001', timestamp: Date.now(), total: 125.50, paymentMethod: 'card' },
    { id: 2, invoiceId: 'INV-002', timestamp: Date.now() - 3600000, total: 89.25, paymentMethod: 'cash' },
    { id: 3, invoiceId: 'INV-003', timestamp: Date.now() - 7200000, total: 210.75, paymentMethod: 'card' },
    { id: 4, invoiceId: 'INV-004', timestamp: Date.now() - 10800000, total: 67.80, paymentMethod: 'cash' },
    { id: 5, invoiceId: 'INV-005', timestamp: Date.now() - 14400000, total: 156.90, paymentMethod: 'card' }
  ];

  const todaySales = getSalesByPeriod('daily');
  const weeklySales = getSalesByPeriod('weekly');
  const monthlySales = getSalesByPeriod('monthly');
  const lowStockItems = getLowStockItems();

  const stats = [
    {
      title: 'Today\'s Revenue',
      value: `$${todaySales.totalSales.toFixed(2)}`,
      change: '+12.5%',
      icon: DollarSign,
      gradient: 'from-emerald-400 via-emerald-500 to-teal-600',
      lightGradient: 'from-emerald-50 to-teal-50',
      ringColor: 'ring-emerald-500/20'
    },
    {
      title: 'Weekly Growth',
      value: `$${weeklySales.totalSales.toFixed(2)}`,
      change: '+8.2%',
      icon: TrendingUp,
      gradient: 'from-blue-400 via-blue-500 to-indigo-600',
      lightGradient: 'from-blue-50 to-indigo-50',
      ringColor: 'ring-blue-500/20'
    },
    {
      title: 'Stock Alerts',
      value: lowStockItems.length.toString(),
      change: 'Action needed',
      icon: Package,
      gradient: 'from-amber-400 via-orange-500 to-red-600',
      lightGradient: 'from-amber-50 to-red-50',
      ringColor: 'ring-amber-500/20'
    },
    {
      title: 'Active Sessions',
      value: '24',
      change: '6 new today',
      icon: Users,
      gradient: 'from-purple-400 via-purple-500 to-pink-600',
      lightGradient: 'from-purple-50 to-pink-50',
      ringColor: 'ring-purple-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Glassmorphism Header */}
      <header className="relative backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 hover:shadow-purple-500/25 transition-all duration-500">
                  <Zap className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-white animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 via-gray-900 to-black bg-clip-text text-transparent">
                  Admin Control
                </h1>
                <p className="text-sm text-slate-600/80 font-medium">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-slate-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="pl-12 pr-6 py-3 w-80 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-300 outline-none transition-all duration-300 hover:bg-white/80 text-slate-700 placeholder-slate-400"
                />
              </div>
              
              <button className="relative p-3 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-2xl transition-all duration-300 backdrop-blur-sm group">
                <Bell className="w-6 h-6 group-hover:animate-bounce" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">{notifications}</span>
                  </div>
                )}
              </button>
              
              <button className="p-3 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                <Settings className="w-6 h-6 hover:rotate-90 transition-transform duration-500" />
              </button>
              
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-bold">Live System</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                <div className={`relative backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl ${stat.ringColor} ring-1 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-2xl shadow-black/10 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-bold">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wider">{stat.title}</p>
                    <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 group-hover:bg-clip-text transition-all duration-300">
                      {stat.value}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Eye className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Section with Modern Design */}
        {lowStockItems.length > 0 && (
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
                      <h3 className="text-2xl font-black text-slate-900">Critical Alerts</h3>
                      <p className="text-slate-600 font-medium">Immediate attention required</p>
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              </div>
              
              <div className="p-8">
                <h4 className="font-black text-lg mb-6 text-slate-900">Low Stock Items ({lowStockItems.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="group/item backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-5 rounded-2xl border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 group-hover/item:text-red-600 transition-colors">{item.name}</span>
                        <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-black rounded-full shadow-lg">
                          {item.stock} left
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Sales Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Live Transactions</h3>
                      <p className="text-slate-600 font-medium">Real-time sales activity</p>
                    </div>
                  </div>
                  <MoreVertical className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                {dummySales.slice(0, 5).map((sale, index) => (
                  <div key={sale.id} className="group/sale backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-5 rounded-2xl border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-black text-lg text-slate-900 group-hover/sale:text-emerald-600 transition-colors">{sale.invoiceId}</p>
                        <p className="text-sm text-slate-500 font-medium">
                          {new Date(sale.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${sale.total.toFixed(2)}
                        </p>
                        <div className={`inline-flex px-3 py-1 text-xs font-black rounded-full shadow-lg ${
                          sale.paymentMethod === 'card' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        }`}>
                          {sale.paymentMethod.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Performance Analytics</h3>
                    <p className="text-slate-600 font-medium">Multi-period insights</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                {[
                  { label: 'Daily Performance', sales: todaySales.totalSales, transactions: todaySales.totalTransactions, gradient: 'from-emerald-500 to-teal-600' },
                  { label: 'Weekly Trends', sales: weeklySales.totalSales, transactions: weeklySales.totalTransactions, gradient: 'from-blue-500 to-indigo-600' },
                  { label: 'Monthly Overview', sales: monthlySales.totalSales, transactions: monthlySales.totalTransactions, gradient: 'from-purple-500 to-pink-600' }
                ].map((period, index) => (
                  <div key={index} className="group/period backdrop-blur-sm bg-gradient-to-r from-white/60 to-gray-50/60 p-5 rounded-2xl border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${period.gradient} shadow-lg`}></div>
                        <span className="font-bold text-slate-900 group-hover/period:text-purple-600 transition-colors">{period.label}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-xl bg-gradient-to-r ${period.gradient} bg-clip-text text-transparent`}>
                          ${period.sales.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold">{period.transactions} transactions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Quick Actions */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl"></div>
          <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm px-8 py-6">
              <h3 className="text-2xl font-black text-slate-900">Power Actions</h3>
              <p className="text-slate-600 font-medium">One-click administrative controls</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Package, label: 'Stock Control', gradient: 'from-amber-400 to-orange-600', hoverGradient: 'hover:from-amber-500 hover:to-orange-700' },
                  { icon: Users, label: 'User Management', gradient: 'from-blue-400 to-indigo-600', hoverGradient: 'hover:from-blue-500 hover:to-indigo-700' },
                  { icon: TrendingUp, label: 'Analytics Hub', gradient: 'from-green-400 to-emerald-600', hoverGradient: 'hover:from-green-500 hover:to-emerald-700' },
                  { icon: Award, label: 'Loyalty Program', gradient: 'from-purple-400 to-pink-600', hoverGradient: 'hover:from-purple-500 hover:to-pink-700' }
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button key={index} className="group/action relative h-32 backdrop-blur-sm bg-gradient-to-br from-white/60 to-gray-50/60 border border-white/30 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1">
                      <div className="h-full flex flex-col items-center justify-center space-y-3">
                        <div className={`p-4 bg-gradient-to-br ${action.gradient} ${action.hoverGradient} rounded-2xl shadow-2xl group-hover/action:scale-110 transition-all duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-black text-slate-700 group-hover/action:text-slate-900 transition-colors px-2 text-center">
                          {action.label}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 rounded-2xl opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;