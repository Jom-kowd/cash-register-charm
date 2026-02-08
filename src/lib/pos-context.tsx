import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Product, CartItem, Sale } from './types';
import { USERS, PRODUCTS, generateSampleSales, TAX_RATE } from './data';

interface POSState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkout: (amountPaid: number, discount: number) => Sale | null;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
}

const POSContext = createContext<POSState | null>(null);

export const usePOS = () => {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be within POSProvider');
  return ctx;
};

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(() => generateSampleSales('John Manager'));

  const login = useCallback((username: string, password: string) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      if (product.stock <= 0) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.product.id !== productId));
      return;
    }
    setCart(prev => prev.map(c => {
      if (c.product.id === productId) {
        const newQty = Math.min(qty, c.product.stock);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartSubtotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);
  const cartTax = cartSubtotal * TAX_RATE;
  const cartTotal = cartSubtotal + cartTax;

  const checkout = useCallback((amountPaid: number, discount: number) => {
    if (cart.length === 0 || !user) return null;
    const subtotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + tax;

    if (amountPaid < total) return null;

    const sale: Sale = {
      id: `sale-${Date.now()}`,
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
        total: c.product.price * c.quantity,
      })),
      subtotal,
      tax,
      discount,
      total,
      amountPaid,
      change: amountPaid - total,
      cashier: user.name,
      timestamp: new Date(),
    };

    // Update stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    }));

    setSales(prev => [sale, ...prev]);
    setCart([]);
    return sale;
  }, [cart, user]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `p-${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <POSContext.Provider value={{
      user, products, cart, sales,
      login, logout,
      addToCart, removeFromCart, updateCartQty, clearCart, checkout,
      addProduct, updateProduct, deleteProduct,
      cartSubtotal, cartTax, cartTotal,
    }}>
      {children}
    </POSContext.Provider>
  );
};
