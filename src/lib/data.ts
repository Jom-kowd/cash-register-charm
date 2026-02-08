import { User, Category, Product, Sale } from './types';

export const USERS: User[] = [
  { id: '1', username: 'admin', name: 'John Manager', role: 'admin', password: 'admin123' },
  { id: '2', username: 'cashier', name: 'Sarah Cashier', role: 'cashier', password: 'cashier123' },
  { id: '3', username: 'cashier2', name: 'Mike Cashier', role: 'cashier', password: 'cashier123' },
];

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Beverages', color: 'hsl(200 70% 50%)' },
  { id: 'cat2', name: 'Snacks', color: 'hsl(35 90% 55%)' },
  { id: 'cat3', name: 'Dairy', color: 'hsl(280 60% 55%)' },
  { id: 'cat4', name: 'Bakery', color: 'hsl(15 80% 55%)' },
  { id: 'cat5', name: 'Produce', color: 'hsl(130 60% 45%)' },
  { id: 'cat6', name: 'Household', color: 'hsl(50 80% 50%)' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Coca Cola 500ml', categoryId: 'cat1', price: 1.50, stock: 120, sku: 'BEV001' },
  { id: 'p2', name: 'Orange Juice 1L', categoryId: 'cat1', price: 3.25, stock: 45, sku: 'BEV002' },
  { id: 'p3', name: 'Mineral Water 500ml', categoryId: 'cat1', price: 0.99, stock: 200, sku: 'BEV003' },
  { id: 'p4', name: 'Green Tea Bottle', categoryId: 'cat1', price: 2.10, stock: 65, sku: 'BEV004' },
  { id: 'p5', name: 'Energy Drink', categoryId: 'cat1', price: 2.99, stock: 80, sku: 'BEV005' },
  { id: 'p6', name: 'Potato Chips', categoryId: 'cat2', price: 2.49, stock: 90, sku: 'SNK001' },
  { id: 'p7', name: 'Chocolate Bar', categoryId: 'cat2', price: 1.75, stock: 150, sku: 'SNK002' },
  { id: 'p8', name: 'Mixed Nuts 200g', categoryId: 'cat2', price: 4.99, stock: 40, sku: 'SNK003' },
  { id: 'p9', name: 'Granola Bar', categoryId: 'cat2', price: 1.25, stock: 100, sku: 'SNK004' },
  { id: 'p10', name: 'Whole Milk 1L', categoryId: 'cat3', price: 2.15, stock: 60, sku: 'DRY001' },
  { id: 'p11', name: 'Cheddar Cheese', categoryId: 'cat3', price: 3.99, stock: 35, sku: 'DRY002' },
  { id: 'p12', name: 'Greek Yogurt', categoryId: 'cat3', price: 1.89, stock: 55, sku: 'DRY003' },
  { id: 'p13', name: 'Butter 250g', categoryId: 'cat3', price: 2.75, stock: 42, sku: 'DRY004' },
  { id: 'p14', name: 'Sourdough Bread', categoryId: 'cat4', price: 3.50, stock: 25, sku: 'BAK001' },
  { id: 'p15', name: 'Croissant', categoryId: 'cat4', price: 1.99, stock: 30, sku: 'BAK002' },
  { id: 'p16', name: 'Banana (per lb)', categoryId: 'cat5', price: 0.69, stock: 100, sku: 'PRD001' },
  { id: 'p17', name: 'Apple Red', categoryId: 'cat5', price: 0.89, stock: 85, sku: 'PRD002' },
  { id: 'p18', name: 'Tomatoes (per lb)', categoryId: 'cat5', price: 1.49, stock: 70, sku: 'PRD003' },
  { id: 'p19', name: 'Paper Towels', categoryId: 'cat6', price: 4.50, stock: 50, sku: 'HH001' },
  { id: 'p20', name: 'Dish Soap', categoryId: 'cat6', price: 3.25, stock: 40, sku: 'HH002' },
];

// Generate some sample sales for dashboard
export const generateSampleSales = (cashierName: string): Sale[] => {
  const now = new Date();
  const sales: Sale[] = [];
  for (let i = 0; i < 12; i++) {
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      const total = product.price * qty;
      subtotal += total;
      items.push({
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.price,
        total,
      });
    }
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const amountPaid = Math.ceil(total / 5) * 5;
    sales.push({
      id: `sale-${i + 1}`,
      items,
      subtotal,
      tax,
      discount: 0,
      total,
      amountPaid,
      change: amountPaid - total,
      cashier: i % 2 === 0 ? cashierName : 'Sarah Cashier',
      timestamp: new Date(now.getTime() - i * 3600000 * Math.random() * 3),
    });
  }
  return sales;
};

export const TAX_RATE = 0.08; // 8%
