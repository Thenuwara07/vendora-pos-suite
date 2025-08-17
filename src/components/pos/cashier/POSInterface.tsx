import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Pause, 
  Play, 
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Filter,
  Zap,
  Clock,
  Star
} from 'lucide-react';

// Mock data
const dummyCategories = [
  { id: '1', name: 'Beverages' },
  { id: '2', name: 'Snacks' },
  { id: '3', name: 'Electronics' },
  { id: '4', name: 'Books' }
];

const dummyItems = [
  { id: 'ITM001', name: 'Premium Coffee', category: 'Beverages', price: 5.99, stock: 45, lowStockThreshold: 10, featured: true },
  { id: 'ITM002', name: 'Artisan Tea', category: 'Beverages', price: 4.50, stock: 30, lowStockThreshold: 10, featured: false },
  { id: 'ITM003', name: 'Energy Drink', category: 'Beverages', price: 3.25, stock: 8, lowStockThreshold: 10, featured: false },
  { id: 'ITM004', name: 'Gourmet Chips', category: 'Snacks', price: 2.99, stock: 25, lowStockThreshold: 10, featured: true },
  { id: 'ITM005', name: 'Chocolate Bar', category: 'Snacks', price: 1.99, stock: 50, lowStockThreshold: 10, featured: false },
  { id: 'ITM006', name: 'Wireless Earbuds', category: 'Electronics', price: 79.99, stock: 15, lowStockThreshold: 5, featured: true },
  { id: 'ITM007', name: 'Power Bank', category: 'Electronics', price: 29.99, stock: 20, lowStockThreshold: 5, featured: false },
  { id: 'ITM008', name: 'Best Seller Novel', category: 'Books', price: 12.99, stock: 35, lowStockThreshold: 10, featured: false }
];

const dummyBills = [
  {
    id: '1',
    items: [
      { itemId: 'ITM001', itemName: 'Premium Coffee', quantity: 2, price: 5.99, total: 11.98 }
    ],
    total: 11.98,
    isPaused: true,
    createdAt: new Date(Date.now() - 300000),
    cashierId: 'user1'
  }
];

