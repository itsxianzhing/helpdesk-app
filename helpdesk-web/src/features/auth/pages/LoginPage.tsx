import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { LockKeyhole, Mail } from 'lucide-react';

import { login as loginApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

interface DemoAccount {
  role: 'Admin' | 'User';
  email: string;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Admin',
    email: 'demo.admin@helpdesk.local',
    password: 'Admin123!',
  },
  {
    role: 'User',
    email: 'budi@helpdesk.local',
    password: 'User123!',
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    setError(null);
    setIsLoading(true);

    try {
      const response = await loginApi({
        email: trimmedEmail,
        password,
      });

      login(response);

      if (response.role === 'Admin') {
        navigate('/admin/dashboard', {
          replace: true,
        });
      } else {
        navigate('/dashboard', {
          replace: true,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDemoAccount(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

          <p className="mt-2 text-sm text-muted-foreground">Sign in to your Helpdesk account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
                className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
                className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">Demo account</span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoAccount(account)}
                className="w-full rounded-md border bg-background p-3 text-left transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{account.role}</span>

                  <span className="text-xs text-muted-foreground">Click to fill</span>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">{account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
