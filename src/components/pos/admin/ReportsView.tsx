import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  Download,
  BarChart3,
  PieChart,
  Users2,
  Target,
  Star,
  Activity,
  Zap,
  Globe,
  Filter,
  Eye,
  Heart,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';

// Mock data (since we don't have access to the actual data file)
const dummySales = [
  { id: 1, total: 299.99, date: new Date(), items: [{ itemId: 'item-1', itemName: 'Wireless Headphones', quantity: 1, total: 299.99 }], customerInfo: { name: 'John Doe' } },
  { id: 2, total: 149.98, date: new Date(), items: [{ itemId: 'item-2', itemName: 'Coffee Blend', quantity: 6, total: 149.98 }], customerInfo: { name: 'Jane Smith' } },
  { id: 3, total: 89.99, date: new Date(), items: [{ itemId: 'item-3', itemName: 'Designer T-Shirt', quantity: 1, total: 89.99 }], customerInfo: { name: 'Mike Johnson' } }
];

const dummyItems = [
  { id: 'item-1', name: 'Wireless Headphones', category: 'Electronics', price: 299.99, stock: 15, lowStockThreshold: 5 },
  { id: 'item-2', name: 'Coffee Blend', category: 'Food & Beverages', price: 24.99, stock: 3, lowStockThreshold: 10 },
  { id: 'item-3', name: 'Designer T-Shirt', category: 'Clothing', price: 89.99, stock: 0, lowStockThreshold: 8 }
];

const getSalesByPeriod = (period: string) => {
  const totalSales = dummySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = dummySales.length;
  return { totalSales, totalTransactions };
};

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const periodData = getSalesByPeriod(selectedPeriod);
  
  // Calculate profit (assuming 30% profit margin for demo)
  const profitMargin = 0.3;
  const totalProfit = periodData.totalSales * profitMargin;
  
  // Get popular items
  const itemSales = dummySales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.itemId]) {
        acc[item.itemId] = { name: item.itemName, quantity: 0, revenue: 0 };
      }
      acc[item.itemId].quantity += item.quantity;
      acc[item.itemId].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);
  
  const topItems = Object.entries(itemSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);
  
  // Customer analysis (simplified)
  const customerAnalysis = {
    totalCustomers: dummySales.filter(sale => sale.customerInfo).length,
    loyalCustomers: Math.floor(dummySales.filter(sale => sale.customerInfo).length * 0.3),
    averageOrderValue: periodData.totalTransactions > 0 ? periodData.totalSales / periodData.totalTransactions : 0
  };

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      totalSales: periodData.totalSales,
      totalTransactions: periodData.totalTransactions,
      totalProfit: totalProfit,
      topItems: topItems,
      customerAnalysis: customerAnalysis,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pos-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-indigo-950 dark:via-purple-950 dark:to-cyan-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-violet-400/10 via-pink-400/10 to-cyan-400/10 rounded-full blur-3xl animate-spin [animation-duration:30s]"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 blur-3xl -z-10"></div>
          <div className="backdrop-blur-2xl bg-gradient-to-r from-white/80 via-white/70 to-white/80 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/80 border border-white/40 dark:border-slate-700/40 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                    <BarChart3 className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                      📊 Analytics Hub
                    </h1>
                    <p className="text-xl font-medium bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                      Comprehensive business insights & performance metrics ✨
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                  <SelectTrigger className="w-44 h-12 backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 dark:from-slate-900/70 dark:to-slate-900/50 border-white/30 dark:border-slate-700/30 shadow-xl rounded-2xl text-lg font-medium">
                    <SelectValue />
                    <Calendar className="w-5 h-5 ml-2 text-purple-500" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-white/30 rounded-xl shadow-2xl">
                    <SelectItem value="daily" className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">📅 Daily</SelectItem>
                    <SelectItem value="weekly" className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">📊 Weekly</SelectItem>
                    <SelectItem value="monthly" className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">📈 Monthly</SelectItem>
                    <SelectItem value="yearly" className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 rounded-lg">🎯 Yearly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={exportReport} variant="outline" className="h-12 backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 dark:from-slate-900/70 dark:to-slate-900/50 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold">
                  <Download className="w-5 h-5 mr-2" />
                  Export Report
                  <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sales Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-green-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/80 dark:to-green-950/80 border border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">💰 Total Sales</CardTitle>
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110">
                  <DollarSign className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                    ${periodData.totalSales.toFixed(2)}
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white animate-pulse">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80 capitalize flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  {selectedPeriod} revenue
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80 border border-blue-200/50 dark:border-blue-800/50 shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">📈 Total Profit</CardTitle>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110">
                  <TrendingUp className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                    ${totalProfit.toFixed(2)}
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +8%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  30% profit margin
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-violet-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/80 dark:to-violet-950/80 border border-purple-200/50 dark:border-purple-800/50 shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">🛒 Transactions</CardTitle>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                  <ShoppingCart className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
                    {periodData.totalTransactions}
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white animate-pulse">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +15%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-purple-600/80 dark:text-purple-400/80 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Total orders
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/80 dark:to-orange-950/80 border border-amber-200/50 dark:border-amber-800/50 shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">⚡ Avg. Order</CardTitle>
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110">
                  <Calendar className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                    ${customerAnalysis.averageOrderValue.toFixed(2)}
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +5%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-amber-600/80 dark:text-amber-400/80 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Per transaction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Items */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/80 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/80 border-white/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mr-4 shadow-xl">
                  <BarChart3 className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  🏆 Top Selling Items
                </span>
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                Best performing products by quantity sold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {topItems.map(([itemId, data], index) => {
                  const gradients = [
                    'from-yellow-500 to-orange-500',
                    'from-gray-400 to-gray-600',
                    'from-amber-600 to-yellow-600',
                    'from-indigo-500 to-purple-500',
                    'from-pink-500 to-rose-500'
                  ];
                  const bgGradients = [
                    'from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950',
                    'from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900',
                    'from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
                    'from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950',
                    'from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950'
                  ];
                  
                  return (
                    <div key={itemId} className={`group relative overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index].replace('500', '400/20')} blur-lg group-hover:blur-xl transition-all duration-300`}></div>
                      <div className={`relative flex justify-between items-center p-5 bg-gradient-to-r ${bgGradients[index]} rounded-2xl border border-white/40 dark:border-slate-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
                        <div className="flex items-center gap-4">
                          <div className={`relative p-3 bg-gradient-to-r ${gradients[index]} rounded-2xl shadow-xl hover:shadow-lg transition-all duration-300 hover:scale-110`}>
                            <Badge variant="outline" className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center p-0 bg-white dark:bg-slate-900 text-xs font-bold">
                              {index + 1}
                            </Badge>
                            <Star className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{data.name}</p>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                              <Package className="w-4 h-4 mr-1" />
                              {data.quantity} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            ${data.revenue.toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80">Revenue</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Customer Analysis */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/80 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/80 border-white/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mr-4 shadow-xl">
                  <Users2 className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-bold">
                  👥 Customer Analysis
                </span>
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                Customer behavior and loyalty insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative text-center p-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                        {customerAnalysis.totalCustomers}
                      </p>
                      <p className="text-sm font-semibold text-blue-600/80 dark:text-blue-400/80 flex items-center justify-center">
                        <Globe className="w-4 h-4 mr-1" />
                        Total Customers
                      </p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative text-center p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/80 dark:to-pink-950/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {customerAnalysis.loyalCustomers}
                      </p>
                      <p className="text-sm font-semibold text-purple-600/80 dark:text-purple-400/80 flex items-center justify-center">
                        <Heart className="w-4 h-4 mr-1 animate-pulse" />
                        Loyal Customers
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50/60 to-green-50/60 dark:from-emerald-950/60 dark:to-green-950/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-emerald-500" />
                        Customer Retention
                      </span>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold px-3 py-1">
                        {Math.round((customerAnalysis.loyalCustomers / customerAnalysis.totalCustomers) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 dark:from-blue-950/60 dark:to-cyan-950/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                        Average Order Value
                      </span>
                      <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 font-bold px-3 py-1">
                        ${customerAnalysis.averageOrderValue.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between items-center p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/60 dark:to-pink-950/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-purple-500" />
                        Repeat Purchase Rate
                      </span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-3 py-1">
                        65%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stock Analysis */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/80 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/80 border-white/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mr-4 shadow-xl">
                <PieChart className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">
                📦 Stock Report
              </span>
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Current inventory status and stock movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-5">
                <h4 className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  🎨 Stock Categories
                </h4>
                {Object.entries(dummyItems.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = { count: 0, totalStock: 0 };
                  }
                  acc[item.category].count++;
                  acc[item.category].totalStock += item.stock;
                  return acc;
                }, {} as Record<string, { count: number; totalStock: number }>)).map(([category, data], index) => {
                  const gradients = [
                    'from-blue-500 to-cyan-500',
                    'from-green-500 to-emerald-500',
                    'from-pink-500 to-rose-500'
                  ];
                  const bgGradients = [
                    'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
                    'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
                    'from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950'
                  ];
                  
                  return (
                    <div key={category} className="group relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index]?.replace('500', '400/20') || 'from-slate-400/20 to-slate-500/20'} blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300`}></div>
                      <div className={`relative flex justify-between items-center p-4 bg-gradient-to-r ${bgGradients[index] || 'from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradients[index] || 'from-slate-500 to-slate-600'} shadow-lg animate-pulse`}></div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{data.count} items</p>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{data.totalStock} units</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-5">
                <h4 className="font-bold text-xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  ⚠️ Low Stock Items
                </h4>
                {dummyItems
                  .filter(item => item.stock <= item.lowStockThreshold)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.id} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                      <div className="relative flex justify-between items-center p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-950/80 dark:to-pink-950/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg animate-pulse"></div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                        </div>
                        <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold animate-pulse">
                          {item.stock} left
                        </Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
              
              <div className="space-y-5">
                <h4 className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  💎 Stock Value
                </h4>
                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-950/80 dark:to-green-950/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">💰 Total Inventory Value</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        ${dummyItems.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">📦 Total Units</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {dummyItems.reduce((sum, item) => sum + item.stock, 0)} units
                      </span>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-lg group-hover:opacity-100 opacity-70 transition-opacity duration-300"></div>
                    <div className="relative flex justify-between p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/80 dark:to-pink-950/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">⭐ Average Item Value</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${(dummyItems.reduce((sum, item) => sum + item.price, 0) / dummyItems.length).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsView;