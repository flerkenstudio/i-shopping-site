export interface Product {
  id: number;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // In INR (default base currency)
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: 'input' | 'displays' | 'audio' | 'desk' | 'cables';
  categoryLabel: string;
  image: string;
  placeholderColor: string;
  availableQty: number;
  isFeatured?: boolean;
  tags: string[];
  specs: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Currency = 'INR' | 'USD';

export type PaymentMethodType = 'apple_pay' | 'google_pay' | 'upi' | 'card' | 'cod';

export type ShippingMethod = 'standard' | 'express';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: Currency;
  couponCode?: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodType;
  customer: CustomerDetails;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

export interface CacheLogEntry {
  id: string;
  key: string;
  status: 'HIT' | 'MISS';
  durationMs: number;
  timestamp: number;
  sizeBytes: number;
}

export interface RedisCacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRatio: number;
  avgCachedMs: number;
  avgUncachedMs: number;
  keysCount: number;
  memoryUsedBytes: number;
  recentLogs: CacheLogEntry[];
  cacheEnabled: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 10 for 10%, 500 for fixed ₹500
  minOrderValue: number;
  description: string;
}
