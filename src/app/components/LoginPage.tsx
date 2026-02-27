import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLocation } from '../hooks/useLocation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { UtensilsCrossed } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { detectLocation } = useLocation();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') as 'provider' | 'receiver' | null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'provider' | 'receiver'>(roleFromUrl || 'receiver');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    localStorage.setItem('user', JSON.stringify({
      id: 'user-1',
      name: 'John Doe',
      email: email,
      role: selectedRole,
      rating: 4.8,
      foodSavedCount: 23
    }));
    if (selectedRole === 'receiver' || selectedRole === 'provider') {
      detectLocation(true);
    }
    navigate(selectedRole === 'provider' ? '/provider' : '/receiver');
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    localStorage.setItem('user', JSON.stringify({
      id: 'user-1',
      name: 'saranya',
      email: 'saranyamutham@gmail.com',
      role: selectedRole,
      rating: 4.8,
      foodSavedCount: 23
    }));
    if (selectedRole === 'receiver' || selectedRole === 'provider') {
      detectLocation(true);
    }
    navigate(selectedRole === 'provider' ? '/provider' : '/receiver');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side: Branding & Info (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 bg-green-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">LeftOverLink</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Feed Communities,<br />
              <span className="text-green-200">Reduce Waste.</span>
            </h1>
            <p className="text-lg text-green-50/90 max-w-md leading-relaxed">
              Join thousands of people and businesses sharing surplus food with those who need it most.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-8">
            <div>
              <div className="text-3xl font-bold mb-1">50k+</div>
              <div className="text-sm text-green-100/80">Meals Rescued</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-sm text-green-100/80">Active Heroes</div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <UtensilsCrossed className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-4">
              <Label>Select Your Role</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={selectedRole === 'receiver' ? 'default' : 'outline'}
                  className={selectedRole === 'receiver' ? 'bg-green-600' : ''}
                  onClick={() => setSelectedRole('receiver')}
                >
                  Receiver
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'provider' ? 'default' : 'outline'}
                  className={selectedRole === 'provider' ? 'bg-green-600' : ''}
                  onClick={() => setSelectedRole('provider')}
                >
                  Provider
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-semibold transition-all">
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-green-600 hover:text-green-700 hover:underline underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}