import React, { useState } from 'react';
import { Plus, Check, Eye, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { cart, addToCart, wishlist, toggleWishlist, formatPrice } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = cart.find(i => i.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md dark:shadow-none"
    >
      {/* Top Image Section with Progressive Lazy Loading */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
        {/* Placeholder shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-200/80 dark:bg-zinc-850 animate-shimmer flex items-center justify-center">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">Loading asset...</span>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Stock & Feature Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs">
              Featured
            </span>
          )}
          {product.availableQty <= 8 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 backdrop-blur-xs">
              Only {product.availableQty} left
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlist}
            aria-label="Save to wishlist"
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200/60 dark:border-transparent'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label="Quick preview"
            className="p-1.5 rounded-full bg-white/80 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200/60 dark:border-transparent backdrop-blur-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="font-mono text-[11px] text-zinc-500">{product.sku}</span>
            <div className="flex items-center space-x-1 text-amber-500 dark:text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-medium text-[11px] text-zinc-800 dark:text-zinc-300">{product.rating}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white line-clamp-1 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">In Stock & Ready</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.availableQty === 0}
            className={`whitespace-nowrap shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isInCart
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white active:scale-95 shadow-xs'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>In Cart ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
