import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from './Navigation';
import AdminDashboard from './admin/AdminDashboard';
import POSInterface from './cashier/POSInterface';
import SalesmanDashboard from './salesman/SalesmanDashboard';

const POSLayout = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  // Set default view based on user role
  useEffect(() => {
    if (user?.role === 'cashier') {
      setCurrentView('pos');
    } else {
      setCurrentView('dashboard');
    }
  }, [user?.role]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setCurrentView('dashboard');
            break;
          case '2':
            event.preventDefault();
            setCurrentView('pos');
            break;
          case '3':
            event.preventDefault();
            if (user?.role === 'admin') setCurrentView('reports');
            if (user?.role === 'cashier') setCurrentView('bills');
            if (user?.role === 'salesman') setCurrentView('stock');
            break;
          case '4':
            event.preventDefault();
            if (user?.role === 'admin') setCurrentView('inventory');
            if (user?.role === 'salesman') setCurrentView('requests');
            break;
          case '5':
            event.preventDefault();
            if (user?.role === 'admin') setCurrentView('users');
            break;
          case '6':
            event.preventDefault();
            if (user?.role === 'admin') setCurrentView('requests');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user?.role]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (user?.role === 'admin') return <AdminDashboard />;
        if (user?.role === 'salesman') return <SalesmanDashboard />;
        return <div>Dashboard not available for this role</div>;
      
      case 'pos':
        return <POSInterface />;
      
      case 'reports':
        return <div className="p-6">Reports coming soon...</div>;
      
      case 'inventory':
        return <div className="p-6">Inventory management coming soon...</div>;
      
      case 'users':
        return <div className="p-6">User management coming soon...</div>;
      
      case 'requests':
        return <div className="p-6">Requests management coming soon...</div>;
      
      case 'bills':
        return <div className="p-6">Bill history coming soon...</div>;
      
      case 'stock':
        return <SalesmanDashboard />;
      
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <div className="w-64 border-r border-border">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default POSLayout;