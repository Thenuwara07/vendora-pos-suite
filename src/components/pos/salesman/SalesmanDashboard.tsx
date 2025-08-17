import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingDown,
  FileText
} from 'lucide-react';
import { getLowStockItems, dummyStockRequests, dummyCategories } from '@/data/dummyData';
import { StockRequest, RequestedItem } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SalesmanDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showNewItemRequest, setShowNewItemRequest] = useState(false);
  
  const lowStockItems = getLowStockItems();
  const myRequests = dummyStockRequests.filter(req => req.salesmanId === user?.id);
  
  // New request state
  const [newRequest, setNewRequest] = useState<{
    items: RequestedItem[];
    message: string;
  }>({
    items: [],
    message: ''
  });

  // New item request state
  const [newItemRequest, setNewItemRequest] = useState<{
    name: string;
    category: string;
    suggestedPrice: string;
    quantity: string;
    description: string;
  }>({
    name: '',
    category: '',
    suggestedPrice: '',
    quantity: '',
    description: ''
  });

  const addItemToRequest = (itemId: string, itemName: string) => {
    const existingItem = newRequest.items.find(item => item.itemId === itemId);
    if (existingItem) {
      setNewRequest(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setNewRequest(prev => ({
        ...prev,
        items: [...prev.items, {
          itemId,
          itemName,
          quantity: 1,
          isNewItem: false
        }]
      }));
    }
  };

  const updateRequestItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setNewRequest(prev => ({
        ...prev,
        items: prev.items.filter(item => item.itemId !== itemId)
      }));
    } else {
      setNewRequest(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity }
            : item
        )
      }));
    }
  };

  const submitStockRequest = () => {
    if (newRequest.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the request",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Request Submitted",
      description: "Your stock request has been sent to admin",
    });

    setNewRequest({ items: [], message: '' });
    setShowNewRequest(false);
  };

  const submitNewItemRequest = () => {
    if (!newItemRequest.name || !newItemRequest.category || !newItemRequest.suggestedPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "New Item Request Submitted",
      description: `Request for ${newItemRequest.name} has been sent to admin`,
    });

    setNewItemRequest({
      name: '',
      category: '',
      suggestedPrice: '',
      quantity: '',
      description: ''
    });
    setShowNewItemRequest(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Salesman Dashboard</h1>
        <p className="text-muted-foreground">Manage stock requests and inventory status</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Requests</CardTitle>
            <FileText className="h-4 w-4 text-salesman" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-salesman">{myRequests.length}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {myRequests.filter(req => req.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <TrendingDown className="w-5 h-5 mr-2" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
            <CardDescription>
              These items are running low and need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {lowStockItems.slice(0, 6).map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-card rounded border">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{item.stock} left</Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => addItemToRequest(item.id, item.name)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
                <DialogTrigger asChild>
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Create Stock Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Stock Request</DialogTitle>
                    <DialogDescription>
                      Request restocking for existing items
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Selected Items</h4>
                      {newRequest.items.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No items selected</p>
                      ) : (
                        <div className="space-y-2">
                          {newRequest.items.map(item => (
                            <div key={item.itemId} className="flex justify-between items-center p-2 border rounded">
                              <span>{item.itemName}</span>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateRequestItemQuantity(item.itemId!, parseInt(e.target.value) || 0)}
                                  className="w-20"
                                  min="1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => updateRequestItemQuantity(item.itemId!, 0)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Message (Optional)</label>
                      <Textarea
                        placeholder="Add any additional notes or urgency information..."
                        value={newRequest.message}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    
                    <Button onClick={submitStockRequest} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showNewItemRequest} onOpenChange={setShowNewItemRequest}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Request New Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request New Item</DialogTitle>
                    <DialogDescription>
                      Suggest a new item to be added to the store
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Item Name *</label>
                      <Input
                        placeholder="Enter item name"
                        value={newItemRequest.name}
                        onChange={(e) => setNewItemRequest(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <Select 
                        value={newItemRequest.category} 
                        onValueChange={(value) => setNewItemRequest(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyCategories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Suggested Price *</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newItemRequest.suggestedPrice}
                          onChange={(e) => setNewItemRequest(prev => ({ ...prev, suggestedPrice: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Initial Quantity</label>
                        <Input
                          type="number"
                          placeholder="10"
                          value={newItemRequest.quantity}
                          onChange={(e) => setNewItemRequest(prev => ({ ...prev, quantity: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe the item and why it should be added..."
                        value={newItemRequest.description}
                        onChange={(e) => setNewItemRequest(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <Button onClick={submitNewItemRequest} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit New Item Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>Track the status of your submitted requests</CardDescription>
        </CardHeader>
        <CardContent>
          {myRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No requests submitted yet</p>
          ) : (
            <div className="space-y-4">
              {myRequests.map(request => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className={`w-4 h-4 text-${getStatusColor(request.status)}`} />
                          <Badge variant={getStatusColor(request.status) as any}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{request.items.length} items</p>
                        {request.processedAt && (
                          <p className="text-xs text-muted-foreground">
                            Processed: {new Date(request.processedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Items:</h4>
                      {request.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.itemName}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      ))}
                      {request.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{request.items.length - 3} more items
                        </p>
                      )}
                    </div>
                    
                    {request.message && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesmanDashboard;