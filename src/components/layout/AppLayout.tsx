import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePOS } from '@/lib/pos-context';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
  User,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'POS', icon: ShoppingCart },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/reports', label: 'Reports', icon: BarChart3, adminOnly: true },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = usePOS();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl pos-gradient-bg">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">SwiftPOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems
            .filter(item => !item.adminOnly || user.role === 'admin')
            .map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-4 w-4 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto pos-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
