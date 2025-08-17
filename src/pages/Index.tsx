import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/pos/LoginForm';
import POSLayout from '@/components/pos/POSLayout';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <POSLayout />;
};

export default Index;
