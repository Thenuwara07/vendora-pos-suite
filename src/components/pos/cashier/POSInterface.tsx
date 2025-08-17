import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Smartphone
} from 'lucide-react';
import { dummyItems, dummyCategories, generateInvoiceId, dummyBills } from '@/data/dummyData';
import { SaleItem, Bill } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const POSInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentBill, setCurrentBill] = useState<SaleItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showPausedBills, setShowPausedBills] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [pausedBills, setPausedBills] = useState<Bill[]>(dummyBills);

  // Quick add item state
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

  const addItemToBill = (item: typeof dummyItems[0], quantity: number = 1) => {
    const existingItem = currentBill.find(billItem => billItem.itemId === item.id);
    
    if (existingItem) {
      setCurrentBill(prev => prev.map(billItem => 
        billItem.itemId === item.id 
          ? { ...billItem, quantity: billItem.quantity + quantity, total: (billItem.quantity + quantity) * billItem.price }
          : billItem
      ));
    } else {
      const newItem: SaleItem = {
        itemId: item.id,
        itemName: item.name,
        quantity,
        price: item.price,
        total: item.price * quantity
      };
      setCurrentBill(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
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

  const removeFromBill = (itemId: string) => {
    setCurrentBill(prev => prev.filter(item => item.itemId !== itemId));
  };

  const getBillTotal = () => {
    return currentBill.reduce((sum, item) => sum + item.total, 0);
  };

  const pauseBill = () => {
    if (currentBill.length === 0) return;
    
    const newBill: Bill = {
      id: Date.now().toString(),
      items: [...currentBill],
      total: getBillTotal(),
      isPaused: true,
      createdAt: new Date(),
      cashierId: user?.id || ''
    };
    
    setPausedBills(prev => [...prev, newBill]);
    setCurrentBill([]);
    
    toast({
      title: "Bill Paused",
      description: "Current bill has been saved",
    });
  };

  const resumeBill = (bill: Bill) => {
    setCurrentBill(bill.items);
    setPausedBills(prev => prev.filter(b => b.id !== bill.id));
    setShowPausedBills(false);
    
    toast({
      title: "Bill Resumed",
      description: "Bill has been restored",
    });
  };

  const addQuickItem = () => {
    if (!quickItem.price || !quickItem.quantity) return;
    
    const itemName = quickItem.name || `Item${Date.now()}`;
    const price = parseFloat(quickItem.price);
    const quantity = parseInt(quickItem.quantity);
    
    const newItem: SaleItem = {
      itemId: `quick-${Date.now()}`,
      itemName,
      quantity,
      price,
      total: price * quantity
    };
    
    setCurrentBill(prev => [...prev, newItem]);
    setQuickItem({ name: '', price: '', quantity: '1' });
    setShowQuickAdd(false);
    
    toast({
      title: "Quick Item Added",
      description: `${itemName} added to bill`,
    });
  };

  const processPayment = (method: 'cash' | 'card' | 'upi') => {
    if (currentBill.length === 0) return;
    
    const invoiceId = generateInvoiceId();
    
    toast({
      title: "Payment Processed",
      description: `Invoice ${invoiceId} - $${getBillTotal().toFixed(2)}`,
    });
    
    // Print receipt (simulated)
    printReceipt(invoiceId, method);
    
    // Clear current bill
    setCurrentBill([]);
    setShowPayment(false);
  };

  const printReceipt = (invoiceId: string, paymentMethod: string) => {
    const receipt = `
      =============================
      POS SYSTEM RECEIPT
      =============================
      Invoice: ${invoiceId}
      Date: ${new Date().toLocaleString()}
      Cashier: ${user?.name}
      =============================
      ${currentBill.map(item => 
        `${item.itemName} x${item.quantity} - $${item.total.toFixed(2)}`
      ).join('\n')}
      =============================
      Total: $${getBillTotal().toFixed(2)}
      Payment: ${paymentMethod.toUpperCase()}
      =============================
      Thank you for your purchase!
    `;
    
    console.log('Receipt:', receipt);
    // In a real app, this would send to printer
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Items */}
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Point of Sale</h1>
          <p className="text-muted-foreground">Select items to add to bill</p>
        </div>

        {/* Search and Category Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {dummyCategories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addItemToBill(item)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">${item.price}</span>
                    <Badge variant={item.stock <= item.lowStockThreshold ? 'destructive' : 'secondary'}>
                      {item.stock} in stock
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Bill */}
      <div className="w-96 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Bill</h2>
          <div className="flex gap-2">
            <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Add Item</DialogTitle>
                  <DialogDescription>Add an item not in the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Item name (optional)"
                    value={quickItem.name}
                    onChange={(e) => setQuickItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={quickItem.price}
                    onChange={(e) => setQuickItem(prev => ({ ...prev, price: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={quickItem.quantity}
                    onChange={(e) => setQuickItem(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                  <Button onClick={addQuickItem} className="w-full">Add to Bill</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={pauseBill}>
              <Pause className="w-4 h-4" />
            </Button>
            
            <Dialog open={showPausedBills} onOpenChange={setShowPausedBills}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                  {pausedBills.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
                      {pausedBills.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Paused Bills</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {pausedBills.map(bill => (
                    <div 
                      key={bill.id}
                      className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-muted"
                      onClick={() => resumeBill(bill)}
                    >
                      <div>
                        <p className="font-medium">${bill.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{bill.items.length} items</p>
                      </div>
                      <Badge variant="outline">Resume</Badge>
                    </div>
                  ))}
                  {pausedBills.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No paused bills</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="h-96">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2">
              {currentBill.map(item => (
                <div key={item.itemId} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.itemName}</p>
                    <p className="text-xs text-muted-foreground">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeFromBill(item.itemId)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {currentBill.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No items in bill
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${getBillTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              size="lg"
              disabled={currentBill.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                Total Amount: ${getBillTotal().toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4">
              <Button 
                className="h-20 flex-col"
                onClick={() => processPayment('cash')}
              >
                <Banknote className="w-6 h-6 mb-2" />
                Cash
              </Button>
              <Button 
                className="h-20 flex-col"
                onClick={() => processPayment('card')}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                Card
              </Button>
              <Button 
                className="h-20 flex-col"
                onClick={() => processPayment('upi')}
              >
                <Smartphone className="w-6 h-6 mb-2" />
                UPI
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default POSInterface;