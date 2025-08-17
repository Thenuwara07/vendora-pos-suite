import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package,
  User,
  Calendar,
  MessageSquare,
  Plus,
  Minus,
  Edit
} from 'lucide-react';
import { dummyStockRequests, dummyUsers, dummyItems } from '@/data/dummyData';
import { StockRequest } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const RequestsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<StockRequest[]>(dummyStockRequests);
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [editedItems, setEditedItems] = useState<StockRequest['items']>([]);

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  const getSalesmanName = (salesmanId: string) => {
    const salesman = dummyUsers.find(u => u.id === salesmanId);
    return salesman?.name || 'Unknown Salesman';
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

  const processRequest = (requestId: string, status: 'approved' | 'rejected', response?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status,
            processedAt: new Date(),
            processedBy: user?.id || '',
            adminResponse: response
          }
        : req
    ));

    const request = requests.find(req => req.id === requestId);
    
    // If approved and has existing items, update stock
    if (status === 'approved' && request) {
      const existingItems = request.items.filter(item => !item.isNewItem && item.itemId);
      if (existingItems.length > 0) {
        // In a real app, this would update the actual inventory
        toast({
          title: "Stock Updated",
          description: `${existingItems.length} items have been restocked automatically`,
        });
      }
    }

    toast({
      title: "Request Processed",
      description: `Request has been ${status}`,
    });

    setShowRequestDetails(false);
    setSelectedRequest(null);
    setAdminResponse('');
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    setEditedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  const openRequestDetails = (request: StockRequest) => {
    setSelectedRequest(request);
    setEditedItems([...request.items]);
    setShowRequestDetails(true);
  };

  const saveItemChanges = () => {
    if (!selectedRequest) return;
    
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, items: [...editedItems] }
        : req
    ));
    
    setSelectedRequest({ ...selectedRequest, items: [...editedItems] });
    
    toast({
      title: "Changes Saved",
      description: "Request items have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Requests Management</h1>
        <p className="text-muted-foreground">Review and process stock requests from salesmen</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedRequests.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Alert */}
      {pendingRequests.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {pendingRequests.length} Requests Awaiting Review
            </CardTitle>
            <CardDescription>
              These requests need your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(request => (
                <div 
                  key={request.id}
                  className="flex justify-between items-center p-3 bg-card rounded border cursor-pointer hover:bg-muted/50"
                  onClick={() => openRequestDetails(request)}
                >
                  <div>
                    <p className="font-medium">Request from {getSalesmanName(request.salesmanId)}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.items.length} items • {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Requests */}
      <Card>
        <CardHeader>
          <CardTitle>All Stock Requests</CardTitle>
          <CardDescription>Complete history of stock requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No requests found</p>
            ) : (
              requests.map(request => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div 
                    key={request.id} 
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => openRequestDetails(request)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-salesman/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-salesman" />
                        </div>
                        <div>
                          <h3 className="font-medium">{getSalesmanName(request.salesmanId)}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.createdAt).toLocaleDateString()}
                            {request.processedAt && (
                              <>
                                <span>•</span>
                                <span>Processed: {new Date(request.processedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(request.status) as any} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Requested Items ({request.items.length})</h4>
                        <div className="space-y-1">
                          {request.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className={item.isNewItem ? "text-primary font-medium" : ""}>
                                {item.itemName} {item.isNewItem && "(New)"}
                              </span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          ))}
                          {request.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{request.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {request.message && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Message</h4>
                          <p className="text-sm text-muted-foreground">{request.message}</p>
                        </div>
                      )}
                    </div>
                    
                    {request.adminResponse && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="font-medium text-sm mb-1">Admin Response</h4>
                        <p className="text-sm text-muted-foreground">{request.adminResponse}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review and process this stock request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Requested by</p>
                  <p className="text-sm">{getSalesmanName(selectedRequest.salesmanId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusColor(selectedRequest.status) as any}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Items</p>
                  <p className="text-sm">{selectedRequest.items.length} items</p>
                </div>
              </div>
              
              {/* Message */}
              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request Message
                  </h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedRequest.message}</p>
                  </div>
                </div>
              )}
              
              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Requested Items
                  </h4>
                  {selectedRequest.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={saveItemChanges}>
                      <Edit className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {editedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.itemName}
                          {item.isNewItem && (
                            <Badge variant="secondary" className="ml-2">New Item</Badge>
                          )}
                        </p>
                        {item.isNewItem && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>Category: {item.category}</p>
                            {item.suggestedPrice && <p>Suggested Price: ${item.suggestedPrice}</p>}
                          </div>
                        )}
                        {!item.isNewItem && (
                          <p className="text-sm text-muted-foreground">
                            Current Stock: {dummyItems.find(i => i.id === item.itemId)?.stock || 0}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedRequest.status === 'pending' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, Math.max(0, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="font-medium">Qty: {item.quantity}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Admin Response */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <label className="text-sm font-medium">Admin Response (Optional)</label>
                  <Textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add any comments or reasons for your decision..."
                    className="mt-2"
                  />
                </div>
              )}
              
              {/* Previous Response */}
              {selectedRequest.adminResponse && (
                <div>
                  <h4 className="font-medium mb-2">Previous Admin Response</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedRequest.adminResponse}</p>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => processRequest(selectedRequest.id, 'approved', adminResponse)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => processRequest(selectedRequest.id, 'rejected', adminResponse)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsManagement;