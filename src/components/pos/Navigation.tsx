import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Store, 
  LogOut, 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'requests', label: 'Requests', icon: AlertTriangle },
        ];
      case 'cashier':
        return [
          { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
          { id: 'bills', label: 'Bill History', icon: FileText },
        ];
      case 'salesman':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'stock', label: 'Stock Status', icon: Package },
          { id: 'requests', label: 'My Requests', icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const roleColors = {
    admin: 'admin',
    cashier: 'cashier',
    salesman: 'salesman'
  };
  const roleColor = roleColors[user?.role || 'admin'];

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${roleColor} rounded-lg flex items-center justify-center`}>
            <Store className={`w-5 h-5 text-${roleColor}-foreground`} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">POS System</h1>
            <p className="text-sm text-muted-foreground capitalize">{user?.role} Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                isActive 
                  ? `bg-${roleColor} text-${roleColor}-foreground hover:bg-${roleColor}/90` 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-8 h-8 bg-${roleColor}/10 rounded-full flex items-center justify-center`}>
            <UserCheck className={`w-4 h-4 text-${roleColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;