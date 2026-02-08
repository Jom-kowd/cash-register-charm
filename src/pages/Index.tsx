import { useState, useMemo } from 'react';
import { usePOS } from '@/lib/pos-context';
import { CATEGORIES } from '@/lib/data';
import { Search, Plus, Minus, Trash2, X, Receipt, Percent } from 'lucide-react';
import ReceiptModal from '@/components/pos/ReceiptModal';
import { Sale } from '@/lib/types';

const POSScreen = () => {
  const {
    products, cart,
    addToCart, removeFromCart, updateCartQty, clearCart, checkout,
    cartSubtotal, cartTax, cartTotal,
  } = usePOS();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || p.categoryId === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const discountedTotal = cartTotal - discount + (discount > 0 ? discount * 0.08 : 0);
  const actualTotal = Math.max(0, cartSubtotal - discount + (cartSubtotal - discount) * 0.08);
  const change = parseFloat(amountPaid || '0') - actualTotal;

  const handleCheckout = () => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < actualTotal) return;
    const sale = checkout(paid, discount);
    if (sale) {
      setCompletedSale(sale);
      setShowCheckout(false);
      setDiscount(0);
      setAmountPaid('');
    }
  };

  const quickAmounts = [5, 10, 20, 50, 100];

  return (
    <div className="flex h-full">
      {/* Product Grid */}
      <div className="flex flex-1 flex-col p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {/* Categories */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-auto pos-scrollbar md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => {
            const inCart = cart.find(c => c.product.id === product.id);
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`group relative flex flex-col rounded-lg border p-3 text-left transition-all ${
                  product.stock <= 0
                    ? 'cursor-not-allowed border-border bg-muted opacity-50'
                    : inCart
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {inCart && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {inCart.quantity}
                  </span>
                )}
                <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{product.sku}</p>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <span className="font-mono text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span className={`text-xs ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {product.stock} left
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="flex w-96 flex-col border-l border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Current Order</h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-destructive hover:underline">Clear All</button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4 pos-scrollbar">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Receipt className="mb-2 h-12 w-12 opacity-30" />
              <p className="text-sm">No items in order</p>
              <p className="text-xs">Tap products to add</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 rounded-lg bg-secondary p-3 animate-scale-in">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.product.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground hover:bg-border"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground hover:bg-border"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="w-16 text-right font-mono text-sm font-bold text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-border p-4">
            {!showCheckout ? (
              <>
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span className="font-mono">${cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span className="font-mono">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full rounded-lg pos-gradient-bg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Charge ${cartTotal.toFixed(2)}
                </button>
              </>
            ) : (
              <div className="animate-fade-in space-y-3">
                {/* Discount */}
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Percent className="h-3 w-3" /> Discount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount || ''}
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="font-mono">${actualTotal.toFixed(2)}</span>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Amount Paid</label>
                  <input
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={e => setAmountPaid(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-lg text-foreground outline-none focus:border-primary"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmountPaid(String(amt))}
                      className="flex-1 rounded-lg bg-secondary py-2 font-mono text-sm text-foreground hover:bg-muted"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                {parseFloat(amountPaid) >= actualTotal && (
                  <div className="rounded-lg bg-primary/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Change</p>
                    <p className="font-mono text-2xl font-bold text-primary">${change.toFixed(2)}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowCheckout(false); setAmountPaid(''); setDiscount(0); }}
                    className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={!amountPaid || parseFloat(amountPaid) < actualTotal}
                    className="flex-1 rounded-lg pos-gradient-bg py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Complete Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {completedSale && (
        <ReceiptModal sale={completedSale} onClose={() => setCompletedSale(null)} />
      )}
    </div>
  );
};

export default POSScreen;
