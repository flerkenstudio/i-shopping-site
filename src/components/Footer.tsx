import React from 'react';
import { ShieldCheck, Zap, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenRedisConsole: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRedisConsole, onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-base font-bold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
              i Shopping
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Engineered minimalist gear and ergonomic workspace essentials. Powered by sub-millisecond Redis in-memory cache architecture.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Redis Accelerated Storefront</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              Workstation Gear
            </h4>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>
                <button onClick={() => onSelectCategory('input')} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Keyboards & Mice
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('displays')} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Displays & Thunderbolt Hubs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('audio')} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Studio Reference Audio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('desk')} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Desk Mats & Laptop Stands
                </button>
              </li>
            </ul>
          </div>

          {/* Scalability & Architecture */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              Performance Tech
            </h4>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>
                <button onClick={onOpenRedisConsole} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1">
                  <span>Redis Telemetry Console</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-500">Atomic Stock Lock Check</span>
              </li>
              <li>
                <span className="text-zinc-500">Lazy Loaded Image Pipeline</span>
              </li>
              <li>
                <span className="text-zinc-500">1-Page Mobile Checkout</span>
              </li>
            </ul>
          </div>

          {/* Guarantees & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              Commitment
            </h4>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>30-Day Risk-Free Trial & Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>2-Year Comprehensive Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Express Next-Day Air Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-[11px]">
            &copy; 2026 Flerken Commerce. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenRedisConsole}
              className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              ⚡ Live Redis Inspector
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
