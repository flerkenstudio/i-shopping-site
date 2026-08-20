import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, X, Zap } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductListSkeleton } from './skeletons/ProductListSkeleton';
import { redisCache } from '../services/redisCacheService';
import { INITIAL_PRODUCTS } from '../data/products';

interface ProductListProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  activeCategory,
  onSelectCategory,
  onQuickView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [fetchDuration, setFetchDuration] = useState<number>(0.8);
  const [isFromCache, setIsFromCache] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch products through Redis cache layer
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      const cacheKey = activeCategory === 'all' ? 'catalog:all' : `catalog:category:${activeCategory}`;
      
      const result = await redisCache.get<Product[]>(cacheKey, () => {
        if (activeCategory === 'all') return INITIAL_PRODUCTS;
        return INITIAL_PRODUCTS.filter(p => p.category === activeCategory);
      }, 180);

      if (isMounted) {
        setProducts(result.data || INITIAL_PRODUCTS);
        setFetchDuration(result.durationMs);
        setIsFromCache(result.fromCache);
        setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const categories = [
    { id: 'all', label: 'All Gear' },
    { id: 'input', label: 'Keyboards & Mice' },
    { id: 'displays', label: 'Displays & Docks' },
    { id: 'audio', label: 'Audio & Studio' },
    { id: 'desk', label: 'Desk Essentials' },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStock = !inStockOnly || product.availableQty > 0;

      return matchesSearch && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="w-full">
      {/* Top Banner: Free Delivery & Redis Latency */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 shadow-xs transition-colors">
        <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-200">Express Next-Day Shipping</span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span className="text-zinc-600 dark:text-zinc-400">Complimentary on orders above ₹1,499</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
          <Zap className={`w-3.5 h-3.5 ${isFromCache ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
          <span>
            {isFromCache ? 'Redis Cache HIT' : 'Uncached Origin'}:{' '}
            <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">{fetchDuration}ms</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search, Sort and Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gear, mechanical keyboards, monitors..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Stock Filter */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* In-Stock Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-700 dark:text-zinc-400 select-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-xl shadow-xs">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="whitespace-nowrap font-medium">In-Stock Only</span>
            </label>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer shadow-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <ProductListSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/20">
          <Search className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">No matching products found</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset your category filters to view available gear.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
