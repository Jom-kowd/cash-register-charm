export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'cashier';
  password: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  cashier: string;
  timestamp: Date;
}

export interface DailySummary {
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  averageTransaction: number;
}
