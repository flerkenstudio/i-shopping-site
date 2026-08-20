import React, { useState } from 'react';
import { X, Star, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onInstantBuy,
}) => {
  const { addToCart, wishlist, toggleWishlist, formatPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleInstantCheckout = () => {
    addToCart(product, quantity);
    onInstantBuy(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-opacity">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 relative my-8 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/90 dark:bg-zinc-950/80 text-emerald-700 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xs shadow-xs">
                SKU: {product.sku}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 md:p-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center space-x-1 text-amber-500 dark:text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{product.rating}</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white tracking-tight">
                {product.name}
              </h2>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {product.tagline}
              </p>

              {/* Price & Stock Badge */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 line-through tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {product.availableQty} Units in Stock
                </span>
              </div>

              {/* Tabs: Overview vs Specifications */}
              <div className="mt-4">
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-xs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                        : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
                      activeTab === 'specs'
                        ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                        : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Tech Specs
                  </button>
                </div>

                <div className="py-3 text-xs text-zinc-600 dark:text-zinc-400 max-h-36 overflow-y-auto">
                  {activeTab === 'overview' ? (
                    <div className="space-y-2">
                      <p>{product.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 font-mono text-[11px]">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850">
                          <span className="text-zinc-500">{key}</span>
                          <span className="text-zinc-800 dark:text-zinc-200 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Quantity:</span>
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.availableQty, quantity + 1))}
                      disabled={quantity >= product.availableQty}
                      className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
                    isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-zinc-200 dark:border-transparent shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleInstantCheckout}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-[0.98]"
                >
                  <span>1-Tap Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
