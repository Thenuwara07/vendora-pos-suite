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
  Filter
} from 'lucide-react';
import { dummyItems, dummyCategories } from '@/data/dummyData';
import { Item, Category } from '@/types/pos';
import { useToast } from '@/hooks/use-toast';

const InventoryManagement = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(dummyItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<Item>>({
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

  const addItem = () => {
    if (!newItem.name || !newItem.category || newItem.price === undefined || newItem.stock === undefined) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: Item = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      stock: Number(newItem.stock),
      lowStockThreshold: Number(newItem.lowStockThreshold) || 5,
      barcode: newItem.barcode || `BC${Date.now()}`,
      description: newItem.description || ''
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

    toast({
      title: "Success",
      description: `${item.name} has been added to inventory`,
    });
  };

  const updateItem = () => {
    if (!editingItem) return;

    setItems(prev => prev.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    
    setEditingItem(null);
    setShowEditItem(false);

    toast({
      title: "Success",
      description: `${editingItem.name} has been updated`,
    });
  };

  const deleteItem = (itemToDelete: Item) => {
    setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
    
    toast({
      title: "Success",
      description: `${itemToDelete.name} has been removed from inventory`,
    });
  };

  const updateStock = (itemId: string, newStock: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, stock: newStock } : item
    ));
    
    const item = items.find(i => i.id === itemId);
    toast({
      title: "Stock Updated",
      description: `${item?.name} stock updated to ${newStock}`,
    });
  };

  const bulkStockUpdate = () => {
    const updates = lowStockItems.map(item => ({
      ...item,
      stock: item.lowStockThreshold + 10
    }));
    
    setItems(prev => prev.map(item => {
      const update = updates.find(u => u.id === item.id);
      return update || item;
    }));

    toast({
      title: "Bulk Update Complete",
      description: `Updated stock for ${updates.length} low stock items`,
    });
  };

  const getStockStatusColor = (item: Item) => {
    if (item.stock === 0) return 'destructive';
    if (item.stock <= item.lowStockThreshold) return 'warning';
    return 'success';
  };

  const getStockStatusText = (item: Item) => {
    if (item.stock === 0) return 'Out of Stock';
    if (item.stock <= item.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your store's inventory and stock levels</p>
        </div>
        
        <div className="flex gap-2">
          {lowStockItems.length > 0 && (
            <Button variant="outline" onClick={bulkStockUpdate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Restock Low Items
            </Button>
          )}
          
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>Add a new product to your inventory</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <Select 
                      value={newItem.category} 
                      onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stock *</label>
                    <Input
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Low Stock Alert</label>
                    <Input
                      type="number"
                      value={newItem.lowStockThreshold}
                      onChange={(e) => setNewItem(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 5 }))}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Barcode</label>
                  <Input
                    value={newItem.barcode}
                    onChange={(e) => setNewItem(prev => ({ ...prev, barcode: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description"
                  />
                </div>
                
                <Button onClick={addItem} className="w-full">Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin">{items.length}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dummyCategories.length}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
            <CardDescription>These items need immediate restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-card rounded border">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{item.stock} left</Badge>
                    <Input
                      type="number"
                      className="w-16 h-8"
                      defaultValue={item.stock}
                      onBlur={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, barcode, or ID..."
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

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category} • {item.barcode}</p>
                    </div>
                    <Badge variant={getStockStatusColor(item) as any}>
                      {getStockStatusText(item)}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                    <p className="text-sm text-muted-foreground">Price</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={item.stock}
                        onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={showEditItem && editingItem?.id === item.id} onOpenChange={setShowEditItem}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditItem(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                          <DialogDescription>Update product details</DialogDescription>
                        </DialogHeader>
                        {editingItem && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                  value={editingItem.name}
                                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Price</label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingItem.price}
                                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Stock</label>
                                <Input
                                  type="number"
                                  value={editingItem.stock}
                                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Low Stock Threshold</label>
                                <Input
                                  type="number"
                                  value={editingItem.lowStockThreshold}
                                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, lowStockThreshold: parseInt(e.target.value) || 5 } : null)}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                value={editingItem.description}
                                onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                              />
                            </div>
                            
                            <Button onClick={updateItem} className="w-full">Update Item</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;