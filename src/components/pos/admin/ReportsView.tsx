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
  Users2
} from 'lucide-react';
import { getSalesByPeriod, dummySales, dummyItems, dummyUsers } from '@/data/dummyData';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${periodData.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground capitalize">{selectedPeriod} revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">30% profit margin</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin">{periodData.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customerAnalysis.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Selling Items
            </CardTitle>
            <CardDescription>Best performing products by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map(([itemId, data], index) => (
                <div key={itemId} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">{data.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${data.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users2 className="w-5 h-5 mr-2" />
              Customer Analysis
            </CardTitle>
            <CardDescription>Customer behavior and loyalty insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{customerAnalysis.totalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{customerAnalysis.loyalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Loyal Customers</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Retention</span>
                  <Badge variant="secondary">
                    {Math.round((customerAnalysis.loyalCustomers / customerAnalysis.totalCustomers) * 100)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Order Value</span>
                  <Badge variant="outline">${customerAnalysis.averageOrderValue.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Repeat Purchase Rate</span>
                  <Badge variant="secondary">65%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Stock Report
          </CardTitle>
          <CardDescription>Current inventory status and stock movement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Stock Categories</h4>
              {Object.entries(dummyItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = { count: 0, totalStock: 0 };
                }
                acc[item.category].count++;
                acc[item.category].totalStock += item.stock;
                return acc;
              }, {} as Record<string, { count: number; totalStock: number }>)).map(([category, data]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm">{category}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium">{data.count} items</p>
                    <p className="text-xs text-muted-foreground">{data.totalStock} units</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Low Stock Items</h4>
              {dummyItems
                .filter(item => item.stock <= item.lowStockThreshold)
                .slice(0, 5)
                .map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      {item.stock} left
                    </Badge>
                  </div>
                ))
              }
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Stock Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Inventory Value</span>
                  <span className="font-medium">
                    ${dummyItems.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Units</span>
                  <span className="font-medium">
                    {dummyItems.reduce((sum, item) => sum + item.stock, 0)} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Item Value</span>
                  <span className="font-medium">
                    ${(dummyItems.reduce((sum, item) => sum + item.price, 0) / dummyItems.length).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;