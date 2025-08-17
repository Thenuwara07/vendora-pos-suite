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
import { RequestedItem } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  approved: {
    icon: CheckCircle,
    badgeVariant: 'success',
    pillGradient: 'from-green-500 to-emerald-600',
    text: 'text-green-600',
    label: 'Approved',
  },
  rejected: {
    icon: XCircle,
    badgeVariant: 'destructive',
    pillGradient: 'from-red-500 to-pink-600',
    text: 'text-red-600',
    label: 'Rejected',
  },
  pending: {
    icon: Clock,
    badgeVariant: 'warning',
    pillGradient: 'from-amber-500 to-orange-600',
    text: 'text-amber-600',
    label: 'Pending',
  },
} as const;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Animated Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-gray-900 to-black bg-clip-text text-transparent">
              Salesman Dashboard
            </h1>
            <p className="text-slate-600 font-medium">Manage stock requests and inventory status</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Low Stock Items',
              value: lowStockItems.length,
              icon: AlertTriangle,
              gradient: 'from-amber-500 to-orange-600',
              text: 'text-amber-600',
              sub: 'Need restocking',
            },
            {
              title: 'My Requests',
              value: myRequests.length,
              icon: FileText,
              gradient: 'from-blue-500 to-indigo-600',
              text: 'text-blue-600',
              sub: 'Total submitted',
            },
            {
              title: 'Pending Requests',
              value: myRequests.filter(req => req.status === 'pending').length,
              icon: Clock,
              gradient: 'from-purple-500 to-pink-600',
              text: 'text-amber-600',
              sub: 'Awaiting approval',
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wider">{stat.title}</p>
                  <div className={`text-3xl font-black text-slate-900 mb-1`}>{stat.value}</div>
                  <p className="text-xs text-slate-500 font-medium">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900">
                      Low Stock Alert ({lowStockItems.length} items)
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium">
                      These items are running low and need restocking
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {lowStockItems.slice(0, 6).map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-white/60 to-gray-50/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          {item.stock} left
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 rounded-xl"
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
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25">
                        <Package className="w-4 h-4 mr-2" />
                        Create Stock Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black">Create Stock Request</DialogTitle>
                        <DialogDescription>Request restocking for existing items</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-slate-900">Selected Items</h4>
                          {newRequest.items.length === 0 ? (
                            <p className="text-slate-500 text-sm">No items selected</p>
                          ) : (
                            <div className="space-y-2">
                              {newRequest.items.map(item => (
                                <div
                                  key={item.itemId}
                                  className="flex justify-between items-center p-3 border border-white/30 rounded-2xl bg-gradient-to-r from-white/60 to-gray-50/60 backdrop-blur-sm"
                                >
                                  <span className="font-medium text-slate-900">{item.itemName}</span>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateRequestItemQuantity(item.itemId!, parseInt(e.target.value) || 0)}
                                      className="w-20 rounded-xl"
                                      min={1}
                                    />
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="rounded-xl"
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
                          <label className="text-sm font-medium text-slate-700">Message (Optional)</label>
                          <Textarea
                            placeholder="Add any additional notes or urgency information..."
                            value={newRequest.message}
                            onChange={(e) => setNewRequest(prev => ({ ...prev, message: e.target.value }))}
                            className="rounded-2xl"
                          />
                        </div>

                        <Button onClick={submitStockRequest} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl hover:shadow-green-500/25">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showNewItemRequest} onOpenChange={setShowNewItemRequest}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-2xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Request New Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black">Request New Item</DialogTitle>
                        <DialogDescription>Suggest a new item to be added to the store</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700">Item Name *</label>
                          <Input
                            placeholder="Enter item name"
                            value={newItemRequest.name}
                            onChange={(e) => setNewItemRequest(prev => ({ ...prev, name: e.target.value }))}
                            className="rounded-2xl"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-700">Category *</label>
                          <Select
                            value={newItemRequest.category}
                            onValueChange={(value) => setNewItemRequest(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="rounded-2xl">
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
                            <label className="text-sm font-medium text-slate-700">Suggested Price *</label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newItemRequest.suggestedPrice}
                              onChange={(e) => setNewItemRequest(prev => ({ ...prev, suggestedPrice: e.target.value }))}
                              className="rounded-2xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700">Initial Quantity</label>
                            <Input
                              type="number"
                              placeholder="10"
                              value={newItemRequest.quantity}
                              onChange={(e) => setNewItemRequest(prev => ({ ...prev, quantity: e.target.value }))}
                              className="rounded-2xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-700">Description</label>
                          <Textarea
                            placeholder="Describe the item and why it should be added..."
                            value={newItemRequest.description}
                            onChange={(e) => setNewItemRequest(prev => ({ ...prev, description: e.target.value }))}
                            className="rounded-2xl"
                          />
                        </div>

                        <Button onClick={submitNewItemRequest} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25">
                          <Send className="w-4 h-4 mr-2" />
                          Submit New Item Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Requests */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-all duration-500 blur-xl"></div>
          <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">My Requests</h2>
                  <p className="text-slate-600 font-medium">Track the status of your submitted requests</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {myRequests.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-12 text-center shadow-xl border border-white/20">
                  <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-600 mb-2">No Requests Submitted</h3>
                  <p className="text-slate-500">Create a new stock request to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map(request => {
                    const s = statusStyles[request.status as keyof typeof statusStyles] ?? statusStyles.pending;
                    const StatusIcon = s.icon;
                    return (
                      <div key={request.id} className="group/item relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.pillGradient} rounded-2xl opacity-0 group-hover/item:opacity-10 transition-all duration-500 blur-xl`}></div>
                        <div className="relative border border-white/30 rounded-2xl p-5 bg-gradient-to-r from-white/60 to-gray-50/60 backdrop-blur-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <StatusIcon className={`w-4 h-4 ${s.text}`} />
                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${s.pillGradient}`}>
                                  {s.label}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-800">{request.items.length} items</p>
                              {request.processedAt && (
                                <p className="text-xs text-slate-600">
                                  Processed: {new Date(request.processedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-slate-900">Items</h4>
                            {request.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-slate-800">{item.itemName}</span>
                                <span className="font-semibold text-slate-700">Qty: {item.quantity}</span>
                              </div>
                            ))}
                            {request.items.length > 3 && (
                              <p className="text-xs text-slate-500">
                                +{request.items.length - 3} more items
                              </p>
                            )}
                          </div>

                          {request.message && (
                            <div className="mt-3 pt-3 border-t border-white/30">
                              <p className="text-sm text-slate-700">{request.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesmanDashboard;
