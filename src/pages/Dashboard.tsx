import { usePOS } from '@/lib/pos-context';
import { CATEGORIES } from '@/lib/data';
import { DollarSign, ShoppingBag, TrendingUp, Package, Clock } from 'lucide-react';

const Dashboard = () => {
  const { sales, products } = usePOS();

  const today = new Date();
  const todaySales = sales.filter(s => {
    const d = new Date(s.timestamp);
    return d.toDateString() === today.toDateString();
  });

  const totalRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalItems = todaySales.reduce((sum, s) => sum + s.items.reduce((a, i) => a + i.quantity, 0), 0);
  const avgTransaction = todaySales.length > 0 ? totalRevenue / todaySales.length : 0;
  const lowStock = products.filter(p => p.stock <= 10);

  const stats = [
    { label: "Today's Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Transactions', value: todaySales.length, icon: ShoppingBag, color: 'text-info' },
    { label: 'Items Sold', value: totalItems, icon: TrendingUp, color: 'text-warning' },
    { label: 'Avg Transaction', value: `$${avgTransaction.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="pos-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className={`mt-1 font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="pos-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Transactions
          </h2>
          <div className="space-y-3 max-h-80 overflow-auto pos-scrollbar">
            {todaySales.slice(0, 8).map(sale => (
              <div key={sale.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.timestamp).toLocaleTimeString()} · {sale.cashier}
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-primary">${sale.total.toFixed(2)}</span>
              </div>
            ))}
            {todaySales.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No sales today yet</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="pos-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Package className="h-4 w-4 text-destructive" />
            Low Stock Alert
          </h2>
          <div className="space-y-3 max-h-80 overflow-auto pos-scrollbar">
            {lowStock.map(product => {
              const cat = CATEGORIES.find(c => c.id === product.categoryId);
              return (
                <div key={product.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{cat?.name}</p>
                  </div>
                  <span className={`font-mono text-sm font-bold ${product.stock <= 5 ? 'text-destructive' : 'text-warning'}`}>
                    {product.stock} left
                  </span>
                </div>
              );
            })}
            {lowStock.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">All stock levels healthy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
