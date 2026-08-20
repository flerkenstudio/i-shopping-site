import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { CheckoutSkeleton } from './components/skeletons/CheckoutSkeleton';
import { Product, Order } from './types';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Zap, ArrowUp } from 'lucide-react';

// Lazy-loaded components for optimal bundle splitting and performance
const OnePageCheckout = lazy(() =>
  import('./components/OnePageCheckout').then(m => ({ default: m.OnePageCheckout }))
);
const ProductQuickView = lazy(() =>
  import('./components/ProductQuickView').then(m => ({ default: m.ProductQuickView }))
);
const OrderConfirmationModal = lazy(() =>
  import('./components/OrderConfirmationModal').then(m => ({ default: m.OrderConfirmationModal }))
);
const RedisConsoleModal = lazy(() =>
  import('./components/RedisConsoleModal').then(m => ({ default: m.RedisConsoleModal }))
);

function StorefrontContent() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isRedisConsoleOpen, setIsRedisConsoleOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'shop' | 'checkout'>('shop');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const { scrollProgress, isScrolled } = useTheme();

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentView('shop');
  };

  const handleInstantBuy = (product: Product) => {
    setQuickViewProduct(null);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950 font-sans transition-colors duration-200 relative">
      {/* Top Fixed Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Toast Notifications Overlay */}
      <ToastContainer />

      {currentView === 'checkout' ? (
        <Suspense fallback={<CheckoutSkeleton />}>
          <OnePageCheckout
            onBackToShop={() => setCurrentView('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        </Suspense>
      ) : (
        <>
          {/* Top Bar Navigation */}
          <Header
            onOpenCart={handleOpenCart}
            onOpenRedisConsole={() => setIsRedisConsoleOpen(true)}
            activeCategory={activeCategory}
            onSelectCategory={cat => setActiveCategory(cat)}
          />

          {/* Hero Minimalist Statement */}
          <section className="relative border-b border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 pt-12 pb-10 sm:pt-16 sm:pb-14 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-4 shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Redis In-Memory Engine • Next-Day Dispatch</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-zinc-900 dark:text-white leading-tight">
                  High-Performance Gear for Focused Workstations.
                </h1>

                <p className="mt-3.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Tactile mechanical hardware, color-critical studio displays, and acoustic accessories engineered for developers and creators with zero distraction.
                </p>
              </div>
            </div>
          </section>

          {/* Main Catalog View */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <ProductList
              activeCategory={activeCategory}
              onSelectCategory={cat => setActiveCategory(cat)}
              onQuickView={product => setQuickViewProduct(product)}
            />
          </main>

          {/* Sliding Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            onProceedToCheckout={handleProceedToCheckout}
          />

          {/* Quick View Modal */}
          {quickViewProduct && (
            <Suspense fallback={null}>
              <ProductQuickView
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onInstantBuy={handleInstantBuy}
              />
            </Suspense>
          )}

          {/* Order Confirmation Modal */}
          {confirmedOrder && (
            <Suspense fallback={null}>
              <OrderConfirmationModal
                order={confirmedOrder}
                onClose={() => setConfirmedOrder(null)}
              />
            </Suspense>
          )}

          {/* Redis Developer & Traffic Telemetry Console */}
          {isRedisConsoleOpen && (
            <Suspense fallback={null}>
              <RedisConsoleModal
                isOpen={isRedisConsoleOpen}
                onClose={() => setIsRedisConsoleOpen(false)}
              />
            </Suspense>
          )}

          {/* Minimalist Footer */}
          <Footer
            onOpenRedisConsole={() => setIsRedisConsoleOpen(true)}
            onSelectCategory={cat => setActiveCategory(cat)}
          />

          {/* Floating Scroll-to-Top Action Pill */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className={`fixed bottom-6 right-6 z-30 p-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <StorefrontContent />
      </CartProvider>
    </ThemeProvider>
  );
}
