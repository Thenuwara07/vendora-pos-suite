import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Calendar, 
  DollarSign,
  Receipt,
  Filter,
  Download,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  Clock,
  TrendingUp,
  Users,
  Star,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

// Mock data
const dummySales = [
  {
    id: 'sale1',
    invoiceId: 'INV-2025-001',
    timestamp: new Date('2025-08-17T10:30:00'),
    cashierId: 'cashier1',
    paymentMethod: 'card',
    total: 125.50,
    customerInfo: { name: 'John Doe', phone: '+1234567890' },
    items: [
      { itemName: 'Premium Coffee', quantity: 2, price: 5.99, total: 11.98 },
      { itemName: 'Wireless Earbuds', quantity: 1, price: 79.99, total: 79.99 },
      { itemName: 'Chocolate Bar', quantity: 3, price: 1.99, total: 5.97 }
    ]
  },
  {
    id: 'sale2',
    invoiceId: 'INV-2025-002',
    timestamp: new Date('2025-08-17T09:15:00'),
    cashierId: 'cashier2',
    paymentMethod: 'upi',
    total: 45.75,
    customerInfo: null,
    items: [
      { itemName: 'Artisan Tea', quantity: 3, price: 4.50, total: 13.50 },
      { itemName: 'Gourmet Chips', quantity: 2, price: 2.99, total: 5.98 }
    ]
  },
  {
    id: 'sale3',
    invoiceId: 'INV-2025-003',
    timestamp: new Date('2025-08-16T16:45:00'),
    cashierId: 'cashier1',
    paymentMethod: 'cash',
    total: 89.25,
    customerInfo: { name: 'Jane Smith', phone: '+0987654321' },
    items: [
      { itemName: 'Power Bank', quantity: 1, price: 29.99, total: 29.99 },
      { itemName: 'Best Seller Novel', quantity: 2, price: 12.99, total: 25.98 }
    ]
  },
  {
    id: 'sale4',
    invoiceId: 'INV-2025-004',
    timestamp: new Date('2025-08-15T14:20:00'),
    cashierId: 'cashier2',
    paymentMethod: 'card',
    total: 67.80,
    customerInfo: null,
    items: [
      { itemName: 'Energy Drink', quantity: 4, price: 3.25, total: 13.00 },
      { itemName: 'Premium Coffee', quantity: 3, price: 5.99, total: 17.97 }
    ]
  }
];

const dummyUsers = [
  { id: 'cashier1', name: 'Alice Johnson', role: 'cashier' },
  { id: 'cashier2', name: 'Bob Wilson', role: 'cashier' }
];

const BillHistory = () => {
  const user = { id: 'cashier1', name: 'Alice Johnson', role: 'cashier' };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [viewMode, setViewMode] = useState('all');

  // Filter bills
  const filteredBills = dummySales.filter(sale => {
    if (user?.role === 'cashier' && viewMode === 'my') {
      if (sale.cashierId !== user.id) return false;
    }
    
    const matchesSearch = sale.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sale.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         sale.id.includes(searchTerm);
    
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const saleDate = new Date(sale.timestamp);
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          matchesPeriod = saleDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = saleDate >= weekAgo;
          break;
        case 'month':
          matchesPeriod = saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || sale.paymentMethod === selectedPaymentMethod;
    
    return matchesSearch && matchesPeriod && matchesPaymentMethod;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getCashierName = (cashierId) => {
    const cashier = dummyUsers.find(u => u.id === cashierId);
    return cashier?.name || 'Unknown Cashier';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return Banknote;
      case 'card': return CreditCard;
      case 'upi': return Smartphone;
      default: return DollarSign;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-700 border-green-200';
      case 'card': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upi': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const printReceipt = (sale) => {
    console.log('Downloading receipt for:', sale.invoiceId);
  };

  const exportData = () => {
    console.log('Exporting data...');
  };

  // Calculate stats
  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
  const avgBillAmount = filteredBills.length > 0 ? totalAmount / filteredBills.length : 0;
  const todaysBills = filteredBills.filter(bill => 
    new Date(bill.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Bill History
                </h1>
                <p className="text-gray-500">
                  {user?.role === 'cashier' ? 'View your transaction history and receipts' : 'All transaction history'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user?.role === 'cashier' && (
                <div className="relative">
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="px-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Bills</option>
                    <option value="my">My Bills</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
              
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-white/50 hover:bg-white/80 border border-white/20 rounded-xl transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{filteredBills.length}</div>
                <div className="text-sm text-gray-500">Total Bills</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">${totalAmount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">${avgBillAmount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Average Bill</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+5%</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{todaysBills.length}</div>
                <div className="text-sm text-gray-500">Today's Bills</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">Active</span>
              <span className="text-sm text-gray-500">today</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice ID, customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[160px] pr-10"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[160px] pr-10"
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredBills.length} transactions found</p>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{dummyUsers.length} cashiers</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredBills.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No bills found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredBills.map(bill => {
                const PaymentIcon = getPaymentMethodIcon(bill.paymentMethod);
                return (
                  <div key={bill.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Receipt className="w-7 h-7 text-blue-600" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-800">{bill.invoiceId}</h3>
                            <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getPaymentMethodColor(bill.paymentMethod)}`}>
                              <PaymentIcon className="w-3 h-3" />
                              <span>{bill.paymentMethod.toUpperCase()}</span>
                            </div>
                            {bill.customerInfo && (
                              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>Customer</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(bill.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(bill.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <span>Cashier: {getCashierName(bill.cashierId)}</span>
                            {bill.customerInfo && (
                              <span>Customer: {bill.customerInfo.name}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">{bill.items.length} items</span>
                            <div className="flex space-x-1">
                              {bill.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                                  {item.itemName}
                                </div>
                              ))}
                              {bill.items.length > 3 && (
                                <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                                  +{bill.items.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${bill.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setShowBillDetails(true);
                            }}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={() => printReceipt(bill)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl transition-colors duration-200"
                            title="Download Receipt"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          
                          <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors duration-200">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bill Details Modal */}
      {showBillDetails && selectedBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Bill Details</h3>
                  <p className="text-gray-500 mt-1">{selectedBill.invoiceId}</p>
                </div>
                <button
                  onClick={() => setShowBillDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Bill Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Invoice ID</p>
                  <p className="text-gray-900">{selectedBill.invoiceId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Date & Time</p>
                  <p className="text-gray-900">{new Date(selectedBill.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Cashier</p>
                  <p className="text-gray-900">{getCashierName(selectedBill.cashierId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment Method</p>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${getPaymentMethodColor(selectedBill.paymentMethod)}`}>
                    {React.createElement(getPaymentMethodIcon(selectedBill.paymentMethod), { className: "w-3 h-3" })}
                    <span>{selectedBill.paymentMethod.toUpperCase()}</span>
                  </div>
                </div>
                {selectedBill.customerInfo && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Customer</p>
                      <p className="text-gray-900">{selectedBill.customerInfo.name}</p>
                    </div>
                    {selectedBill.customerInfo.phone && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                        <p className="text-gray-900">{selectedBill.customerInfo.phone}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Items Purchased</h4>
                <div className="space-y-3">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{item.itemName}</p>
                        <p className="text-sm text-gray-500">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${selectedBill.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => printReceipt(selectedBill)} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillHistory;