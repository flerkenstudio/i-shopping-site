import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { Product, CartItem, Currency, Coupon, Order } from '../types';
import { AVAILABLE_COUPONS } from '../data/products';
import { redisCache } from '../services/redisCacheService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface CartState {
  cart: CartItem[];
  wishlist: number[]; // Product IDs
  currency: Currency;
  appliedCoupon: Coupon | null;
  shippingSpeed: 'standard' | 'express';
  orders: Order[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: { id: number } }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'APPLY_COUPON'; payload: Coupon | null }
  | { type: 'SET_SHIPPING_SPEED'; payload: 'standard' | 'express' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'RESTORE_STATE'; payload: CartState };

const USD_EXCHANGE_RATE = 0.0115; // ₹87 = ~$1

const STORAGE_KEY = 'ishopping_cart_state_v2';

const initialCartState: CartState = {
  cart: [
    // Pre-populate with one item for instant UX showcase
    {
      product: {
        id: 1,
        sku: 'VIS-MOU-01',
        name: 'Precision Wireless Mouse',
        tagline: 'Silent magnetic switches with 4000 DPI Darkfield tracking',
        description: 'Designed for effortless navigation and minimal fatigue.',
        price: 999,
        originalPrice: 1499,
        rating: 4.9,
        reviewsCount: 142,
        category: 'input',
        categoryLabel: 'Keyboards & Mice',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
        placeholderColor: '#27272a',
        availableQty: 18,
        isFeatured: true,
        tags: ['Wireless', 'Ergonomic'],
        specs: { Sensor: '4000 DPI' },
      },
      quantity: 1,
    },
  ],
  wishlist: [2],
  currency: 'INR',
  appliedCoupon: null,
  shippingSpeed: 'standard',
  orders: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.cart.find(item => item.product.id === product.id);

      let updatedCart: CartItem[];
      if (existing) {
        const newQty = Math.min(product.availableQty, existing.quantity + quantity);
        updatedCart = state.cart.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const newQty = Math.min(product.availableQty, Math.max(1, quantity));
        updatedCart = [...state.cart, { product, quantity: newQty }];
      }
      return { ...state, cart: updatedCart };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== id),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.product.id === id) {
            const capped = Math.min(item.product.availableQty, quantity);
            return { ...item, quantity: capped };
          }
          return item;
        }),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        appliedCoupon: null,
      };

    case 'TOGGLE_WISHLIST': {
      const id = action.payload.id;
      const exists = state.wishlist.includes(id);
      return {
        ...state,
        wishlist: exists ? state.wishlist.filter(x => x !== id) : [...state.wishlist, id],
      };
    }

    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };

    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };

    case 'SET_SHIPPING_SPEED':
      return { ...state, shippingSpeed: action.payload };

    case 'ADD_ORDER':
      return {
        ...state,
        cart: [],
        appliedCoupon: null,
        orders: [action.payload, ...state.orders],
      };

    case 'RESTORE_STATE':
      return action.payload;

    default:
      return state;
  }
}

interface CartContextValue {
  cart: CartItem[];
  wishlist: number[];
  currency: Currency;
  appliedCoupon: Coupon | null;
  shippingSpeed: 'standard' | 'express';
  orders: Order[];
  toasts: ToastMessage[];
  totalItemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  finalTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  setCurrency: (currency: Currency) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setShippingSpeed: (speed: 'standard' | 'express') => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'status'>) => Order;
  formatPrice: (amountInInr: number) => string;
  addToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const FREE_SHIPPING_THRESHOLD_INR = 1499; // ₹1,499 for free standard shipping
const STANDARD_SHIPPING_FEE_INR = 99;
const EXPRESS_SHIPPING_FEE_INR = 199;
const TAX_RATE = 0.05; // 5% GST/Tax

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage', e);
    }
    return initialCartState;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to local storage and update Redis simulated session
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Store active session cart to Redis simulation
      redisCache.set(`session:cart:${state.cart.length}`, {
        itemsCount: state.cart.length,
        total: state.cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
      }, 180);
    } catch (e) {
      console.warn('Could not save cart state', e);
    }
  }, [state]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const totalItemCount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);

  const subtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [state.cart]);

  const discountAmount = useMemo(() => {
    if (!state.appliedCoupon) return 0;
    if (subtotal < state.appliedCoupon.minOrderValue) return 0;

    if (state.appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * state.appliedCoupon.value) / 100);
    }
    if (state.appliedCoupon.discountType === 'fixed') {
      return Math.min(subtotal, state.appliedCoupon.value);
    }
    if (state.appliedCoupon.discountType === 'free_shipping') {
      return 0; // Handled in shipping fee
    }
    return 0;
  }, [subtotal, state.appliedCoupon]);

  const shippingFee = useMemo(() => {
    if (state.cart.length === 0) return 0;
    if (state.appliedCoupon?.discountType === 'free_shipping') return 0;

    if (state.shippingSpeed === 'express') {
      return subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 99 : EXPRESS_SHIPPING_FEE_INR;
    }

    // Standard shipping is free over threshold
    return subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : STANDARD_SHIPPING_FEE_INR;
  }, [state.cart.length, state.shippingSpeed, subtotal, state.appliedCoupon]);

  const taxAmount = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    return Math.round(taxableAmount * TAX_RATE);
  }, [subtotal, discountAmount]);

  const finalTotal = useMemo(() => {
    if (state.cart.length === 0) return 0;
    return Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);
  }, [subtotal, discountAmount, shippingFee, taxAmount, state.cart.length]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotal);
  }, [subtotal]);

  const formatPrice = (amountInInr: number): string => {
    if (state.currency === 'USD') {
      const inUsd = (amountInInr * USD_EXCHANGE_RATE).toFixed(2);
      return `$${inUsd}`;
    }
    return `₹${amountInInr.toLocaleString('en-IN')}`;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = state.cart.find(i => i.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + quantity > product.availableQty) {
      addToast('warning', 'Stock limit reached', `Only ${product.availableQty} units available.`);
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    addToast('success', `${product.name} added to cart`, `${quantity} unit added.`);
  };

  const removeFromCart = (id: number) => {
    const item = state.cart.find(i => i.product.id === id);
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    if (item) {
      addToast('info', 'Item removed', `${item.product.name} was removed from your cart.`);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleWishlist = (id: number) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id } });
    const isNowInWishlist = !state.wishlist.includes(id);
    addToast('info', isNowInWishlist ? 'Saved to Wishlist' : 'Removed from Wishlist');
  };

  const setCurrency = (currency: Currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const applyCoupon = (rawCode: string): { success: boolean; message: string } => {
    const cleanCode = rawCode.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === cleanCode);

    if (!found) {
      addToast('error', 'Invalid Coupon', 'Code does not exist. Try VISTORA10 or DEV500.');
      return { success: false, message: 'Invalid promo coupon.' };
    }

    if (subtotal < found.minOrderValue) {
      const msg = `Minimum order of ₹${found.minOrderValue} required for this coupon.`;
      addToast('warning', 'Coupon Condition', msg);
      return { success: false, message: msg };
    }

    dispatch({ type: 'APPLY_COUPON', payload: found });
    addToast('success', `Coupon '${found.code}' Applied!`, found.description);
    return { success: true, message: `Coupon ${found.code} applied!` };
  };

  const removeCoupon = () => {
    dispatch({ type: 'APPLY_COUPON', payload: null });
    addToast('info', 'Coupon Removed');
  };

  const setShippingSpeed = (speed: 'standard' | 'express') => {
    dispatch({ type: 'SET_SHIPPING_SPEED', payload: speed });
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'status'>): Order => {
    const orderId = `VIS-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `TRK${Date.now().toString().slice(-8)}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // Invalidate Redis stock cache upon order completion
    orderData.items.forEach(item => {
      redisCache.del(`inventory:stock:${item.product.id}`);
    });
    redisCache.del('catalog:*');

    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    addToast('success', 'Order Confirmed!', `Order #${orderId} is being prepared.`);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        wishlist: state.wishlist,
        currency: state.currency,
        appliedCoupon: state.appliedCoupon,
        shippingSpeed: state.shippingSpeed,
        orders: state.orders,
        toasts,
        totalItemCount,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD_INR,
        amountNeededForFreeShipping,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        setCurrency,
        applyCoupon,
        removeCoupon,
        setShippingSpeed,
        placeOrder,
        formatPrice,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
