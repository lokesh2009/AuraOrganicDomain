export type ProductCategory = 'all' | 'organic-powders' | 'superfood-powders' | 'ritual-boxes' | 'pure-extracts';

export type WellnessBenefit = 'all' | 'calm-sleep' | 'focus-energy' | 'digestive-harmony' | 'immune-defense';

export type SubscriptionCadence = 4 | 6 | 8; // weeks

export interface ChronoRitual {
  bestTimeOfDay: string; // e.g. "Early Morning (6:00 AM – 8:00 AM) on an empty stomach"
  timeCategory: 'morning' | 'midday' | 'evening' | 'bedtime' | 'all-day';
  liquidMedium: string; // e.g. "Warm A2 Cow Milk or Oat Milk"
  liquidTemperature: 'Warm (50-60°C)' | 'Lukewarm (35-40°C)' | 'Room Temperature' | 'Hot Water (not boiling)';
  liquidAmount: string; // e.g. "200 ml (1 full cup)"
  exactDosage: string; // e.g. "1 rounded teaspoon (approx 5 grams)"
  preparationMethod: string;
  synergyBooster: string;
  targetHealthNeed: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'ritual-boxes' | 'superfood-powders' | 'pure-extracts' | 'organic-powders';
  categoryLabel: string;
  benefits: WellnessBenefit[];
  benefitLabels: string[];
  price: number;
  mrp?: number;
  isHimalayanOrganicsRange?: boolean;
  powderSubcategory?: 'greens-detox' | 'adaptogens-brain' | 'heart-endurance' | 'gut-cleanse' | 'womens-wellness' | 'daily-vitality';
  subscriptionDiscount: number; // e.g. 0.15 (15% off)
  image: string;
  volumeOrWeight: string;
  tagline: string;
  description: string;
  tastingNotes: string[];
  origin: string;
  harvestMethod: string;
  brewingRitual: string;
  keyBotanicals: string[];
  certifications: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  primaryBenefit?: string; // High-converting consumer outcome (e.g. "⚡ 75%+ Fulvic Acid • Peak All-Day Stamina")
  benefitBullets?: string[]; // 2-3 tangible outcome bullets (e.g. ["Zero crash energy", "84+ minerals"])
  targetConcern?: 'energy' | 'sleep' | 'gut' | 'skin' | 'immunity' | 'heart' | 'women';
  chronoRitual: ChronoRitual;
  likesCount?: number;
  walkthroughsCount?: number;
}

export interface CartItem {
  id: string; // unique item id combining product.id and subscription mode
  product: Product;
  quantity: number;
  isSubscription: boolean;
  cadenceWeeks: SubscriptionCadence;
}

export interface BotanicalIngredient {
  id: string;
  name: string;
  botanicalName: string;
  sourcingRegion: string;
  partUsed: string;
  extractionMethod: string;
  keyBenefits: string[];
  folkHistory: string;
  aromaProfile: string;
  featuredInProductIds: string[];
}

export interface QuizState {
  step: number;
  intention: string;
  timeOfDay: string;
  formatPreference: string;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  orderId?: string;
  amountSpent?: number;
  points: number; // positive for earned, negative for redeemed
  type: 'earned' | 'redeemed' | 'bonus';
}

export interface PastOrder {
  id: string;
  date: string;
  itemsSummary: string;
  total: number;
  pointsEarned: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

export interface DosagePrescription {
  productId: string;
  productName: string;
  productImage: string;
  patientConcern: string;
  userBedtime?: string;
  calculatedTime: string;
  liquidMedium: string;
  liquidTemperature: string;
  liquidAmount: string;
  exactDosage: string;
  preparationSteps: string[];
  synergyTips: string;
  dinacharyaNote: string;
}

export interface MarketFeedback {
  id: string;
  timestamp: string;
  productName?: string;
  categoryInterest: string;
  wouldBuy: 'definitely' | 'maybe' | 'unlikely';
  comment: string;
}

export type UserRole = 'customer' | 'admin';
export type AuthMethod = 'google' | 'phone' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  role: UserRole;
  method: AuthMethod;
  loyaltyPoints: number;
  joinedAt: string;
  adminTitle?: string;
}

export interface AdminStoreMetrics {
  grossSalesToday: number;
  totalOrdersCount: number;
  activeUsersOnline: number;
  lowStockItemsCount: number;
}

