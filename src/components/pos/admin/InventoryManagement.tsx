import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Zap,
  BarChart3,
  ShoppingCart,
  Eye,
  Sparkles,
  Star,
  Heart,
  Layers,
  Globe
} from 'lucide-react';

// Enhanced mock data with color themes
const dummyCategories = [
  { id: '1', name: 'Electronics', color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', darkBgColor: 'from-blue-950 to-cyan-950' },
  { id: '2', name: 'Clothing', color: 'from-pink-500 to-rose-500', bgColor: 'from-pink-50 to-rose-50', darkBgColor: 'from-pink-950 to-rose-950' },
  { id: '3', name: 'Food & Beverages', color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', darkBgColor: 'from-green-950 to-emerald-950' },
  { id: '4', name: 'Books', color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50', darkBgColor: 'from-amber-950 to-orange-950' },
  { id: '5', name: 'Home & Garden', color: 'from-purple-500 to-violet-500', bgColor: 'from-purple-50 to-violet-50', darkBgColor: 'from-purple-950 to-violet-950' }
];

const dummyItems = [
  {
    id: 'item-1',
    name: 'Wireless Headphones Pro',
    category: 'Electronics',
    price: 299.99,
    stock: 15,
    lowStockThreshold: 5,
    barcode: 'BC123456789',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    colorTheme: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'item-2',
    name: 'Organic Coffee Blend',
    category: 'Food & Beverages',
    price: 24.99,
    stock: 3,
    lowStockThreshold: 10,
    barcode: 'BC987654321',
    description: 'Sustainably sourced premium coffee blend',
    colorTheme: 'from-green-500 to-emerald-500'
  },
  {
    id: 'item-3',
    name: 'Designer T-Shirt',
    category: 'Clothing',
    price: 89.99,
    stock: 0,
    lowStockThreshold: 8,
    barcode: 'BC456789123',
    description: 'Limited edition designer cotton t-shirt',
    colorTheme: 'from-pink-500 to-rose-500'
  }
];

const InventoryManagement = () => {
  const [items, setItems] = useState(dummyItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 5,
    barcode: '',
    description: ''
  });

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.barcode.includes(searchTerm) ||
                         item.id.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = items.filter(item => item.stock <= item.lowStockThreshold);

  const getCategoryTheme = (categoryName) => {
    return dummyCategories.find(cat => cat.name === categoryName) || dummyCategories[0];
  };

  const addItem = () => {
    if (!newItem.name || !newItem.category || newItem.price === undefined || newItem.stock === undefined) {
      return;
    }

    const categoryTheme = getCategoryTheme(newItem.category);
    const item = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      stock: Number(newItem.stock),
      lowStockThreshold: Number(newItem.lowStockThreshold) || 5,
      barcode: newItem.barcode || `BC${Date.now()}`,
      description: newItem.description || '',
      colorTheme: categoryTheme.color
    };

    setItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      lowStockThreshold: 5,
      barcode: '',
      description: ''
    });
    setShowAddItem(false);
  };

  const updateItem = () => {
    if (!editingItem) return;

    setItems(prev => prev.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    
    setEditingItem(null);
    setShowEditItem(false);
  };

  const deleteItem = (itemToDelete) => {
    setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
  };

  const updateStock = (itemId, newStock) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, stock: newStock } : item
    ));
  };

  const getStockStatusColor = (item) => {
    if (item.stock === 0) return 'destructive';
    if (item.stock <= item.lowStockThreshold) return 'secondary';
    return 'default';
  };

  const getStockStatusText = (item) => {
    if (item.stock === 0) return 'Out of Stock';
    if (item.stock <= item.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStockIcon = (item) => {
    if (item.stock === 0) return <TrendingDown className="w-3 h-3" />;
    if (item.stock <= item.lowStockThreshold) return <AlertTriangle className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 dark:from-violet-950 dark:via-pink-950 dark:to-cyan-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-purple-400/10 via-pink-400/10 to-cyan-400/10 rounded-full blur-3xl animate-spin [animation-duration:20s]"></div>
      </div>

      <div className="container mx-auto p-6 space-y-8 relative z-10">
        {/* Header with Enhanced Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-cyan-600/30 blur-3xl -z-10"></div>
          <div className="backdrop-blur-2xl bg-gradient-to-r from-white/70 via-white/60 to-white/70 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/70 border border-white/40 dark:border-slate-700/40 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                    <Package className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                      Spectrum Inventory
                    </h1>
                    <p className="text-slate-700 dark:text-slate-300 text-xl font-medium bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                      Where colors meet efficiency ✨
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="backdrop-blur-sm bg-gradient-to-r from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 dark:from-slate-800/60 dark:to-slate-800/40 dark:hover:from-slate-800/80 dark:hover:to-slate-800/60 border-white/30 text-slate-700 dark:text-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                  <Layers className="w-4 h-4 ml-2" />
                </Button>
                
                <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                      <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 border-white/30 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ✨ Add New Product
                      </DialogTitle>
                      <DialogDescription className="text-lg text-slate-600 dark:text-slate-400">Create a new product entry in your colorful inventory</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Product Name *</label>
                          <Input
                            value={newItem.name}
                            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter product name"
                            className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 focus:border-purple-500/50 shadow-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Category *</label>
                          <Select 
                            value={newItem.category} 
                            onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-white/30">
                              {dummyCategories.map(category => (
                                <SelectItem key={category.id} value={category.name} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Price *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            placeholder="0.00"
                            className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Stock Quantity *</label>
                          <Input
                            type="number"
                            value={newItem.stock}
                            onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                            placeholder="0"
                            className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Low Stock Alert</label>
                          <Input
                            type="number"
                            value={newItem.lowStockThreshold}
                            onChange={(e) => setNewItem(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 5 }))}
                            placeholder="5"
                            className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">Barcode</label>
                        <Input
                          value={newItem.barcode}
                          onChange={(e) => setNewItem(prev => ({ ...prev, barcode: e.target.value }))}
                          placeholder="Auto-generated if empty"
                          className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">Description</label>
                        <Textarea
                          value={newItem.description}
                          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Product description"
                          className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                        />
                      </div>
                      
                      <Button onClick={addItem} className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Product
                        <Star className="w-5 h-5 ml-2 animate-pulse" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Cards with Rainbow Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80 border border-blue-200/50 dark:border-blue-800/50 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Total Products</CardTitle>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110">
                  <Package className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                  {items.length}
                </div>
                <p className="text-sm text-blue-600/80 dark:text-blue-400/80 flex items-center mt-2 font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Active inventory items ✨
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-red-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-amber-50/80 to-red-50/80 dark:from-amber-950/80 dark:to-red-950/80 border border-amber-200/50 dark:border-amber-800/50 shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">Low Stock Items</CardTitle>
                <div className="p-3 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110 animate-bounce">
                  <AlertTriangle className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                  {lowStockItems.length}
                </div>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 flex items-center mt-2 font-medium">
                  <Zap className="w-4 h-4 mr-1 animate-pulse" />
                  Needs immediate attention ⚡
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-green-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/80 dark:to-green-950/80 border border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Total Value</CardTitle>
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110">
                  <TrendingUp className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                  ${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
                </div>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 flex items-center mt-2 font-medium">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Current inventory value 💰
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-violet-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/80 dark:to-violet-950/80 border border-purple-200/50 dark:border-purple-800/50 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Categories</CardTitle>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                  <Filter className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
                  {dummyCategories.length}
                </div>
                <p className="text-sm text-purple-600/80 dark:text-purple-400/80 flex items-center mt-2 font-medium">
                  <Eye className="w-4 h-4 mr-1" />
                  Product categories 🎨
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-orange-500/20 blur-3xl animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-r from-red-50/90 via-amber-50/90 to-orange-50/90 dark:from-red-950/90 dark:via-amber-950/90 dark:to-orange-950/90 border border-red-200/50 dark:border-red-800/50 shadow-2xl hover:shadow-red-500/30 transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <div className="p-3 bg-gradient-to-r from-red-500 via-amber-500 to-orange-500 rounded-2xl mr-4 animate-bounce shadow-xl">
                    <AlertTriangle className="w-7 h-7 text-white drop-shadow-lg" />
                  </div>
                  <span className="bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">
                    🚨 Critical Stock Alert ({lowStockItems.length} items)
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-red-700/80 dark:text-red-300/80 font-medium">
                  Immediate restocking required for optimal operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockItems.map(item => {
                    const categoryTheme = getCategoryTheme(item.category);
                    return (
                      <div key={item.id} className="group relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryTheme.color.replace('500', '400/20')} blur-lg group-hover:blur-xl transition-all duration-300`}></div>
                        <div className={`relative backdrop-blur-sm bg-gradient-to-br ${categoryTheme.bgColor} dark:${categoryTheme.darkBgColor} rounded-2xl p-5 border border-white/40 dark:border-slate-700/40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryTheme.color}`}></div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.category}</p>
                              </div>
                            </div>
                            <Badge variant="destructive" className="animate-pulse bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold">
                              {item.stock} left
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              className="flex-1 h-10 bg-white/60 dark:bg-slate-900/60 border-white/40 shadow-lg focus:border-purple-500/50"
                              defaultValue={item.stock}
                              onBlur={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                            />
                            <Button 
                              size="sm" 
                              className={`bg-gradient-to-r ${categoryTheme.color} hover:shadow-lg text-white font-semibold shadow-lg hover:scale-110 transition-all duration-300`}
                              onClick={() => updateStock(item.id, item.lowStockThreshold + 10)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Search and Filter Bar */}
        <div className="flex gap-6 items-center">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-all duration-300 drop-shadow-sm" />
            <Input
              placeholder="🔍 Search products, barcodes, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 backdrop-blur-2xl bg-gradient-to-r from-white/70 to-white/50 dark:from-slate-900/70 dark:to-slate-900/50 border-white/30 dark:border-slate-700/30 focus:border-purple-500/50 shadow-2xl hover:shadow-purple-500/20 text-lg font-medium rounded-2xl transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            <Globe className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400 animate-pulse" />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-80 h-14 backdrop-blur-2xl bg-gradient-to-r from-white/70 to-white/50 dark:from-slate-900/70 dark:to-slate-900/50 border-white/30 dark:border-slate-700/30 shadow-2xl rounded-2xl text-lg font-medium">
              <SelectValue placeholder="🎨 All Categories" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-white/30 rounded-xl shadow-2xl">
              <SelectItem value="all" className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">
                🌈 All Categories
              </SelectItem>
              {dummyCategories.map(category => (
                <SelectItem key={category.id} value={category.name} className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color} shadow-lg`}></div>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Products Display */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/60 to-white/70 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/70 border-white/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold drop-shadow-sm">
                  🎨 Product Showcase
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  Manage your vibrant product catalog with style
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredItems.map(item => {
                const categoryTheme = getCategoryTheme(item.category);
                return (
                  <div key={item.id} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${categoryTheme.color.replace('500', '300/30')} blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    <div className={`relative backdrop-blur-lg bg-gradient-to-br ${categoryTheme.bgColor} dark:${categoryTheme.darkBgColor} rounded-3xl p-7 border border-white/40 dark:border-slate-700/40 hover:border-purple-400/50 transition-all duration-500 hover:scale-[1.02] shadow-xl hover:shadow-2xl`}>
                      
                      {/* Product Header with Color Theme */}
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryTheme.color} shadow-lg animate-pulse`}></div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{item.name}</h3>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className={`text-sm font-semibold bg-gradient-to-r ${categoryTheme.bgColor} dark:${categoryTheme.darkBgColor} border-current`}>
                              {item.category}
                            </Badge>
                            <Badge variant={getStockStatusColor(item)} className="flex items-center gap-1 font-semibold">
                              {getStockIcon(item)}
                              {getStockStatusText(item)}
                            </Badge>
                          </div>
                        </div>
                        <Heart className="w-6 h-6 text-pink-400 hover:text-pink-600 cursor-pointer transition-colors duration-300 hover:scale-110" />
                      </div>

                      {/* Product Details with Enhanced Colors */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 shadow-lg">
                          <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">💰 Price</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                            ${item.price}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 shadow-lg">
                          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">📦 Stock</span>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              value={item.stock}
                              onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                              className="w-24 h-10 text-center bg-white/60 dark:bg-slate-900/60 border-white/40 font-bold text-lg shadow-lg"
                            />
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">units</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 shadow-lg">
                          <span className="text-sm font-semibold bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">🏷️ Barcode</span>
                          <code className="text-sm bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 px-3 py-2 rounded-lg font-mono font-bold shadow-lg">
                            {item.barcode}
                          </code>
                        </div>
                      </div>

                      {/* Enhanced Description */}
                      {item.description && (
                        <div className="mt-5 p-4 bg-gradient-to-r from-slate-50/60 to-slate-100/60 dark:from-slate-800/60 dark:to-slate-700/60 rounded-2xl shadow-lg">
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            ✨ {item.description}
                          </p>
                        </div>
                      )}

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-4 mt-6">
                        <Dialog open={showEditItem && editingItem?.id === item.id} onOpenChange={setShowEditItem}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="lg"
                              className={`flex-1 h-12 backdrop-blur-sm bg-gradient-to-r ${categoryTheme.bgColor} dark:${categoryTheme.darkBgColor} hover:bg-gradient-to-r hover:from-white/80 hover:to-white/60 dark:hover:from-slate-800/80 dark:hover:to-slate-800/60 border-white/30 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                              onClick={() => {
                                setEditingItem(item);
                                setShowEditItem(true);
                              }}
                            >
                              <Edit className="w-5 h-5 mr-2" />
                              Edit Product
                              <Sparkles className="w-4 h-4 ml-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] backdrop-blur-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 border-white/30 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                ✏️ Edit Product
                              </DialogTitle>
                              <DialogDescription className="text-lg text-slate-600 dark:text-slate-400">Update product details and information</DialogDescription>
                            </DialogHeader>
                            {editingItem && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Product Name</label>
                                    <Input
                                      value={editingItem.name}
                                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                                      className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Price</label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingItem.price}
                                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                                      className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Stock</label>
                                    <Input
                                      type="number"
                                      value={editingItem.stock}
                                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                                      className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Low Stock Threshold</label>
                                    <Input
                                      type="number"
                                      value={editingItem.lowStockThreshold}
                                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, lowStockThreshold: parseInt(e.target.value) || 5 } : null)}
                                      className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">Description</label>
                                  <Textarea
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className="bg-gradient-to-r from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 backdrop-blur-sm border-white/30 shadow-lg"
                                  />
                                </div>
                                
                                <Button onClick={updateItem} className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                  <Edit className="w-5 h-5 mr-2" />
                                  Update Product
                                  <Star className="w-5 h-5 ml-2" />
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="destructive" 
                          size="lg"
                          onClick={() => deleteItem(item)}
                          className="h-12 px-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-semibold"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                  <Package className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  🎨 No products found
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  Try adjusting your search criteria or add a new colorful product ✨
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;