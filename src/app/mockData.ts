import { FoodPost, User, Pickup, Donation } from './types';

// Calculate urgency based on time left
export function calculateUrgency(expiryTime: Date): 'fresh' | 'medium' | 'urgent' {
  const now = new Date();
  const hoursLeft = (expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft > 2) return 'fresh';
  if (hoursLeft > 1) return 'medium';
  return 'urgent';
}

// Calculate time left string
export function getTimeLeft(expiryTime: Date): string {
  const now = new Date();
  const msLeft = expiryTime.getTime() - now.getTime();

  if (msLeft < 0) return 'Expired';

  const minutesLeft = Math.floor(msLeft / (1000 * 60));
  const hoursLeft = Math.floor(minutesLeft / 60);

  if (hoursLeft > 0) {
    return `${hoursLeft}h ${minutesLeft % 60}m left`;
  }
  return `${minutesLeft}m left`;
}

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'riya agarwal',
  email: 'riya253@gmail.com',
  role: 'receiver',
  phone: '9867546928',
  rating: 4.8,
  foodSavedCount: 23
};

// Mock food posts with realistic data
export const mockFoodPosts: FoodPost[] = [
  {
    id: 'food-1',
    providerId: 'provider-1',
    providerName: 'Green Leaf Restaurant',
    foodType: 'Mixed Rice & Curry',
    isVeg: true,
    dietaryType: 'veg',
    quantity: 15,
    description: 'Fresh vegetable biryani and mixed curry',
    expiryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 mins
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'white field,bangalore'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 'food-2',
    providerId: 'provider-2',
    providerName: 'vishwakarma catering',
    foodType: 'lemon rice(pulihora)',
    isVeg: true,
    dietaryType: 'vegan',
    quantity: 20,
    description: 'Leftover lemon rice - completely plant-based',
    expiryTime: new Date(Date.now() + 90 * 60 * 1000), // 1.5 hours
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: 'kukatpally housing board colony,hyderabad'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'food-3',
    providerId: 'provider-3',
    providerName: 'Wedding Event - sharmas Family',
    foodType: 'Buffet Items',
    isVeg: true,
    dietaryType: 'mixed',
    quantity: 50,
    description: 'Variety of dishes from wedding reception (Veg & Non-Veg sections)',
    expiryTime: new Date(Date.now() + 150 * 60 * 1000), // 2.5 hours
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: 'minerva grand - dargamitta, nellore'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 20 * 60 * 1000)
  },
  {
    id: 'food-4',
    providerId: 'provider-4',
    providerName: 'Spice Garden',
    foodType: 'Indian Thali',
    isVeg: true,
    dietaryType: 'veg',
    quantity: 10,
    description: 'Complete thali meals with roti, rice, dal',
    expiryTime: new Date(Date.now() + 25 * 60 * 1000), // 25 mins - urgent!
    location: {
      lat: 40.7500,
      lng: -73.9900,
      address: 'east delhi mall,delhi'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 35 * 60 * 1000)
  },
  {
    id: 'food-5',
    providerId: 'provider-5',
    providerName: 'Home Kitchen - Sarah',
    foodType: 'Home Cooked Meals',
    isVeg: false,
    dietaryType: 'non-veg',
    quantity: 5,
    description: 'Chicken stew and rice',
    expiryTime: new Date(Date.now() + 120 * 60 * 1000), // 2 hours
    location: {
      lat: 40.7528,
      lng: -73.9765,
      address: 'lotus colony ,Mumbai'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'food-6',
    providerId: 'provider-6',
    providerName: 'Balaji Tiffins',
    foodType: 'Idli & Sambar',
    isVeg: true,
    dietaryType: 'vegan',
    quantity: 30,
    description: 'Fresh idli with hot sambar and chutney',
    expiryTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    location: {
      lat: 14.9131,
      lng: 79.9930,
      address: 'Near Clock Tower, Kavali'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 'food-7',
    providerId: 'provider-7',
    providerName: 'Grand Palace',
    foodType: 'Chicken Biryani',
    isVeg: false,
    dietaryType: 'non-veg',
    quantity: 12,
    description: 'Authentic Hyderabadi chicken biryani',
    expiryTime: new Date(Date.now() + 40 * 60 * 1000), // 40 mins
    location: {
      lat: 14.4426,
      lng: 79.9865,
      address: 'Magunta Layout, Nellore'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'food-8',
    providerId: 'provider-8',
    providerName: 'Sri Rama Catering',
    foodType: 'Curd Rice',
    isVeg: true,
    dietaryType: 'veg',
    quantity: 25,
    description: 'Refreshing curd rice with pickles',
    expiryTime: new Date(Date.now() + 180 * 60 * 1000), // 3 hours
    location: {
      lat: 15.5057,
      lng: 80.0499,
      address: 'Santhapet, Ongole'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    id: 'food-9',
    providerId: 'provider-9',
    providerName: 'Tirupati Bhawan',
    foodType: 'Pulihora (Tamarind Rice)',
    isVeg: true,
    dietaryType: 'vegan',
    quantity: 40,
    description: 'Prasadam style tamarind rice',
    expiryTime: new Date(Date.now() + 240 * 60 * 1000), // 4 hours
    location: {
      lat: 13.6288,
      lng: 79.4192,
      address: 'Alipiri Road, Tirupati'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 'food-10',
    providerId: 'provider-10',
    providerName: 'Vijayawada Delights',
    foodType: 'roti and curry',
    isVeg: true,
    dietaryType: 'veg',
    quantity: 15,
    description: 'roti and  veg curry',
    expiryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
    location: {
      lat: 16.5062,
      lng: 80.6480,
      address: 'Benz Circle, Vijayawada'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 'food-11',
    providerId: 'provider-11',
    providerName: 'Nellore Mess',
    foodType: 'vada and chutney',
    isVeg: true,
    dietaryType: 'vegan',
    quantity: 8,
    description: 'nellore vada and chutney',
    expiryTime: new Date(Date.now() + 50 * 60 * 1000), // 50 mins
    location: {
      lat: 14.4494,
      lng: 79.9821,
      address: 'Vedayapalem, Nellore'
    },
    status: 'available',
    postedAt: new Date(Date.now() - 12 * 60 * 1000)
  }
];

// Add urgency to food posts
mockFoodPosts.forEach(post => {
  post.urgency = calculateUrgency(post.expiryTime);
});

// Mock pickup history
export const mockPickupHistory: (Pickup & { foodPost: FoodPost })[] = [
  {
    id: 'pickup-1',
    foodPostId: 'food-old-1',
    providerId: 'provider-6',
    providerName: 'Ocean View Restaurant',
    receiverId: 'user-1',
    receiverName: 'Riya Agarwal',
    pickupTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    confirmed: true,
    rating: 5,
    foodPost: {
      id: 'food-old-1',
      providerId: 'provider-6',
      providerName: 'Ocean View Restaurant',
      foodType: 'Seafood Platter',
      isVeg: false,
      dietaryType: 'non-veg',
      quantity: 12,
      expiryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: 'savithri nagar,Guntur'
      },
      status: 'collected',
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  }
];

// Calculate distance between two points (simplified)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Mock donations
export const mockDonations: Donation[] = [
  {
    id: 'd1',
    donorId: 'user-2',
    donorName: 'Rahul Sharma',
    amount: 500,
    type: 'direct',
    message: 'Happy to support this great cause!',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 'd2',
    donorId: 'user-3',
    donorName: 'Priya Patel',
    amount: 250,
    type: 'direct',
    message: 'Reduce food waste!',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 'd3',
    donorId: 'user-4',
    donorName: 'Anonymous',
    amount: 1000,
    type: 'direct',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const totalDonationPool = mockDonations.reduce((sum, d) => sum + d.amount, 0);
