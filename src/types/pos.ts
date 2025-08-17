export type UserRole = 'admin' | 'cashier' | 'salesman';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  barcode?: string;
  description?: string;
  supplierId?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Sale {
  id: string;
  invoiceId: string;
  cashierId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  timestamp: Date;
  customerInfo?: {
    name?: string;
    phone?: string;
  };
}

export interface SaleItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  id: string;
  items: SaleItem[];
  total: number;
  isPaused: boolean;
  createdAt: Date;
  cashierId: string;
}

export interface StockRequest {
  id: string;
  salesmanId: string;
  items: RequestedItem[];
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  adminResponse?: string;
  createdAt: Date;
  processedAt?: Date;
  processedBy?: string;
}

export interface RequestedItem {
  itemId?: string;
  itemName: string;
  quantity: number;
  isNewItem: boolean;
  suggestedPrice?: number;
  category?: string;
}

export interface Report {
  type: 'sales' | 'profit' | 'stock';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: any;
  generatedAt: Date;
}