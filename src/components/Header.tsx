import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { redisCache } from '../services/redisCacheService';
import { RedisCacheStats } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenRedisConsole: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenRedisConsole,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItemCount, currency, setCurrency } = useCart();
  const { theme, toggleTheme, isScrolled } = useTheme();
  const [redisStats, setRedisStats] = useState<RedisCacheStats>(redisCache.getStats());

  useEffect(() => {
    const unsubscribe = redisCache.subscribe(stats => {
      setRedisStats(stats);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'all', label: 'All Products' },
    { id: 'input', label: 'Keyboards & Mice' },
    { id: 'displays', label: 'Displays & Docks' },
    { id: 'audio', label: 'Audio & Studio' },
    { id: 'desk', label: 'Desk Essentials' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xs border-zinc-200 dark:border-zinc-800'
          : 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-zinc-200/80 dark:border-zinc-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (Single Text Element) */}
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xl font-bold tracking-tight font-display text-zinc-900 dark:text-zinc-100 hover:opacity-85 transition-opacity shrink-0 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          i Shopping
        </button>

        {/* Zone 2: Nav Links (Single line, max 5 visible, responsive) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 shrink-0">
          {navItems.map(item => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Redis Cache Status Pill */}
          <button
            onClick={onOpenRedisConsole}
            title="Inspect Redis Cache & Traffic Telemetry"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
          >
            <Zap className={`w-3.5 h-3.5 ${redisStats.cacheEnabled ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline font-sans font-medium text-zinc-500 dark:text-zinc-400">Redis:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {redisStats.cacheEnabled ? `${redisStats.avgCachedMs}ms` : 'OFF'}
            </span>
          </button>

          {/* Theme Switcher Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Currency Switcher */}
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            className="whitespace-nowrap px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Currency (₹ INR / $ USD)"
          >
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative flex items-center justify-center p-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white dark:text-zinc-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
