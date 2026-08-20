import React from 'react';
import { CheckCircle, Truck, Printer, ArrowRight, MapPin } from 'lucide-react';
import { Order } from '../types';
import { useCart } from '../context/CartContext';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  const { formatPrice } = useCart();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 my-8 transition-colors">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white">
            Order Successfully Placed!
          </h2>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Thank you, {order.customer.fullName}. Your order has been registered and inventory locked. A confirmation email was sent to{' '}
            <strong className="text-zinc-900 dark:text-zinc-200">{order.customer.email}</strong>.
          </p>

          <div className="inline-flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300 shadow-xs">
            <span>Order: <strong className="text-emerald-600 dark:text-emerald-400">{order.id}</strong></span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span>Tracking: <strong className="text-zinc-900 dark:text-zinc-100">{order.trackingNumber}</strong></span>
          </div>
        </div>

        {/* Live Delivery Timeline Status */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Live Fulfillment Tracking
          </h3>

          <div className="grid grid-cols-4 gap-2 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-medium text-zinc-900 dark:text-zinc-200">Confirmed</span>
              <span className="text-[9px] font-mono text-zinc-500">Just now</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-300">Stock Reserved</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Redis Lock OK</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-1.5 opacity-60">
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Dispatched</span>
              <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-600">Within 2h</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-1.5 opacity-60">
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs">
                4
              </div>
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Delivered</span>
              <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-600">Tomorrow</span>
            </div>
          </div>
        </div>

        {/* Order Details & Items */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">{order.customer.fullName}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{order.customer.address}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{order.customer.city}, {order.customer.state} - {order.customer.postalCode}</p>
              <p className="text-zinc-500 font-mono">{order.customer.phone}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400 font-medium mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Shipping & Payment</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Method: <strong className="text-zinc-900 dark:text-zinc-100 capitalize">{order.shippingMethod} Delivery</strong>
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Payment: <strong className="text-zinc-900 dark:text-zinc-100 uppercase">{order.paymentMethod.replace('_', ' ')}</strong>
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Estimated Delivery: <strong className="text-emerald-600 dark:text-emerald-400">1-2 Business Days</strong>
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Ordered Items
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {order.items.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-950 object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-200">{item.product.name}</p>
                      <p className="text-[11px] text-zinc-500">Qty: {item.quantity} × {formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-200">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Coupon Discount ({order.couponCode})</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-mono">{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-mono">{formatPrice(order.tax)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
              <span>Total Paid</span>
              <span className="text-base text-emerald-600 dark:text-emerald-400 font-mono">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 flex items-center justify-center space-x-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
