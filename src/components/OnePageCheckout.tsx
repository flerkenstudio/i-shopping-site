import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  Tag,
  Sparkles,
  Zap,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Package,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PaymentMethodType, ShippingMethod, CustomerDetails, Order } from '../types';
import { redisCache } from '../services/redisCacheService';
import { CheckoutProgressIndicator } from './CheckoutProgressIndicator';
import { CheckoutSkeleton } from './skeletons/CheckoutSkeleton';

interface OnePageCheckoutProps {
  onBackToShop: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const OnePageCheckout: React.FC<OnePageCheckoutProps> = ({
  onBackToShop,
  onOrderSuccess,
}) => {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    shippingSpeed,
    setShippingSpeed,
    placeOrder,
    addToast,
  } = useCart();

  // Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+91 98765 43210',
    address: '42 Minimalist Avenue, Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 8912 3456 7890',
    name: 'ALEX VANCE',
    expiry: '08/28',
    cvv: '842',
  });
  const [upiId, setUpiId] = useState('alex.vance@okaxis');
  const [couponInput, setCouponInput] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('Locking Redis Inventory...');
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Verify Cart Session & Inventory state from Redis cache on mount
  useEffect(() => {
    let isMounted = true;
    const verifyCheckoutSession = async () => {
      // Simulate sub-millisecond Redis inventory handshake
      await redisCache.get('checkout:session:integrity', () => ({ valid: true, expiresAt: Date.now() + 900000 }), 30);
      
      // Short realistic micro-delay to ensure smooth skeleton transition
      const timer = setTimeout(() => {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }, 240);

      return () => clearTimeout(timer);
    };

    verifyCheckoutSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Detect Card Brand from card number
  const cardBrand = useMemo(() => {
    const clean = cardDetails.number.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6/.test(clean)) return 'RuPay';
    return 'Card';
  }, [cardDetails.number]);

  // Compute Step Completion Statuses for the sleek progress indicator
  const isContactComplete = useMemo(() => {
    return Boolean(
      customer.email.trim() &&
      customer.email.includes('@') &&
      customer.email.includes('.') &&
      customer.phone.replace(/\D/g, '').length >= 8
    );
  }, [customer.email, customer.phone]);

  const isShippingComplete = useMemo(() => {
    return Boolean(
      customer.fullName.trim().length >= 2 &&
      customer.address.trim().length >= 4 &&
      customer.city.trim().length >= 2 &&
      customer.postalCode.trim().length >= 4
    );
  }, [customer.fullName, customer.address, customer.city, customer.postalCode]);

  const isDeliveryComplete = useMemo(() => {
    return Boolean(shippingSpeed === 'standard' || shippingSpeed === 'express');
  }, [shippingSpeed]);

  const isPaymentComplete = useMemo(() => {
    if (paymentMethod === 'card') {
      const cleanNum = cardDetails.number.replace(/\s+/g, '');
      return cleanNum.length >= 12 && cardDetails.expiry.length >= 4 && cardDetails.cvv.length >= 3;
    }
    if (paymentMethod === 'upi') {
      return upiId.trim().length >= 4 && upiId.includes('@');
    }
    if (paymentMethod === 'cod' || paymentMethod === 'netbanking') {
      return true;
    }
    return false;
  }, [paymentMethod, cardDetails, upiId]);

  // Demo 1-Click Autofill preset helper
  const handleAutofillDemo = () => {
    setCustomer({
      fullName: 'Vikram Mehta',
      email: 'vikram.mehta@build.io',
      phone: '+91 98201 12345',
      address: 'Plot 12, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    });
    setPaymentMethod('card');
    addToast('info', 'Demo address applied', 'Form autofilled for instant test checkout.');
  };

  const handlePostalCodeChange = (code: string) => {
    setCustomer(prev => ({ ...prev, postalCode: code }));
    // Smart auto-city detector
    if (code.startsWith('560')) {
      setCustomer(prev => ({ ...prev, postalCode: code, city: 'Bengaluru', state: 'Karnataka' }));
    } else if (code.startsWith('110')) {
      setCustomer(prev => ({ ...prev, postalCode: code, city: 'New Delhi', state: 'Delhi' }));
    } else if (code.startsWith('400')) {
      setCustomer(prev => ({ ...prev, postalCode: code, city: 'Mumbai', state: 'Maharashtra' }));
    } else if (code.startsWith('600')) {
      setCustomer(prev => ({ ...prev, postalCode: code, city: 'Chennai', state: 'Tamil Nadu' }));
    }
  };

  const handleCardNumberChange = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      setCardDetails(prev => ({ ...prev, number: parts.join(' ') }));
    } else {
      setCardDetails(prev => ({ ...prev, number: value }));
    }
  };

  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/[^0-9]/g, '');
    if (clean.length <= 2) {
      setCardDetails(prev => ({ ...prev, expiry: clean }));
    } else {
      setCardDetails(prev => ({ ...prev, expiry: `${clean.slice(0, 2)}/${clean.slice(2, 4)}` }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Valid email is required';
    if (!customer.phone.trim()) errors.phone = 'Phone number is required';
    if (!customer.address.trim()) errors.address = 'Street address is required';
    if (!customer.city.trim()) errors.city = 'City is required';
    if (!customer.postalCode.trim()) errors.postalCode = 'Postal code is required';

    if (paymentMethod === 'card') {
      if (cardDetails.number.replace(/\s+/g, '').length < 13) errors.cardNumber = 'Valid 16-digit card required';
      if (!cardDetails.expiry.includes('/')) errors.cardExpiry = 'MM/YY required';
      if (cardDetails.cvv.length < 3) errors.cardCvv = 'CVV required';
    }

    if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) errors.upiId = 'Valid UPI ID required (e.g. name@upi)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      addToast('error', 'Incomplete Details', 'Please fill in all required shipping and payment fields.');
      return;
    }

    if (cart.length === 0) {
      addToast('error', 'Empty Cart', 'Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Simulate Redis atomic inventory check
      setProcessingStep('Acquiring Redis stock lock & verifying sku...');
      await redisCache.get('inventory:stock:checkout_lock', () => ({ locked: true }), 10);
      await new Promise(resolve => setTimeout(resolve, 350));

      // 2. Simulate ultra-fast payment processing
      setProcessingStep('Authorizing 256-bit payment gateway token...');
      await new Promise(resolve => setTimeout(resolve, 450));

      setProcessingStep('Generating cryptographic invoice & dispatching order...');
      await new Promise(resolve => setTimeout(resolve, 300));

      const confirmedOrder = placeOrder({
        items: cart,
        subtotal,
        discount: discountAmount,
        shippingFee,
        tax: taxAmount,
        total: finalTotal,
        currency: 'INR',
        couponCode: appliedCoupon?.code,
        shippingMethod: shippingSpeed,
        paymentMethod,
        customer,
      });

      setIsProcessing(false);
      onOrderSuccess(confirmedOrder);
    } catch {
      setIsProcessing(false);
      addToast('error', 'Checkout failed', 'Unable to authorize payment. Please try again.');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) setCouponInput('');
  };

  if (isInitialLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-28 sm:pb-16 transition-colors relative">
      {/* Checkout Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBackToShop}
            className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Shop</span>
          </button>

          <span className="text-sm font-bold font-display uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            i Shopping Checkout
          </span>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Sleek Minimalist Progress Flow Indicator */}
        <CheckoutProgressIndicator
          isContactComplete={isContactComplete}
          isShippingComplete={isShippingComplete}
          isDeliveryComplete={isDeliveryComplete}
          isPaymentComplete={isPaymentComplete}
        />

        {/* Mobile Top Order Summary Accordion */}
        <div className="lg:hidden mb-6 rounded-xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <button
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {isOrderSummaryOpen ? 'Hide order summary' : 'Show order summary'} ({cart.length} items)
              </span>
              {isOrderSummaryOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </div>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {formatPrice(finalTotal)}
            </span>
          </button>

          {isOrderSummaryOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center space-x-2.5">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-950 object-cover border border-zinc-200 dark:border-zinc-800" />
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">{item.product.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-zinc-200">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: One-Page Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Express 1-Tap Checkout Section */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/90 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Instant Express Checkout
                </span>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="flex items-center space-x-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Autofill Demo Data</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    handlePlaceOrder();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-xs"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>UPI Fast Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    handlePlaceOrder();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98] border border-zinc-200 dark:border-transparent"
                >
                  <CreditCard className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span>1-Click Card</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="shrink-0 mx-3 text-[10px] uppercase font-mono tracking-widest text-zinc-400 dark:text-zinc-500">
                  Or Standard Guest Details
                </span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
            </div>

            {/* Step 1: Contact Information */}
            <div id="step-contact" className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">1. Contact Information</h3>
                </div>
                {isContactComplete && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Valid</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  {validationErrors.email && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">Phone Number (SMS updates)</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  {validationErrors.phone && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div id="step-shipping" className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">2. Shipping Destination</h3>
                </div>
                {isShippingComplete && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Complete</span>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="Recipient Full Name"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                  {validationErrors.fullName && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">Street Address, Suite / Apartment</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="e.g. 42 Tech Park, 3rd Floor"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                  {validationErrors.address && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.address}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={customer.postalCode}
                      onChange={e => handlePostalCodeChange(e.target.value)}
                      placeholder="e.g. 560001"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                    />
                    {validationErrors.postalCode && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">City</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={e => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                    />
                    {validationErrors.city && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.city}</p>}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">State</label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={e => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Options */}
            <div id="step-delivery" className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">3. Delivery Speed</h3>
                </div>
                {isDeliveryComplete && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Selected</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard Shipping */}
                <label
                  onClick={() => setShippingSpeed('standard')}
                  className={`p-3.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'standard'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={shippingSpeed === 'standard'}
                        onChange={() => setShippingSpeed('standard')}
                        className="accent-zinc-900 dark:accent-zinc-100"
                      />
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Standard Delivery</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-5">Estimated 2–4 business days</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {subtotal >= 1499 || appliedCoupon?.discountType === 'free_shipping' ? 'FREE' : '₹99'}
                  </span>
                </label>

                {/* Priority Next-Day Shipping */}
                <label
                  onClick={() => setShippingSpeed('express')}
                  className={`p-3.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'express'
                      ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={shippingSpeed === 'express'}
                        onChange={() => setShippingSpeed('express')}
                        className="accent-emerald-600 dark:accent-emerald-500"
                      />
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Priority Next-Day Air</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-5">Guaranteed by tomorrow 6 PM</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {appliedCoupon?.discountType === 'free_shipping' ? 'FREE' : '₹199'}
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div id="step-payment" className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">4. Payment Method</h3>
                </div>
                {isPaymentComplete && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                )}
              </div>

              {/* Payment Type Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Credit/Debit', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  { id: 'upi', label: 'UPI / QR', icon: <Smartphone className="w-3.5 h-3.5" /> },
                  { id: 'netbanking', label: 'Net Banking', icon: <Building className="w-3.5 h-3.5" /> },
                  { id: 'cod', label: 'Pay on Delivery', icon: <Truck className="w-3.5 h-3.5" /> },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                      paymentMethod === item.id
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Details Area */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Card Information</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-bold uppercase">
                      {cardBrand}
                    </span>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={e => handleCardNumberChange(e.target.value)}
                      placeholder="4532 8912 3456 7890"
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                    />
                    {validationErrors.cardNumber && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={e => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 text-center"
                      />
                      {validationErrors.cardExpiry && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.cardExpiry}</p>}
                    </div>

                    <div>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        placeholder="CVV"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 text-center"
                      />
                      {validationErrors.cardCvv && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.cardCvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Virtual Payment Address (VPA)</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Google Pay / PhonePe / Paytm</span>
                  </div>

                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="mobileNumber@upi / yourname@okaxis"
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                  {validationErrors.upiId && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.upiId}</p>}
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1 text-amber-800 dark:text-amber-300">
                  <p className="font-semibold flex items-center space-x-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Cash / UPI on Delivery Available</span>
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/80">
                    Pay conveniently at your doorstep via Cash, GooglePay, PhonePe, or Cards upon receiving the parcel.
                  </p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                  <span className="text-zinc-600 dark:text-zinc-400 block">Select Primary Bank:</span>
                  <div className="grid grid-cols-3 gap-2 text-center font-medium">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Others'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        className="py-2 px-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 text-[11px]"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                <span>Order Summary ({cart.length} items)</span>
                <span className="text-xs font-mono font-normal text-zinc-500 dark:text-zinc-400">Cart Total</span>
              </h3>

              {/* Items List */}
              <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-100 dark:border-zinc-850 last:border-0">
                    <div className="flex items-center space-x-2.5">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-950 object-cover border border-zinc-200 dark:border-zinc-800 shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">Qty: {item.quantity} × {formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200 shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Promo Code"
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 uppercase focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white dark:text-zinc-200 text-xs font-medium"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                  <span className="font-mono">{appliedCoupon.code} applied</span>
                  <button onClick={removeCoupon} className="text-zinc-500 hover:text-rose-500 underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Calculation Lines */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 dark:text-zinc-200 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-zinc-900 dark:text-zinc-200 tabular-nums">
                    {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Taxes (5%)</span>
                  <span className="text-zinc-900 dark:text-zinc-200 tabular-nums">{formatPrice(taxAmount)}</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Total Amount</span>
                  <span className="text-lg tabular-nums text-zinc-900 dark:text-white">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Desktop Place Order Button */}
              <button
                type="button"
                onClick={() => handlePlaceOrder()}
                disabled={isProcessing}
                className="hidden lg:flex w-full py-3.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider items-center justify-center space-x-2 hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.99] transition-all shadow-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & Pay {formatPrice(finalTotal)}</span>
                  </>
                )}
              </button>

              <div className="hidden lg:flex items-center justify-center space-x-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                <span>Encrypted 256-bit checkout • Instant Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Thumb-Zone Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 p-4 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Due</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handlePlaceOrder()}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Pay {formatPrice(finalTotal)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sleek Processing & Redis Telemetry Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Authorizing Order</h3>
                <p className="text-xs text-zinc-500 font-mono">Redis In-Memory Engine Pipeline</p>
              </div>
            </div>

            <div className="space-y-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-850">
              <div className="flex items-center space-x-2.5 text-xs text-zinc-800 dark:text-zinc-200">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0" />
                <span className="font-mono text-[11px] truncate">{processingStep}</span>
              </div>

              {/* Shimmer Progress Track */}
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 animate-shimmer rounded-full" />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>TLS 1.3 • AES-256</span>
              </span>
              <span>Sub-second authorization</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
