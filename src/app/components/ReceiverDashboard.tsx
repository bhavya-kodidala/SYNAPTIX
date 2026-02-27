import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    UtensilsCrossed,
    MapPin,
    Clock,
    Search,
    History,
    Bell,
    User as UserIcon,
    LogOut,
    Leaf,
    Calendar,
    Star,
    CreditCard,
    Smartphone,
    Landmark,
    Wallet,
    Banknote,
    ChevronLeft,
    Building,
    Building2,
    UserCheck,
    CheckCircle2,
    AlertCircle,
    IndianRupee
} from 'lucide-react';
import { mockFoodPosts, getTimeLeft, calculateDistance } from '../mockData';
import { FoodPost, PaymentMethod, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from '../hooks/useLocation';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

export function ReceiverDashboard() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'veg' | 'non-veg' | 'vegan' | 'mixed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChangingLocation, setIsChangingLocation] = useState(false);
    const [tempAddress, setTempAddress] = useState('');
    const [userSettings, setUserSettings] = useState<any>(null);
    const { detectLocation, watchLocation, isDetecting: isLocationDetecting, permissionStatus } = useLocation();

    // Pickup Flow States
    const [selectedFood, setSelectedFood] = useState<FoodPost | null>(null);
    const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false);
    const [pickupStep, setPickupStep] = useState<'details' | 'payment'>('details');
    const [requestedMeals, setRequestedMeals] = useState<string>('1');
    const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);

    // Payment States
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [paymentData, setPaymentData] = useState<any>({});
    const [upiApp, setUpiApp] = useState<string>('gpay');

    // Mock History Data
    const [pickupHistory] = useState([
        {
            id: 'h1',
            foodType: 'Mixed Rice',
            providerName: 'Green Leaf',
            pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            impact: 15,
            isVeg: true
        },
        {
            id: 'h2',
            foodType: 'Pasta',
            providerName: 'Bella Italia',
            pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            impact: 20,
            isVeg: false
        }
    ]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role !== 'receiver') {
                navigate('/provider');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const saved = localStorage.getItem('userSettings');
        let currentSettings;
        if (saved) {
            currentSettings = JSON.parse(saved);
        } else {
            currentSettings = {
                autoLocation: true,
                alertRadius: '10',
                address: 'Not detected',
                lat: 0,
                lng: 0
            };
            localStorage.setItem('userSettings', JSON.stringify(currentSettings));
        }
        setUserSettings(currentSettings);

        // Auto-detect if enabled and no coordinates present
        if (currentSettings.autoLocation && (currentSettings.lat === 0 || currentSettings.lng === 0)) {
            handleAutoDetect(true);
        }

        // Setup watcher for movement
        const watchId = watchLocation((coords) => {
            setUserSettings((prev: any) => {
                const updated = { ...prev, lat: coords.lat, lng: coords.lng };
                localStorage.setItem('userSettings', JSON.stringify(updated));
                return updated;
            });
        });

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const handleAutoDetect = async (silent = false) => {
        const location = await detectLocation(silent);
        if (location) {
            const updated = {
                ...JSON.parse(localStorage.getItem('userSettings') || '{}'),
                lat: location.lat,
                lng: location.lng,
                address: location.address
            };
            localStorage.setItem('userSettings', JSON.stringify(updated));
            setUserSettings(updated);
            if (!silent) toast.success('Location detected');
        }
    };

    const handleManualLocation = () => {
        if (!tempAddress.trim()) return;
        const updated = {
            ...userSettings,
            address: tempAddress,
            lat: 0,
            lng: 0,
            autoLocation: false
        };
        localStorage.setItem('userSettings', JSON.stringify(updated));
        setUserSettings(updated);
        setIsChangingLocation(false);
        toast.success(`Location set to ${tempAddress}`);
    };

    const filteredPosts = mockFoodPosts
        .filter(post => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return post.foodType.toLowerCase().includes(query) ||
                    post.providerName.toLowerCase().includes(query) ||
                    post.location.address.toLowerCase().includes(query);
            }
            if (filter !== 'all' && post.dietaryType !== filter) return false;

            if (userSettings?.autoLocation && userSettings?.lat && userSettings?.lng) {
                const distance = calculateDistance(userSettings.lat, userSettings.lng, post.location.lat, post.location.lng);
                return distance <= parseFloat(userSettings.alertRadius || '10');
            }
            return true;
        })
        .map(post => {
            let distance = null;
            if (userSettings?.lat && userSettings?.lng) {
                distance = calculateDistance(userSettings.lat, userSettings.lng, post.location.lat, post.location.lng);
            }
            return { ...post, distance };
        })
        .sort((a, b) => {
            // Primarily sort by distance (closest first)
            if (a.distance !== null && b.distance !== null) {
                return a.distance - b.distance;
            }
            // If only one has distance, prioritize it
            if (a.distance !== null) return -1;
            if (b.distance !== null) return 1;
            // Fallback to posted date (newest first)
            return b.postedAt.getTime() - a.postedAt.getTime();
        });

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const calculateBilling = (meals: number) => {
        let pricePerPlate = 1;
        if (meals > 10 && meals <= 20) pricePerPlate = 5;
        if (meals > 20) pricePerPlate = 10;
        return {
            pricePerPlate,
            totalAmount: meals * pricePerPlate
        };
    };

    const handleConfirmPickup = async () => {
        const meals = parseInt(requestedMeals);
        if (isNaN(meals) || meals <= 0) {
            toast.error('Please enter a valid number of meals');
            return;
        }

        if (selectedFood && meals > selectedFood.quantity) {
            toast.error(`Only ${selectedFood.quantity} meals available`);
            return;
        }

        // Transition to payment step instead of direct confirm
        setPickupStep('payment');
    };

    const validatePayment = () => {
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return false;
        }

        if (paymentMethod === 'upi') {
            if (!paymentData.upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(paymentData.upiId)) {
                toast.error('Please enter a valid UPI ID (e.g. name@upi)');
                return false;
            }
        }

        if (paymentMethod === 'net-banking') {
            if (!paymentData.bankName || !paymentData.accountNumber || !paymentData.ifsc || !paymentData.holderName) {
                toast.error('Please fill all banking fields');
                return false;
            }
            if (paymentData.accountNumber.length < 9) {
                toast.error('Invalid account number');
                return false;
            }
            if (paymentData.ifsc.length !== 11) {
                toast.error('IFSC should be 11 characters');
                return false;
            }
        }

        if (paymentMethod === 'debit-card' || paymentMethod === 'credit-card') {
            if (!paymentData.cardNumber || paymentData.cardNumber.length !== 16) {
                toast.error('Card number must be 16 digits');
                return false;
            }
            if (!paymentData.holderName) {
                toast.error('Please enter card holder name');
                return false;
            }
            if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
                toast.error('Expiry must be MM/YY');
                return false;
            }
            if (!paymentData.cvv || paymentData.cvv.length !== 3) {
                toast.error('CVV must be 3 digits');
                return false;
            }
        }

        return true;
    };

    const handleProcessPayment = async () => {
        if (!validatePayment()) return;
        if (!selectedFood) return;

        setIsSubmittingPickup(true);

        // Simulate API call and saving pickup
        const meals = parseInt(requestedMeals);
        const billing = calculateBilling(meals);
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const newPickup = {
            id: `p-${Date.now()}`,
            foodPostId: selectedFood.id,
            providerId: selectedFood.providerId,
            providerName: selectedFood.providerName,
            receiverId: user.id,
            receiverName: user.name,
            numberOfMeals: meals,
            totalPrice: billing.totalAmount,
            pickupTime: new Date(),
            confirmed: true,
            foodType: selectedFood.foodType,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
        };

        const paymentRecord: PaymentRecord = {
            id: `pay-${Date.now()}`,
            receiverId: user.id,
            foodId: selectedFood.id,
            numberOfMeals: meals,
            totalPrice: billing.totalAmount,
            paymentMethod: paymentMethod!,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
            paymentDetails: paymentData,
            timestamp: new Date()
        };

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save to history (mock)
        const history = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
        localStorage.setItem('pickupHistory', JSON.stringify([newPickup, ...history]));

        // Save payment record
        const payments = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        localStorage.setItem('paymentHistory', JSON.stringify([paymentRecord, ...payments]));

        // Award points and update wallet
        const walletStr = localStorage.getItem('receiverWallet');
        let wallet;
        if (walletStr) {
            wallet = JSON.parse(walletStr);
        } else {
            wallet = {
                points: 100, // Starting bonus points for demo
                balanceINR: 2,
                totalOrders: 0,
                totalPointsEarned: 100,
                transactions: []
            };
        }

        const awardedPoints = 50;
        const newTransaction: any = {
            id: `tr-${Date.now()}`,
            userId: user.id,
            type: 'earning',
            amount: awardedPoints,
            amountINR: awardedPoints / 50,
            description: `Earned for ${selectedFood.foodType} pickup`,
            status: 'completed',
            timestamp: new Date()
        };

        const updatedWallet = {
            ...wallet,
            points: wallet.points + awardedPoints,
            balanceINR: (wallet.points + awardedPoints) / 50,
            totalOrders: wallet.totalOrders + 1,
            totalPointsEarned: wallet.totalPointsEarned + awardedPoints,
            transactions: [newTransaction, ...wallet.transactions]
        };

        localStorage.setItem('receiverWallet', JSON.stringify(updatedWallet));

        setIsSubmittingPickup(false);
        setIsPickupDialogOpen(false);

        if (paymentMethod === 'cod') {
            toast.success(`Success! You will pay ₹${billing.totalAmount} at the time of pickup.`);
        } else {
            toast.success(`Payment Successful! Total: ₹${billing.totalAmount}`);
        }

        navigate('/pickup-confirmation');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-background border-b px-4 py-3 sticky top-0 z-10">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
                        <UtensilsCrossed className="w-8 h-8" />
                        <span>LeftOverLink <Badge variant="outline" className="ml-2 text-xs">Receiver</Badge></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 font-bold gap-2 px-3 h-9"
                            onClick={() => navigate('/wallet')}
                        >
                            <Wallet className="w-4 h-4" />
                            <span className="hidden sm:inline">Wallet</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                            <UserIcon className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="w-5 h-5 text-red-500" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6">
                <Tabs defaultValue="nearby" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
                        <TabsTrigger value="nearby" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Nearby Food
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="w-4 h-4" /> Pickup History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="nearby" className="space-y-6">
                        {permissionStatus === 'denied' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4"
                            >
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-amber-900 text-sm">Location Access Required</h5>
                                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                        For better results, please enable location access in your browser settings.
                                        Alternatively, you can manually enter your city below.
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-amber-700 text-xs font-bold underline"
                                    onClick={() => setIsChangingLocation(true)}
                                >
                                    Manually Set
                                </Button>
                            </motion.div>
                        )}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">Food Near You</h2>
                                {userSettings?.address && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {userSettings.address}
                                        </p>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-green-600" onClick={() => setIsChangingLocation(!isChangingLocation)}>
                                            Change
                                        </Button>
                                    </div>
                                )}
                                {isChangingLocation && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={tempAddress}
                                            onChange={(e) => setTempAddress(e.target.value)}
                                            placeholder="Enter location..."
                                            className="text-sm px-3 py-1.5 border rounded-md bg-background w-64 focus:ring-2 focus:ring-green-500 outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleManualLocation()}
                                        />
                                        <Button size="sm" onClick={handleManualLocation}>Save</Button>
                                    </div>
                                )}
                            </div>
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search food or providers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'All', icon: UtensilsCrossed },
                                { id: 'veg', label: 'Veg', icon: Leaf, color: 'text-green-600 bg-green-50 border-green-200' },
                                { id: 'non-veg', label: 'Non-Veg', icon: UtensilsCrossed, color: 'text-red-600 bg-red-50 border-red-200' },
                                { id: 'vegan', label: 'Vegan', icon: Leaf, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                                { id: 'mixed', label: 'Mixed', icon: Building2, color: 'text-orange-600 bg-orange-50 border-orange-200' }
                            ].map((item: any) => (
                                <Button
                                    key={item.id}
                                    variant={filter === item.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter(item.id as any)}
                                    className={`rounded-full px-4 h-9 font-bold transition-all ${filter === item.id
                                        ? 'bg-green-600 hover:bg-green-700 shadow-md scale-105 border-transparent text-white'
                                        : 'hover:border-green-300'
                                        }`}
                                >
                                    <item.icon className={`w-3.5 h-3.5 mr-2 ${filter === item.id ? 'text-white' : (item.color?.split(' ')[0] || 'text-muted-foreground')}`} />
                                    {item.label}
                                </Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <Card className="overflow-hidden hover:shadow-xl transition-all border-green-100 dark:border-green-900/30">
                                                <div className="p-5 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{post.foodType}</h3>
                                                            <p className="text-sm text-muted-foreground">{post.providerName}</p>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={`gap-1 font-bold ${post.dietaryType === 'veg' ? 'text-green-600 border-green-200 bg-green-50/50' :
                                                                post.dietaryType === 'non-veg' ? 'text-red-600 border-red-200 bg-red-50/50' :
                                                                    post.dietaryType === 'vegan' ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50' :
                                                                        'text-orange-600 border-orange-200 bg-orange-50/50'
                                                                }`}
                                                        >
                                                            {post.dietaryType === 'veg' && <Leaf className="w-3 h-3" />}
                                                            {post.dietaryType === 'vegan' && <Leaf className="w-3 h-3" />}
                                                            {post.dietaryType === 'non-veg' && <UtensilsCrossed className="w-3 h-3" />}
                                                            {post.dietaryType === 'mixed' && <Building2 className="w-3 h-3" />}
                                                            <span className="capitalize">{post.dietaryType}</span>
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{post.distance ? `${post.distance.toFixed(1)} km away` : post.location.address}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="w-4 h-4" />
                                                            <span className={post.urgency === 'urgent' ? 'text-red-500 font-bold' : ''}>
                                                                Expires in {getTimeLeft(post.expiryTime)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 dark:shadow-none"
                                                        onClick={() => {
                                                            setSelectedFood(post);
                                                            setRequestedMeals('1');
                                                            setIsPickupDialogOpen(true);
                                                        }}
                                                    >
                                                        Request Pickup
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="col-span-full py-20 text-center space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-2xl font-bold">No food available here</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">
                                            We couldn't find any {filter !== 'all' ? filter : ''} food items matching your location or search. Try expanding your search radius or checking back later!
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setFilter('all');
                                            }}
                                            className="mt-4 border-green-600 text-green-600 hover:bg-green-50"
                                        >
                                            Clear all filters
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">Your Pickup History</h2>
                            <div className="grid gap-4">
                                {pickupHistory.map((item) => (
                                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                    <UtensilsCrossed className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{item.foodType}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.providerName}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {item.pickupDate.toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                                            <Leaf className="w-3 h-3" />
                                                            {item.impact} meals saved
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                                                View Details
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
                                    Full Impact Dashboard
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Pickup Dialog */}
            <Dialog open={isPickupDialogOpen} onOpenChange={(open) => {
                setIsPickupDialogOpen(open);
                if (!open) {
                    setPickupStep('details');
                    setPaymentMethod(null);
                    setPaymentData({});
                }
            }}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none">
                    {selectedFood && (
                        <div className="flex flex-col">
                            {/* Unified Header */}
                            <div className="bg-green-600 p-6 text-white text-center sm:text-left relative overflow-hidden">
                                {pickupStep === 'payment' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-2 text-white hover:bg-white/10"
                                        onClick={() => setPickupStep('details')}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                )}
                                <DialogHeader className="p-0 text-white">
                                    <DialogTitle className="text-xl font-black">
                                        {pickupStep === 'details' ? 'Confirm Pickup' : 'Payment Interface'}
                                    </DialogTitle>
                                    <DialogDescription className="text-green-100 text-xs">
                                        {pickupStep === 'details' ? 'Review details and complete your request' : 'Select a payment method and complete the transaction'}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-6 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0">
                                        {pickupStep === 'details' ? <UtensilsCrossed className="w-6 h-6 text-white" /> : <Wallet className="w-6 h-6 text-white" />}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-lg leading-tight">
                                            {pickupStep === 'details' ? selectedFood.foodType : `Total: ₹${calculateBilling(parseInt(requestedMeals)).totalAmount}`}
                                        </h4>
                                        <p className="text-sm text-green-100 flex items-center gap-1 mt-1">
                                            <Building2 className="w-3 h-3" /> {selectedFood.providerName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 bg-background max-h-[70vh] overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {pickupStep === 'details' ? (
                                        <motion.div
                                            key="details"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Status</Label>
                                                        <div className="flex items-center gap-2 text-sm font-bold">
                                                            <Badge variant="outline" className="text-green-600 border-green-200">
                                                                {selectedFood.quantity} Meals Left
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</Label>
                                                        <p className="text-sm font-bold flex items-center gap-1 truncate">
                                                            <MapPin className="w-3 h-3 text-green-600" />
                                                            {selectedFood.location.address}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                                                    <div className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border italic">
                                                        "{selectedFood.description || 'No description provided'}"
                                                    </div>
                                                </div>

                                                <div className="h-px bg-muted w-full" />

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-bold uppercase tracking-widest">How many meals?</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max={selectedFood.quantity}
                                                                value={requestedMeals}
                                                                onChange={(e) => setRequestedMeals(e.target.value)}
                                                                className="w-20 h-10 text-center font-bold border-2 focus:border-green-600 rounded-lg"
                                                            />
                                                            <span className="text-xs font-medium text-muted-foreground">/ {selectedFood.quantity}</span>
                                                        </div>
                                                    </div>

                                                    {/* Billing Summary */}
                                                    <div className="bg-slate-50 dark:bg-zinc-900 border rounded-xl p-4 space-y-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-muted-foreground">Price per plate</span>
                                                            <span className="font-bold flex items-center text-green-600">
                                                                <IndianRupee className="w-3 h-3" />
                                                                {calculateBilling(parseInt(requestedMeals) || 0).pricePerPlate}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-lg">
                                                            <span className="font-black uppercase tracking-tighter text-sm">Total Amount</span>
                                                            <span className="font-black text-green-600 flex items-center text-2xl">
                                                                <IndianRupee className="w-4 h-4" />
                                                                {calculateBilling(parseInt(requestedMeals) || 0).totalAmount}
                                                            </span>
                                                        </div>

                                                        <div className="pt-2 border-t border-dashed">
                                                            <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-tight">
                                                                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                                                <span>Tier: 1-10 (₹1), 11-20 (₹5), 21-50 (₹10). Proceeds help maintain hygiene and delivery logistics.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 h-12 rounded-xl font-bold"
                                                    onClick={() => setIsPickupDialogOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="flex-1 h-12 rounded-xl font-black bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                                                    onClick={handleConfirmPickup}
                                                    disabled={parseInt(requestedMeals) > selectedFood.quantity || parseInt(requestedMeals) <= 0}
                                                >
                                                    Continue to Payment
                                                </Button>
                                            </DialogFooter>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="payment"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Payment Method</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { id: 'cod', label: 'Cash on Pickup', icon: Banknote },
                                                        { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                                                        { id: 'net-banking', label: 'Net Banking', icon: Landmark },
                                                        { id: 'debit-card', label: 'Debit Card', icon: CreditCard },
                                                        { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
                                                    ].map((method) => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setPaymentMethod(method.id as any)}
                                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${paymentMethod === method.id
                                                                ? 'border-green-600 bg-green-50/50'
                                                                : 'hover:border-green-200 bg-muted/20'
                                                                }`}
                                                        >
                                                            <method.icon className={`w-6 h-6 ${paymentMethod === method.id ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                            <span className={`text-[10px] font-black uppercase text-center ${paymentMethod === method.id ? 'text-green-900' : 'text-muted-foreground'}`}>
                                                                {method.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>

                                                <AnimatePresence mode="wait">
                                                    {paymentMethod === 'cod' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 text-sm flex gap-3">
                                                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                                                            <p><strong>Confirm:</strong> You will pay the amount at the time of pickup to the provider.</p>
                                                        </motion.div>
                                                    )}

                                                    {paymentMethod === 'upi' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                                            <div className="flex gap-2 p-1 bg-muted rounded-lg overflow-x-auto">
                                                                {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                                                                    <button
                                                                        key={app}
                                                                        onClick={() => setUpiApp(app)}
                                                                        className={`flex-1 min-w-[70px] py-2 text-[9px] font-black uppercase rounded-md transition-all ${upiApp === app ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-muted-foreground'}`}
                                                                    >
                                                                        {app}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <Input
                                                                placeholder="Enter UPI ID (e.g. name@upi)"
                                                                value={paymentData.upiId || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                                                                className="h-12 border-2 focus:border-green-600 rounded-xl font-medium"
                                                            />
                                                        </motion.div>
                                                    )}

                                                    {paymentMethod === 'net-banking' && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                                                            <Input
                                                                placeholder="Bank Name"
                                                                className="col-span-2 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                value={paymentData.bankName || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="Account Holder Name"
                                                                className="col-span-2 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                value={paymentData.holderName || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, holderName: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="Account Number"
                                                                className="h-11 border-2 focus:border-green-600 rounded-xl"
                                                                value={paymentData.accountNumber || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="IFSC Code"
                                                                className="h-11 border-2 focus:border-green-600 rounded-xl uppercase"
                                                                maxLength={11}
                                                                value={paymentData.ifsc || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, ifsc: e.target.value })}
                                                            />
                                                        </motion.div>
                                                    )}

                                                    {(paymentMethod === 'debit-card' || paymentMethod === 'credit-card') && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3">
                                                            <Input
                                                                placeholder="Card Number (16 digits)"
                                                                className="col-span-4 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                maxLength={16}
                                                                value={paymentData.cardNumber || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="Card Holder Name"
                                                                className="col-span-4 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                value={paymentData.holderName || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, holderName: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="MM/YY"
                                                                className="col-span-2 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                maxLength={5}
                                                                value={paymentData.expiry || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="CVV"
                                                                className="col-span-2 h-11 border-2 focus:border-green-600 rounded-xl"
                                                                maxLength={3}
                                                                type="password"
                                                                value={paymentData.cvv || ''}
                                                                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <Button
                                                    className="flex-1 h-14 rounded-xl font-black bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                                                    disabled={isSubmittingPickup || !paymentMethod}
                                                    onClick={handleProcessPayment}
                                                >
                                                    {isSubmittingPickup ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        paymentMethod === 'cod' ? 'Confirm Pickup' : 'Proceed to Pay'
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
