import { User, Item, Category, Sale, StockRequest, Bill } from '@/types/pos';

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@pos.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'John Cashier',
    email: 'john@pos.com',
    role: 'cashier',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Mike Salesman',
    email: 'mike@pos.com',
    role: 'salesman',
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Sarah Cashier',
    email: 'sarah@pos.com',
    role: 'cashier',
    isActive: false,
    createdAt: new Date('2024-01-20')
  }
];

export const dummyCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic items and accessories' },
  { id: '2', name: 'Clothing', description: 'Apparel and fashion items' },
  { id: '3', name: 'Food & Beverages', description: 'Food and drink items' },
  { id: '4', name: 'Books & Stationery', description: 'Books, notebooks, and office supplies' },
  { id: '5', name: 'Home & Garden', description: 'Home improvement and garden items' }
];

export const dummyItems: Item[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 89.99,
    stock: 25,
    lowStockThreshold: 5,
    barcode: '1234567890',
    description: 'Bluetooth wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 19.99,
    stock: 3,
    lowStockThreshold: 10,
    barcode: '2345678901',
    description: '100% cotton comfortable t-shirt'
  },
  {
    id: '3',
    name: 'Coffee Beans 1kg',
    category: 'Food & Beverages',
    price: 24.99,
    stock: 15,
    lowStockThreshold: 8,
    barcode: '3456789012',
    description: 'Premium arabica coffee beans'
  },
  {
    id: '4',
    name: 'Notebook A4',
    category: 'Books & Stationery',
    price: 5.99,
    stock: 2,
    lowStockThreshold: 15,
    barcode: '4567890123',
    description: 'Ruled notebook 200 pages'
  },
  {
    id: '5',
    name: 'LED Desk Lamp',
    category: 'Electronics',
    price: 45.99,
    stock: 12,
    lowStockThreshold: 5,
    barcode: '5678901234',
    description: 'Adjustable LED desk lamp with USB charging'
  },
  {
    id: '6',
    name: 'Jeans',
    category: 'Clothing',
    price: 59.99,
    stock: 8,
    lowStockThreshold: 5,
    barcode: '6789012345',
    description: 'Classic blue denim jeans'
  },
  {
    id: '7',
    name: 'Green Tea Box',
    category: 'Food & Beverages',
    price: 12.99,
    stock: 20,
    lowStockThreshold: 10,
    barcode: '7890123456',
    description: 'Organic green tea 25 bags'
  },
  {
    id: '8',
    name: 'Ballpoint Pen Set',
    category: 'Books & Stationery',
    price: 8.99,
    stock: 1,
    lowStockThreshold: 20,
    barcode: '8901234567',
    description: 'Set of 10 blue ballpoint pens'
  }
];

export const dummySales: Sale[] = [
  {
    id: '1',
    invoiceId: 'INV-2024-001',
    cashierId: '2',
    items: [
      { itemId: '1', itemName: 'Wireless Headphones', quantity: 1, price: 89.99, total: 89.99 },
      { itemId: '3', itemName: 'Coffee Beans 1kg', quantity: 2, price: 24.99, total: 49.98 }
    ],
    total: 139.97,
    paymentMethod: 'card',
    timestamp: new Date('2024-08-15T10:30:00'),
    customerInfo: { name: 'John Doe', phone: '+1234567890' }
  },
  {
    id: '2',
    invoiceId: 'INV-2024-002',
    cashierId: '2',
    items: [
      { itemId: '2', itemName: 'Cotton T-Shirt', quantity: 3, price: 19.99, total: 59.97 }
    ],
    total: 59.97,
    paymentMethod: 'cash',
    timestamp: new Date('2024-08-15T14:20:00')
  },
  {
    id: '3',
    invoiceId: 'INV-2024-003',
    cashierId: '4',
    items: [
      { itemId: '5', itemName: 'LED Desk Lamp', quantity: 1, price: 45.99, total: 45.99 },
      { itemId: '4', itemName: 'Notebook A4', quantity: 5, price: 5.99, total: 29.95 }
    ],
    total: 75.94,
    paymentMethod: 'upi',
    timestamp: new Date('2024-08-14T16:45:00')
  }
];

export const dummyStockRequests: StockRequest[] = [
  {
    id: '1',
    salesmanId: '3',
    items: [
      { itemId: '2', itemName: 'Cotton T-Shirt', quantity: 50, isNewItem: false },
      { itemId: '4', itemName: 'Notebook A4', quantity: 100, isNewItem: false }
    ],
    status: 'pending',
    message: 'Urgent restocking needed for high-demand items',
    createdAt: new Date('2024-08-15T09:00:00')
  },
  {
    id: '2',
    salesmanId: '3',
    items: [
      { itemName: 'Smartphone Case', quantity: 30, isNewItem: true, suggestedPrice: 15.99, category: 'Electronics' }
    ],
    status: 'approved',
    message: 'New product request for smartphone accessories',
    createdAt: new Date('2024-08-14T11:30:00'),
    processedAt: new Date('2024-08-14T15:20:00'),
    processedBy: '1'
  }
];

export const dummyBills: Bill[] = [
  {
    id: '1',
    items: [
      { itemId: '7', itemName: 'Green Tea Box', quantity: 2, price: 12.99, total: 25.98 }
    ],
    total: 25.98,
    isPaused: true,
    createdAt: new Date('2024-08-15T12:00:00'),
    cashierId: '2'
  }
];

// Utility functions for dummy data operations
export const generateInvoiceId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = Date.now();
  return `INV-${year}${month}${day}-${time}`;
};

export const getLowStockItems = (): Item[] => {
  return dummyItems.filter(item => item.stock <= item.lowStockThreshold);
};

export const getSalesByPeriod = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
  const now = new Date();
  const filteredSales = dummySales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    switch (period) {
      case 'daily':
        return saleDate.toDateString() === now.toDateString();
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= weekAgo;
      case 'monthly':
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      case 'yearly':
        return saleDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
  
  return {
    totalSales: filteredSales.reduce((sum, sale) => sum + sale.total, 0),
    totalTransactions: filteredSales.length,
    sales: filteredSales
  };
};