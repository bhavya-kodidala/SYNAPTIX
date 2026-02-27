import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { ArrowLeft, MapPin, Clock, Users, Leaf, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from '../hooks/useLocation';
import { motion, AnimatePresence } from 'motion/react';
import { ProviderWallet, WalletTransaction, FoodPost } from '../types';

export function PostFoodPage() {
  const navigate = useNavigate();
  const { detectLocation, isDetecting } = useLocation();

  const [step, setStep] = useState(1);
  const [roleMatched, setRoleMatched] = useState(false);

  // Form states
  const [foodCategory, setFoodCategory] = useState<'veg' | 'non-veg' | 'vegan' | 'mixed'>('veg');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState([10]);
  const [hoursUntilExpiry, setHoursUntilExpiry] = useState([2]);
  const [address, setAddress] = useState('');
  const [detectedLocation, setDetectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== 'provider') {
        navigate('/receiver');
      } else {
        setRoleMatched(true);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleDetectLocation = async () => {
    const location = await detectLocation();
    if (location) {
      setDetectedLocation(location);
      setAddress(location.address);
    }
  };

  const getEarnings = (q: number) => {
    let rate = 0;
    if (q <= 10) rate = 1;
    else if (q <= 20) rate = 5;
    else rate = 10;
    return q * rate;
  };

  const getRatePerMeal = (q: number) => {
    if (q <= 10) return 1;
    if (q <= 20) return 5;
    return 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please provide a pickup location');
      return;
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    const earnings = getEarnings(quantity[0]);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hoursUntilExpiry[0]);

    const newPost: FoodPost = {
      id: `p-${Date.now()}`,
      providerId: user.id,
      providerName: user.name,
      foodType: description.substring(0, 30) + (description.length > 30 ? '...' : ''),
      isVeg: foodCategory === 'veg' || foodCategory === 'vegan',
      dietaryType: foodCategory,
      quantity: quantity[0],
      description: description,
      expiryTime: expiryDate,
      location: {
        lat: detectedLocation?.lat || 0,
        lng: detectedLocation?.lng || 0,
        address: address,
      },
      status: 'available',
      postedAt: new Date(),
      urgency: hoursUntilExpiry[0] < 2 ? 'urgent' : hoursUntilExpiry[0] < 5 ? 'medium' : 'fresh'
    };

    // Save post
    const existingPostsStr = localStorage.getItem('mockFoodPosts');
    const existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : [];
    localStorage.setItem('mockFoodPosts', JSON.stringify([newPost, ...existingPosts]));

    // Update Provider Wallet
    const walletStr = localStorage.getItem('providerWallet');
    let wallet: ProviderWallet;
    if (walletStr) {
      wallet = JSON.parse(walletStr);
    } else {
      wallet = {
        balanceINR: 0,
        totalEarnings: 0,
        totalMealsDonated: 0,
        transactions: []
      };
    }

    const newTransaction: WalletTransaction = {
      id: `tr-${Date.now()}`,
      userId: user.id,
      type: 'earning',
      amount: earnings * 50, // standard conversion for display if needed, but we use amountINR
      amountINR: earnings,
      description: `Earned for posting ${quantity[0]} meals`,
      status: 'completed',
      timestamp: new Date()
    };

    const updatedWallet: ProviderWallet = {
      ...wallet,
      balanceINR: wallet.balanceINR + earnings,
      totalEarnings: wallet.totalEarnings + earnings,
      totalMealsDonated: wallet.totalMealsDonated + quantity[0],
      transactions: [newTransaction, ...wallet.transactions]
    };

    localStorage.setItem('providerWallet', JSON.stringify(updatedWallet));

    toast.success('Food posted successfully!', {
      description: `You earned ₹${earnings} for this donation.`
    });

    setTimeout(() => {
      navigate('/provider');
    }, 1500);
  };

  if (!roleMatched) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b px-4 py-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else navigate('/provider');
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Post Surplus Food</h1>
              <p className="text-xs text-muted-foreground">Step {step} of 4</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-green-600' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 space-y-8">

                {/* Step 1: Category */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-2">What type of food?</h2>
                      <p className="text-muted-foreground">Select a category to help receivers find your post</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'veg', label: 'Vegetarian', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
                        { id: 'non-veg', label: 'Non-Veg', icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
                        { id: 'vegan', label: 'Vegan', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { id: 'mixed', label: 'Mixed Combo', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setFoodCategory(cat.id as any)}
                          className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 group ${foodCategory === cat.id
                            ? 'border-green-600 bg-green-50/50 shadow-md ring-1 ring-green-600/20'
                            : 'border-muted hover:border-muted-foreground/30 bg-card'
                            }`}
                        >
                          <div className={`p-3 rounded-xl w-fit ${cat.bg}`}>
                            <cat.icon className={`w-6 h-6 ${cat.color}`} />
                          </div>
                          <div>
                            <div className="font-bold">{cat.label}</div>
                            <p className="text-[10px] text-muted-foreground">Fresh and healthy options</p>
                          </div>
                          {foodCategory === cat.id && (
                            <div className="absolute top-4 right-4 text-green-600 bg-white rounded-full shadow-sm">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <Button onClick={() => setStep(2)} className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl shadow-lg shadow-green-600/20">
                      Next Step <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Description */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Describe the meal</h2>
                      <p className="text-muted-foreground">Add details to help receivers know what to expect</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Food Description *</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="e.g., 20 Packets of Vegetable Biryani with Raita. Freshly cooked for a canceled event."
                          className="min-h-[160px] text-lg rounded-xl border-2 focus:border-green-600"
                        />
                      </div>

                      <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 flex gap-3">
                        <div className="p-2 bg-blue-500 text-white rounded-lg h-fit">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-blue-600/80 leading-relaxed">
                          <strong>Honesty builds trust:</strong> Briefly mention if the food contains allergens like nuts, soy or dairy to ensure community safety.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="h-14 flex-1 rounded-xl">Back</Button>
                      <Button onClick={() => setStep(3)} disabled={!description} className="h-14 flex-[2] bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl shadow-lg shadow-green-600/20">
                        Continue <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Quantity & Expiry */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Quantity & Expiry</h2>
                      <p className="text-muted-foreground">How many people can this serve and for how long?</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          <Label className="text-lg font-bold">Serves approx.</Label>
                        </div>
                        <div className="text-3xl font-black text-green-600">{quantity[0]} ppl</div>
                      </div>

                      <Slider
                        value={quantity}
                        onValueChange={setQuantity}
                        min={1}
                        max={100}
                        step={1}
                        className="py-4"
                      />

                      {/* Points/Earnings Display */}
                      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm font-medium uppercase tracking-widest mb-1">Impact Reward</p>
                            <h3 className="text-3xl font-black">₹{getEarnings(quantity[0])}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-100/80 mb-1">Status</p>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                              {quantity[0] <= 10 ? 'Standard Contribution' : quantity[0] <= 50 ? 'Community Hero' : 'Impact Champion'}
                            </div>
                          </div>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                      </div>
                    </div>

                    {/* Expiry Selector */}
                    <div className="space-y-6 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <Label className="text-lg font-bold">Best before</Label>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">{hoursUntilExpiry[0]} hrs</div>
                      </div>

                      <Slider
                        value={hoursUntilExpiry}
                        onValueChange={setHoursUntilExpiry}
                        min={0.5}
                        max={12}
                        step={0.5}
                        className="py-4"
                      />

                      <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 flex gap-3 italic">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <p className="text-xs text-orange-700/80">
                          Receivers must pick up within this timeframe. Short expiry items are prioritized on the map.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="h-14 flex-1 rounded-xl">Back</Button>
                      <Button onClick={() => setStep(4)} className="h-14 flex-[2] bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl shadow-lg shadow-green-600/20">
                        Almost Done <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Location */}
                {step === 4 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Pickup Location</h2>
                      <p className="text-muted-foreground">Tell us where the food can be collected</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-green-600 transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter street, landmark, or apartment..."
                          className="h-14 pl-12 text-lg rounded-xl border-2 focus:border-green-600 transition-all"
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        className={`w-full justify-center h-12 rounded-xl text-green-700 font-bold hover:bg-green-50 ${isDetecting ? 'opacity-50' : ''}`}
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                      >
                        {isDetecting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent animate-spin rounded-full"></div>
                            Detecting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">📍 Use my current location</span>
                        )}
                      </Button>

                      {detectedLocation && (
                        <div className="p-4 bg-muted/30 rounded-xl border flex items-start gap-3">
                          <div className="p-2 bg-green-600 text-white rounded-lg">
                            <Check className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Address Verified</p>
                            <p className="text-sm font-medium">{detectedLocation.address}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary Preview */}
                    <Card className="bg-muted/50 border-none rounded-2xl p-6 space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Post Preview</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Category</p>
                          <p className="text-sm font-bold capitalize">{foodCategory}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Quantity</p>
                          <p className="text-sm font-bold">Feeds {quantity[0]} ppl</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Earnings</p>
                          <p className="text-sm font-bold text-green-600">₹{getEarnings(quantity[0])} (₹{getRatePerMeal(quantity[0])}/meal)</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Expiry</p>
                          <p className="text-sm font-bold text-orange-600">{hoursUntilExpiry[0]} hours</p>
                        </div>
                      </div>
                    </Card>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(3)} className="h-14 flex-1 rounded-xl">Back</Button>
                      <Button type="submit" className="h-14 flex-[2] bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl shadow-lg shadow-green-600/20">
                        Post Food Now
                      </Button>
                    </div>
                  </form>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
