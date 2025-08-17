import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle,
  ShoppingCart,
  Calendar,
  Award
} from 'lucide-react';
import { getSalesByPeriod, getLowStockItems, dummySales, dummyUsers, dummyStockRequests } from '@/data/dummyData';

const AdminDashboard = () => {
  const todaySales = getSalesByPeriod('daily');
  const weeklySales = getSalesByPeriod('weekly');
  const monthlySales = getSalesByPeriod('monthly');
  const lowStockItems = getLowStockItems();
  const activeUsers = dummyUsers.filter(u => u.isActive);
  const pendingRequests = dummyStockRequests.filter(r => r.status === 'pending');

  const stats = [
    {
      title: 'Today\'s Sales',
      value: `$${todaySales.totalSales.toFixed(2)}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Weekly Revenue',
      value: `$${weeklySales.totalSales.toFixed(2)}`,
      change: '+8.2%',
      icon: TrendingUp,
      color: 'primary'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length.toString(),
      change: pendingRequests.length > 0 ? 'Action needed' : 'Under control',
      icon: Package,
      color: lowStockItems.length > 3 ? 'warning' : 'success'
    },
    {
      title: 'Active Users',
      value: activeUsers.length.toString(),
      change: `${dummyUsers.length - activeUsers.length} inactive`,
      icon: Users,
      color: 'admin'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your POS system performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts & Notifications */}
      {(lowStockItems.length > 0 || pendingRequests.length > 0) && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Low Stock Items ({lowStockItems.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {lowStockItems.slice(0, 6).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-card rounded border">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary">{item.stock} left</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pendingRequests.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Pending Stock Requests ({pendingRequests.length})</h4>
                <div className="space-y-2">
                  {pendingRequests.slice(0, 3).map(request => (
                    <div key={request.id} className="flex justify-between items-center p-2 bg-card rounded border">
                      <span className="text-sm">Request from Salesman</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sales Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Recent Sales
            </CardTitle>
            <CardDescription>Latest transactions across all cashiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummySales.slice(0, 5).map(sale => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.invoiceId}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${sale.total.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {sale.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Performance Summary
            </CardTitle>
            <CardDescription>Sales performance across different periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Sales</span>
                <div className="text-right">
                  <p className="font-medium">${todaySales.totalSales.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{todaySales.totalTransactions} transactions</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Weekly Sales</span>
                <div className="text-right">
                  <p className="font-medium">${weeklySales.totalSales.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{weeklySales.totalTransactions} transactions</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Sales</span>
                <div className="text-right">
                  <p className="font-medium">${monthlySales.totalSales.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{monthlySales.totalTransactions} transactions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="w-6 h-6 mb-2" />
              <span className="text-sm">Update Stock</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Award className="w-6 h-6 mb-2" />
              <span className="text-sm">Loyal Customers</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;