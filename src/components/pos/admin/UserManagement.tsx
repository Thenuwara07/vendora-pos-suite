import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCheck,
  UserX,
  Shield,
  ShoppingCart,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { dummyUsers } from '@/data/dummyData';
import { User, UserRole } from '@/types/pos';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'cashier' as UserRole,
    isActive: true
  });

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  const activeUsers = users.filter(u => u.isActive);
  const inactiveUsers = users.filter(u => !u.isActive);
  const adminUsers = users.filter(u => u.role === 'admin');
  const cashierUsers = users.filter(u => u.role === 'cashier');
  const salesmanUsers = users.filter(u => u.role === 'salesman');

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Error",
        description: "Email already exists",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      isActive: newUser.isActive ?? true,
      createdAt: new Date()
    };

    setUsers(prev => [...prev, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'cashier' as UserRole,
      isActive: true
    });
    setShowAddUser(false);

    toast({
      title: "Success",
      description: `${user.name} has been added as ${user.role}`,
    });
  };

  const updateUser = () => {
    if (!editingUser) return;

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setEditingUser(null);
    setShowEditUser(false);

    toast({
      title: "Success",
      description: `${editingUser.name} has been updated`,
    });
  };

  const deleteUser = (userToDelete: User) => {
    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
    
    toast({
      title: "Success",
      description: `${userToDelete.name} has been removed`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "Status Updated",
      description: `${user?.name} is now ${user?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Shield;
      case 'cashier': return ShoppingCart;
      case 'salesman': return TrendingUp;
      default: return Users;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'admin';
      case 'cashier': return 'cashier';
      case 'salesman': return 'salesman';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account for the POS system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email Address *</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Role *</label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full Access</SelectItem>
                    <SelectItem value="cashier">Cashier - POS Operations</SelectItem>
                    <SelectItem value="salesman">Salesman - Inventory Requests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active Status</label>
                <Switch
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              
              <Button onClick={addUser} className="w-full">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin">{users.length}</div>
            <p className="text-xs text-muted-foreground">{activeUsers.length} active, {inactiveUsers.length} inactive</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin">{adminUsers.length}</div>
            <p className="text-xs text-muted-foreground">Full access users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashiers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-cashier" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cashier">{cashierUsers.length}</div>
            <p className="text-xs text-muted-foreground">POS operators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salesmen</CardTitle>
            <TrendingUp className="h-4 w-4 text-salesman" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-salesman">{salesmanUsers.length}</div>
            <p className="text-xs text-muted-foreground">Stock managers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="salesman">Salesman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map(user => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${getRoleColor(user.role)}/10 rounded-full flex items-center justify-center`}>
                      <RoleIcon className={`w-6 h-6 text-${getRoleColor(user.role)}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={getRoleColor(user.role) as any} className="capitalize">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => toggleUserStatus(user.id)}
                      className="data-[state=checked]:bg-success"
                    />
                    
                    <Dialog open={showEditUser && editingUser?.id === user.id} onOpenChange={setShowEditUser}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditUser(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>Update user information and permissions</DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Full Name</label>
                              <Input
                                value={editingUser.name}
                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Email Address</label>
                              <Input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Role</label>
                              <Select 
                                value={editingUser.role} 
                                onValueChange={(value: UserRole) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin - Full Access</SelectItem>
                                  <SelectItem value="cashier">Cashier - POS Operations</SelectItem>
                                  <SelectItem value="salesman">Salesman - Inventory Requests</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Active Status</label>
                              <Switch
                                checked={editingUser.isActive}
                                onCheckedChange={(checked) => setEditingUser(prev => prev ? { ...prev, isActive: checked } : null)}
                              />
                            </div>
                            
                            <Button onClick={updateUser} className="w-full">Update User</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteUser(user)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;