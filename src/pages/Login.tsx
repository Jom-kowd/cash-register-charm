import { useState } from 'react';
import { usePOS } from '@/lib/pos-context';
import { ShoppingCart, LogIn } from 'lucide-react';

const Login = () => {
  const { login } = usePOS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const success = login(username.trim(), password.trim());
    if (!success) setError('Invalid username or password');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl pos-gradient-bg pos-glow">
            <ShoppingCart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Joms POS SYSTEM</h1>
          <p className="mt-1 text-muted-foreground">Point of Sale System</p>
        </div>

        {/* Login Card */}
        <div className="pos-card p-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg pos-gradient-bg px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo Accounts</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">Admin:</span> admin / admin123</p>
              <p className="text-foreground"><span className="text-muted-foreground">Cashier:</span> cashier / cashier123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
