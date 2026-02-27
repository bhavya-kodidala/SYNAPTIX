import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, MapPin, Star, Leaf, Award, TrendingUp, Droplet, TreePine, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HistoryItem {
  id: string;
  foodType: string;
  isVeg: boolean;
  quantity: number;
  providerName: string;
  pickupDate: Date;
  location: string;
  rating?: number;
  impact: number; // meals saved
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

export function PickupHistoryPage() {
  const navigate = useNavigate();
  const [history] = useState<HistoryItem[]>([
    {
      id: 'history-1',
      foodType: 'Mixed Rice & Curry',
      isVeg: true,
      quantity: 15,
      providerName: 'Green Leaf Restaurant',
      pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      location: '123 Main St, New York',
      rating: 5,
      impact: 15
    },
    {
      id: 'history-2',
      foodType: 'vada and chutney',
      isVeg: false,
      quantity: 20,
      providerName: 'Nellore Mess',
      pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      location: 'Vedayapalem, Nellore',
      rating: 5,
      impact: 20
    },
    {
      id: 'history-3',
      foodType: 'Wedding Buffet',
      isVeg: true,
      quantity: 50,
      providerName: 'Wedding Event - sharmas Family',
      pickupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: 'minerva grand - dargamitta, nellore',
      rating: 5,
      impact: 50
    },
    {
      id: 'history-4',
      foodType: 'Curd Rice',
      isVeg: true,
      quantity: 12,
      providerName: 'Sri Rama Catering',
      pickupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      location: 'Santhapet, Ongole',
      rating: 4,
      impact: 12
    },
    {
      id: 'history-5',
      foodType: 'Mixed Rice & Curry',
      isVeg: true,
      quantity: 8,
      providerName: 'Green Leaf Restaurant',
      pickupDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      location: 'white field,bangalore',
      rating: 5,
      impact: 8
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'First Rescue',
      description: 'Saved your first meal from waste',
      icon: '🎯',
      earned: true
    },
    {
      id: '2',
      name: 'Eco Warrior',
      description: 'Saved 50 meals from waste',
      icon: '🌍',
      earned: true
    },
    {
      id: '3',
      name: 'Century Club',
      description: 'Saved 100 meals',
      icon: '💯',
      earned: false,
      progress: 97,
      total: 100
    },
    {
      id: '4',
      name: 'Streak Master',
      description: '7-day pickup streak',
      icon: '🔥',
      earned: true
    },
    {
      id: '5',
      name: 'Community Hero',
      description: 'Top contributor this month',
      icon: '⭐',
      earned: false,
      progress: 3,
      total: 1
    }
  ]);

  const totalMealsSaved = history.reduce((sum, item) => sum + item.impact, 0);
  const totalPickups = history.length;
  const averageRating = (history.reduce((sum, item) => sum + (item.rating || 0), 0) / history.length).toFixed(1);
  const co2Saved = (totalMealsSaved * 2.5).toFixed(1); // kg
  const waterSaved = (totalMealsSaved * 150).toFixed(0); // liters
  const userLevel = Math.floor(totalMealsSaved / 20) + 1;
  const userPoints = totalMealsSaved * 10;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-green-700"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">Your Impact Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6 pb-20">
        {/* Level & Points Card */}
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Food Saver Level</div>
              <div className="text-4xl font-bold mt-1">Level {userLevel}</div>
              <div className="text-sm opacity-90 mt-2">{userPoints} Points</div>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${((totalMealsSaved % 20) / 20) * 100}%` }}
            />
          </div>
          <div className="text-xs opacity-90 mt-1">
            {20 - (totalMealsSaved % 20)} meals until Level {userLevel + 1}
          </div>
        </Card>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5" />
              <div className="text-xs opacity-90">Meals Saved</div>
            </div>
            <div className="text-3xl font-bold">{totalMealsSaved}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <div className="text-xs opacity-90">CO₂ Saved</div>
            </div>
            <div className="text-3xl font-bold">{co2Saved}</div>
            <div className="text-xs opacity-90">kg</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5" />
              <div className="text-xs opacity-90">Water Saved</div>
            </div>
            <div className="text-3xl font-bold">{waterSaved}</div>
            <div className="text-xs opacity-90">liters</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" />
              <div className="text-xs opacity-90">Avg Rating</div>
            </div>
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="text-xs opacity-90">/ 5.0</div>
          </motion.div>
        </div>

        {/* Environmental Impact Comparison */}
        <Card className="p-6 bg-green-500/10 border-green-500/20">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Your Environmental Impact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TreePine className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-sm font-medium">Equivalent to planting</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(parseFloat(co2Saved) / 1.5)} trees
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplet className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-sm font-medium">That's enough water for</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(parseInt(waterSaved) / 50)} people per day
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs for History and Achievements */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Pickup History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3 mt-4">
            {history.length === 0 ? (
              <Card className="p-8 text-center bg-card border">
                <div className="text-muted-foreground">No pickup history yet</div>
              </Card>
            ) : (
              history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{item.foodType}</h3>
                          {item.isVeg && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                              <Leaf className="w-3 h-3 mr-1" />
                              Veg
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.providerName}</p>
                      </div>
                      {item.rating && (
                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold">{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.pickupDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-bold">
                          {item.impact} meals saved
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3 mt-4">
            <div className="grid gap-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-4 border ${achievement.earned ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20' : 'opacity-60 grayscale'}`}>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{achievement.name}</h3>
                          {achievement.earned && (
                            <Badge className="bg-yellow-500 text-white border-0">Earned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {!achievement.earned && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="bg-muted rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
