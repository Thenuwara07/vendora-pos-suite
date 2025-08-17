import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Clock
} from 'lucide-react';
import { dummySales, dummyUsers } from '@/data/dummyData';
import { Sale } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BillHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Sale | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  // Filter bills based on user role and view mode
  const filteredBills = dummySales.filter(sale => {
    // For cashiers, show only their bills when in 'my' mode
    if (user?.role === 'cashier' && viewMode === 'my') {
      if (sale.cashierId !== user.id) return false;
    }
    
    // Search filter
    const matchesSearch = sale.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sale.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         sale.id.includes(searchTerm);
    
    // Period filter
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
    
    // Payment method filter
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || sale.paymentMethod === selectedPaymentMethod;
    
    return matchesSearch && matchesPeriod && matchesPaymentMethod;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getCashierName = (cashierId: string) => {
    const cashier = dummyUsers.find(u => u.id === cashierId);
    return cashier?.name || 'Unknown Cashier';
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return Banknote;
      case 'card': return CreditCard;
      case 'upi': return Smartphone;
      default: return DollarSign;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'success';
      case 'card': return 'primary';
      case 'upi': return 'secondary';
      default: return 'outline';
    }
  };

  const printReceipt = (sale: Sale) => {
    const receipt = `
=============================
POS SYSTEM RECEIPT
=============================
Invoice: ${sale.invoiceId}
Date: ${new Date(sale.timestamp).toLocaleString()}
Cashier: ${getCashierName(sale.cashierId)}
${sale.customerInfo ? `Customer: ${sale.customerInfo.name}` : ''}
${sale.customerInfo?.phone ? `Phone: ${sale.customerInfo.phone}` : ''}
=============================
${sale.items.map(item => 
  `${item.itemName} x${item.quantity} - $${item.total.toFixed(2)}`
).join('\n')}
=============================
Total: $${sale.total.toFixed(2)}
Payment: ${sale.paymentMethod.toUpperCase()}
=============================
Thank you for your purchase!
    `;
    
    console.log('Receipt:', receipt);
    
    // Create downloadable receipt
    const dataStr = receipt;
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `receipt-${sale.invoiceId}.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for ${sale.invoiceId} has been downloaded`,
    });
  };

  const exportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      cashier: user?.name,
      period: selectedPeriod,
      totalBills: filteredBills.length,
      totalAmount: filteredBills.reduce((sum, bill) => sum + bill.total, 0),
      bills: filteredBills
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bill-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Data Exported",
      description: "Bill history has been exported successfully",
    });
  };

  // Calculate stats
  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
  const avgBillAmount = filteredBills.length > 0 ? totalAmount / filteredBills.length : 0;
  const todaysBills = filteredBills.filter(bill => 
    new Date(bill.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bill History</h1>
          <p className="text-muted-foreground">
            {user?.role === 'cashier' ? 'View your transaction history and receipts' : 'All transaction history'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {user?.role === 'cashier' && (
            <Select value={viewMode} onValueChange={(value: 'all' | 'my') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="my">My Bills</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-cashier" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cashier">{filteredBills.length}</div>
            <p className="text-xs text-muted-foreground">
              {viewMode === 'my' ? 'Your transactions' : 'All transactions'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total sales value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bill</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${avgBillAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bills</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysBills.length}</div>
            <p className="text-xs text-muted-foreground">Today's transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice ID, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredBills.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBills.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No bills found matching your criteria</p>
              </div>
            ) : (
              filteredBills.map(bill => {
                const PaymentIcon = getPaymentMethodIcon(bill.paymentMethod);
                return (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cashier/10 rounded-full flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-cashier" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{bill.invoiceId}</h3>
                          <Badge variant={getPaymentMethodColor(bill.paymentMethod) as any} className="flex items-center gap-1">
                            <PaymentIcon className="w-3 h-3" />
                            {bill.paymentMethod.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(bill.timestamp).toLocaleString()}
                          </div>
                          <span>Cashier: {getCashierName(bill.cashierId)}</span>
                          {bill.customerInfo && (
                            <span>Customer: {bill.customerInfo.name}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {bill.items.length} items
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${bill.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog open={showBillDetails && selectedBill?.id === bill.id} onOpenChange={setShowBillDetails}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowBillDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Bill Details - {bill.invoiceId}</DialogTitle>
                              <DialogDescription>
                                Transaction details and receipt
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedBill && (
                              <div className="space-y-6">
                                {/* Bill Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium">Invoice ID</p>
                                    <p className="text-sm">{selectedBill.invoiceId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Date & Time</p>
                                    <p className="text-sm">{new Date(selectedBill.timestamp).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Cashier</p>
                                    <p className="text-sm">{getCashierName(selectedBill.cashierId)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Payment Method</p>
                                    <Badge variant={getPaymentMethodColor(selectedBill.paymentMethod) as any}>
                                      {selectedBill.paymentMethod.toUpperCase()}
                                    </Badge>
                                  </div>
                                  {selectedBill.customerInfo && (
                                    <>
                                      <div>
                                        <p className="text-sm font-medium">Customer</p>
                                        <p className="text-sm">{selectedBill.customerInfo.name}</p>
                                      </div>
                                      {selectedBill.customerInfo.phone && (
                                        <div>
                                          <p className="text-sm font-medium">Phone</p>
                                          <p className="text-sm">{selectedBill.customerInfo.phone}</p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                
                                {/* Items */}
                                <div>
                                  <h4 className="font-medium mb-3">Items</h4>
                                  <div className="space-y-2">
                                    {selectedBill.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                                        <div>
                                          <p className="font-medium">{item.itemName}</p>
                                          <p className="text-sm text-muted-foreground">
                                            ${item.price} × {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-medium">${item.total.toFixed(2)}</p>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                      <span>Total:</span>
                                      <span>${selectedBill.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button 
                                  onClick={() => printReceipt(selectedBill)} 
                                  className="w-full"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Receipt
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => printReceipt(bill)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillHistory;