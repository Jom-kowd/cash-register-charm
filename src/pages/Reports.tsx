import { usePOS } from '@/lib/pos-context';
import { CATEGORIES } from '@/lib/data';
import { BarChart3, Calendar } from 'lucide-react';

const Reports = () => {
  const { sales, products } = usePOS();

  // Sales by category
  const categoryStats = CATEGORIES.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const catProductIds = catProducts.map(p => p.id);
    let totalQty = 0;
    let totalRev = 0;
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (catProductIds.includes(item.productId)) {
          totalQty += item.quantity;
          totalRev += item.total;
        }
      });
    });
    return { ...cat, totalQty, totalRev };
  }).sort((a, b) => b.totalRev - a.totalRev);

  const maxRev = Math.max(...categoryStats.map(c => c.totalRev), 1);

  // Top products
  const productStats: Record<string, { name: string; qty: number; rev: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = { name: item.productName, qty: 0, rev: 0 };
      }
      productStats[item.productId].qty += item.quantity;
      productStats[item.productId].rev += item.total;
    });
  });
  const topProducts = Object.values(productStats).sort((a, b) => b.rev - a.rev).slice(0, 10);
  const maxProductRev = Math.max(...topProducts.map(p => p.rev), 1);

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalTax = sales.reduce((s, sale) => s + sale.tax, 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Sales Reports</h1>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="pos-card p-5">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="pos-card p-5">
          <p className="text-xs text-muted-foreground">Total Transactions</p>
          <p className="mt-1 font-mono text-2xl font-bold text-info">{sales.length}</p>
        </div>
        <div className="pos-card p-5">
          <p className="text-xs text-muted-foreground">Tax Collected</p>
          <p className="mt-1 font-mono text-2xl font-bold text-warning">${totalTax.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category breakdown */}
        <div className="pos-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Revenue by Category</h2>
          <div className="space-y-3">
            {categoryStats.map(cat => (
              <div key={cat.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="font-mono text-muted-foreground">${cat.totalRev.toFixed(2)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(cat.totalRev / maxRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="pos-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <span className="font-mono text-muted-foreground">{p.qty} sold · ${p.rev.toFixed(2)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${(p.rev / maxProductRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
