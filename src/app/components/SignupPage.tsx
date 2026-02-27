import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLocation } from '../hooks/useLocation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { UtensilsCrossed, User, Store, ShieldCheck, Heart, Leaf } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const { detectLocation } = useLocation();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') as 'provider' | 'receiver' | null;

  const [role, setRole] = useState<'provider' | 'receiver'>(roleFromUrl || 'receiver');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would connect to backend
    localStorage.setItem('user', JSON.stringify({
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      role,
      rating: 5.0,
      foodSavedCount: 0
    }));
    if (role === 'receiver') {
      detectLocation(true);
    }
    navigate(role === 'provider' ? '/provider' : '/receiver');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Information Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/3 bg-green-600 text-white p-10 flex-col justify-between sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LeftOverLink</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-8">
            Be a Hero in<br />
            Your Community.
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Share Surplus</h3>
                <p className="text-sm text-green-50/80 leading-relaxed">Connect with people who can use extra food you have.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Save the Planet</h3>
                <p className="text-sm text-green-50/80 leading-relaxed">Reduce food waste and your carbon footprint with every pickup.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verified Community</h3>
                <p className="text-sm text-green-50/80 leading-relaxed">Join a trusted network of verified NGOs and food providers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-green-100/60 font-medium tracking-wide">
          © 2026 LEFTOVERLINK. ALL RIGHTS RESERVED.
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Signup Form Section */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground mt-2">Join our mission to eliminate food waste</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Select your role</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('receiver')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${role === 'receiver'
                    ? 'border-green-600 bg-green-500/5 ring-1 ring-green-600/20'
                    : 'border-muted hover:border-muted-foreground/30 bg-muted/20'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${role === 'receiver' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold">Receiver</div>
                  <p className="text-[10px] text-muted-foreground text-center">NGOs, Volunteers, Individuals</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${role === 'provider'
                    ? 'border-green-600 bg-green-500/5 ring-1 ring-green-600/20'
                    : 'border-muted hover:border-muted-foreground/30 bg-muted/20'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${role === 'provider' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold">Provider</div>
                  <p className="text-[10px] text-muted-foreground text-center">Restaurants, Catering, Homes</p>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 border border-muted rounded-xl flex items-start gap-3">
              <div className="p-1.5 bg-background rounded-lg text-green-600">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy. Location access will be used to show nearby food listings.
              </p>
            </div>

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-bold transition-all shadow-lg shadow-green-600/20">
              Create My Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-green-600 hover:text-green-700 hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}