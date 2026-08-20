import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    freeShippingThreshold,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError('');
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingProgressPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 flex flex-col shadow-2xl transition-colors">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-base font-semibold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 text-xs transition-colors">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Add {formatPrice(amountNeededForFreeShipping)} more for Free Express Delivery</span>
                  </span>
                  <span className="font-mono text-zinc-500 dark:text-zinc-400">{freeShippingProgressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <Truck className="w-4 h-4" />
                <span>You qualify for Complimentary Express Delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <ShoppingBag className="w-12 h-12 stroke-1 text-zinc-400 dark:text-zinc-700 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-300">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 max-w-xs">
                  Discover our curated collection of minimalist workstations, mechanical keyboards, and precision audio gear.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-xs"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-950 shrink-0 border border-zinc-200 dark:border-zinc-800"
                  />

                  {/* Info & Quantity */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                        className="text-zinc-400 hover:text-rose-500 p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      {formatPrice(product.price)}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-zinc-300 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-200 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.availableQty}
                          className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
              {/* Promo Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-semibold">{appliedCoupon.code}</span>
                    <span className="text-emerald-600/80 dark:text-emerald-400/80">({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-500 hover:text-rose-500 text-xs font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. ISHOPPING10)"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 uppercase focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white dark:text-zinc-200 text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
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
                  <span>Estimated GST (5%)</span>
                  <span className="text-zinc-900 dark:text-zinc-200 tabular-nums">{formatPrice(taxAmount)}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Estimated Total</span>
                  <span className="text-base tabular-nums">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.99] transition-all shadow-md"
              >
                <span>Proceed to One-Page Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                <span>256-Bit SSL Encrypted & Express Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
