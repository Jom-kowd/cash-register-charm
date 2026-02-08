import { useState } from 'react';
import { usePOS } from '@/lib/pos-context';
import { CATEGORIES } from '@/lib/data';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { Product } from '@/lib/types';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, user } = usePOS();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', categoryId: 'cat1', price: '', stock: '', sku: '' });

  const isAdmin = user?.role === 'admin';

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingProduct(null);
    setForm({ name: '', categoryId: 'cat1', price: '', stock: '', sku: '' });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, categoryId: p.categoryId, price: String(p.price), stock: String(p.stock), sku: p.sku });
    setShowForm(true);
  };

  const handleSave = () => {
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock);
    if (!form.name.trim() || isNaN(price) || isNaN(stock) || !form.sku.trim()) return;

    if (editingProduct) {
      updateProduct({ ...editingProduct, name: form.name.trim(), categoryId: form.categoryId, price, stock, sku: form.sku.trim() });
    } else {
      addProduct({ name: form.name.trim(), categoryId: form.categoryId, price, stock, sku: form.sku.trim() });
    }
    setShowForm(false);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        {isAdmin && (
          <button onClick={openNew} className="flex items-center gap-2 rounded-lg pos-gradient-bg px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="pos-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
              {isAdmin && <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => {
              const cat = CATEGORIES.find(c => c.id === product.categoryId);
              return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-3 text-sm font-medium text-foreground">{product.name}</td>
                  <td className="p-3 font-mono text-sm text-muted-foreground">{product.sku}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {cat?.name}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-sm font-semibold text-foreground">${product.price.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <span className={`font-mono text-sm font-semibold ${product.stock <= 5 ? 'text-destructive' : product.stock <= 10 ? 'text-warning' : 'text-foreground'}`}>
                      {product.stock}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">SKU</label>
                <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Category</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>
              <button onClick={handleSave} className="w-full rounded-lg pos-gradient-bg py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