const POSInterface = () => {
  const [currentBill, setCurrentBill] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showPausedBills, setShowPausedBills] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [pausedBills, setPausedBills] = useState(dummyBills);

  const [quickItem, setQuickItem] = useState({
    name: '',
    price: '',
    quantity: '1'
  });

  const filteredItems = dummyItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const addItemToBill = (item, quantity = 1) => {
    const existingItem = currentBill.find(billItem => billItem.itemId === item.id);
    
    if (existingItem) {
      setCurrentBill(prev => prev.map(billItem => 
        billItem.itemId === item.id 
          ? { ...billItem, quantity: billItem.quantity + quantity, total: (billItem.quantity + quantity) * billItem.price }
          : billItem
      ));
    } else {
      const newItem = {
        itemId: item.id,
        itemName: item.name,
        quantity,
        price: item.price,
        total: item.price * quantity
      };
      setCurrentBill(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromBill(itemId);
      return;
    }
    
    setCurrentBill(prev => prev.map(item => 
      item.itemId === itemId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  const removeFromBill = (itemId) => {
    setCurrentBill(prev => prev.filter(item => item.itemId !== itemId));
  };

  const getBillTotal = () => {
    return currentBill.reduce((sum, item) => sum + item.total, 0);
  };

  const pauseBill = () => {
    if (currentBill.length === 0) return;
    
    const newBill = {
      id: Date.now().toString(),
      items: [...currentBill],
      total: getBillTotal(),
      isPaused: true,
      createdAt: new Date(),
      cashierId: 'cashier1'
    };
    
    setPausedBills(prev => [...prev, newBill]);
    setCurrentBill([]);
  };

  const resumeBill = (bill) => {
    setCurrentBill(bill.items);
    setPausedBills(prev => prev.filter(b => b.id !== bill.id));
    setShowPausedBills(false);
  };

  const addQuickItem = () => {
    if (!quickItem.price || !quickItem.quantity) return;
    
    const itemName = quickItem.name || `Item${Date.now()}`;
    const price = parseFloat(quickItem.price);
    const quantity = parseInt(quickItem.quantity);
    
    const newItem = {
      itemId: `quick-${Date.now()}`,
      itemName,
      quantity,
      price,
      total: price * quantity
    };
    
    setCurrentBill(prev => [...prev, newItem]);
    setQuickItem({ name: '', price: '', quantity: '1' });
    setShowQuickAdd(false);
  };

  const processPayment = (method) => {
    if (currentBill.length === 0) return;
    
    const invoiceId = `INV${Date.now()}`;
    setCurrentBill([]);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  ModernPOS
                </h1>
                <p className="text-sm text-gray-500">Smart Point of Sale System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-8 h-[calc(100vh-100px)]">
        {/* Left Panel - Items */}
        <div className="flex-1 space-y-6">
          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  {dummyCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg flex-1 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-y-auto">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => addItemToBill(item)}
                >
                  {item.featured && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-60"></div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${item.price}
                      </span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.stock <= item.lowStockThreshold 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {item.stock} left
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Bill */}
        <div className="w-96 space-y-6">
          {/* Bill Header */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuickAdd(true)}
                  className="p-2 bg-gray-100 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                  title="Quick Add"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={pauseBill}
                  className="p-2 bg-gray-100 hover:bg-yellow-100 rounded-xl transition-colors duration-200"
                  title="Pause Bill"
                >
                  <Pause className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={() => setShowPausedBills(true)}
                  className="relative p-2 bg-gray-100 hover:bg-green-100 rounded-xl transition-colors duration-200"
                  title="Resume Bills"
                >
                  <Play className="w-5 h-5 text-gray-600" />
                  {pausedBills.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{pausedBills.length}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bill Items */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex-1 flex flex-col overflow-hidden">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {currentBill.map(item => (
                  <div key={item.itemId} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.itemName}</h4>
                        <p className="text-sm text-gray-500">${item.price} each</p>
                      </div>
                      <button
                        onClick={() => removeFromBill(item.itemId)}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-white rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-800">${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                
                {currentBill.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No items in cart</p>
                    <p className="text-sm text-gray-400">Click on products to add them</p>
                  </div>
                )}
              </div>
            </div>
            
            {currentBill.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-white/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${getBillTotal().toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Process Payment</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Process Payment</h3>
              <p className="text-gray-600">
                Total Amount: <span className="font-bold text-blue-600">${getBillTotal().toFixed(2)}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button 
                onClick={() => processPayment('cash')}
                className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-200"
              >
                <Banknote className="w-8 h-8 text-green-600 mb-2" />
                <span className="font-medium text-green-700">Cash</span>
              </button>
              
              <button 
                onClick={() => processPayment('card')}
                className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200"
              >
                <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-700">Card</span>
              </button>
              
              <button 
                onClick={() => processPayment('upi')}
                className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-200"
              >
                <Smartphone className="w-8 h-8 text-purple-600 mb-2" />
                <span className="font-medium text-purple-700">UPI</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowPayment(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Add Item</h3>
              <p className="text-gray-600">Add an item not in the system</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Item name (optional)"
                value={quickItem.name}
                onChange={(e) => setQuickItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={quickItem.price}
                onChange={(e) => setQuickItem(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={quickItem.quantity}
                onChange={(e) => setQuickItem(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQuickAdd(false)}
                className="flex-1 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addQuickItem}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Add to Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paused Bills Modal */}
      {showPausedBills && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Paused Bills</h3>
            </div>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {pausedBills.map(bill => (
                <div 
                  key={bill.id}
                  onClick={() => resumeBill(bill)}
                  className="flex justify-between items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-800">${bill.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{bill.items.length} items</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Resume
                  </div>
                </div>
              ))}
              
              {pausedBills.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No paused bills</p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowPausedBills(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInterface;