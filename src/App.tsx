import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Truck,
  ShieldCheck,
  Zap,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { Product, CartItem, Order, Language, BusinessSettings } from './types';
import { businessSettingsService } from './services/businessSettingsService';
import { StorageService } from './services/storageService';
import { INITIAL_PRODUCTS } from './services/sampleData';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { MobileQuickBar } from './components/MobileQuickBar';

export default function App() {
  // Language: Default Bangla per confirmed instructions
  const [language, setLanguage] = useState<Language>('bn');
  const isBn = language === 'bn';

  // Business settings & policies
  const [settings, setSettings] = useState<BusinessSettings>(businessSettingsService.getSettings());
  const [isInitializing, setIsInitializing] = useState(true);

  // Catalog & Filter
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<'store' | 'checkout'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const productSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  // Initialize service & load data
  useEffect(() => {
    async function initApp() {
      await businessSettingsService.init();
      setSettings(businessSettingsService.getSettings());

      // Load products from IndexedDB
      const storedProducts = await StorageService.getAll<Product>(StorageService.STORES.PRODUCTS);
      if (storedProducts && storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        // Seed default sample catalog
        await StorageService.setAll(StorageService.STORES.PRODUCTS, INITIAL_PRODUCTS);
        setProducts(INITIAL_PRODUCTS);
      }

      // Load saved cart if any
      const savedCart = await StorageService.getRecord<CartItem[]>('cart_store', 'current_cart', []);
      if (savedCart) setCart(savedCart);

      setIsInitializing(false);
    }
    initApp();
  }, []);

  // Save cart changes
  useEffect(() => {
    if (!isInitializing) {
      StorageService.setRecord('cart_store', 'current_cart', cart);
    }
  }, [cart, isInitializing]);

  const reloadProducts = async () => {
    const updated = await StorageService.getAll<Product>(StorageService.STORES.PRODUCTS);
    setProducts(updated);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setIsProductDetailOpen(false);
    setActiveView('checkout');
  };

  const handleOrderCompleted = (order: Order) => {
    setCart([]);
    setConfirmedOrder(order);
    setIsConfirmationOpen(true);
    setActiveView('store');
    reloadProducts();
  };

  const scrollToProducts = () => {
    setActiveView('store');
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    setActiveView('store');
    contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Categories list
  const categories = [
    { id: 'all', nameBn: 'সকল এক্সেসরিজ', nameEn: 'All Items' },
    { id: 'chargers', nameBn: 'চার্জার ও এডাপ্টার', nameEn: 'Chargers' },
    { id: 'audio', nameBn: 'ইয়ারফোন ও অডিও', nameEn: 'Audio' },
    { id: 'powerbanks', nameBn: 'পাওয়ার ব্যাংক', nameEn: 'Power Banks' },
    { id: 'cables', nameBn: 'ডাটা কেবল', nameEn: 'Cables' },
    { id: 'protection', nameBn: 'সুরক্ষা ও কভার', nameEn: 'Protection' },
    { id: 'accessories', nameBn: 'অন্যান্য মাউন্ট ও গ্যাজেট', nameEn: 'Mounts & Others' },
  ];

  // Filtering products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchBn = (p.nameBn || '').toLowerCase().includes(q) || (p.categoryBn || '').toLowerCase().includes(q);
      const matchEn = (p.nameEn || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
      return matchBn || matchEn;
    }
    return true;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-sky-600 selection:text-white">
      {/* 1. Header (Adhering to Top Bar Contract) */}
      <Header
        settings={settings}
        language={language}
        onLanguageChange={setLanguage}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onNavigateHome={() => setActiveView('store')}
        onNavigateProducts={scrollToProducts}
        onNavigateContact={scrollToContact}
        onNavigatePolicies={() => setIsPoliciesOpen(true)}
        customLogoUrl={settings.customLogoUrl}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeView === 'checkout' ? (
          <CheckoutView
            cart={cart}
            language={language}
            settings={settings}
            onBackToShopping={() => setActiveView('store')}
            onOrderCompleted={handleOrderCompleted}
          />
        ) : (
          <>
            {/* 2. Premium Website Hero Banner Matching Brand Identity */}
            <HeroBanner
              settings={settings}
              language={language}
              onExploreProducts={scrollToProducts}
            />

            {/* 3. Free Delivery & Key Trust Markers Strip (Unboxed Layout) */}
            <section className="bg-white border-b border-slate-200 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isBn ? '৳২,০০০+ অর্ডারে ফ্রি ডেলিভারি' : 'Free Delivery Over ৳2,000'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'অন্যথায় নির্ধারিত ফি মাত্র ৳১২০' : 'Flat ৳120 below threshold'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you inspect the parcel'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isBn ? '১০০% জেনুইন এক্সেসরিজ' : '100% Genuine Tech'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'উন্নত কোয়ালিটি ও রিপ্লেসমেন্ট ওয়ারেন্টি' : 'Factory-tested reliable accessories'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isBn ? 'হোয়াটসঅ্যাপে দ্রুত সেবা' : 'Direct WhatsApp Support'}
                      </h4>
                      <a
                        href={settings.whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-700 font-semibold hover:underline"
                      >
                        {settings.whatsAppNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Product Catalog Section */}
            <section ref={productSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 tracking-wider uppercase mb-1">
                    <span>{isBn ? 'আমাদের প্রোডাক্ট ক্যাটালগ' : 'Product Collection'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 tabular-nums">
                      {isBn ? `${filteredProducts.length} টি পণ্য পাওয়া গেছে` : `${filteredProducts.length} items`}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {isBn ? 'প্রিমিয়াম মোবাইল এক্সেসরিজ' : 'Explore Mobile Accessories'}
                  </h2>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? 'পণ্য বা ক্যাটাগরি খুঁজুন...' : 'Search accessories...'}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Functional Interactive Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 p-1.5 bg-slate-200/60 rounded-2xl w-fit max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    {isBn ? cat.nameBn : cat.nameEn}
                  </button>
                ))}
              </div>

              {/* Responsive Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি।' : 'No accessories found matching your filter.'}
                  </p>
                  <p>
                    {isBn
                      ? 'অন্য কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা অন্য ক্যাটাগরি বেছে নিন।'
                      : 'Try adjusting your search terms or select another category.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 px-4 py-2 text-xs font-bold text-sky-600 hover:underline"
                  >
                    {isBn ? 'সব পণ্য পুনরায় দেখুন' : 'Reset filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onViewDetails={(p) => {
                        setSelectedProduct(p);
                        setIsProductDetailOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 5. Contact & Physical Shop Details Section */}
            <section ref={contactSectionRef} className="bg-white border-t border-slate-200 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-br from-slate-900 via-[#071B33] to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                        <MapPin className="w-4 h-4" />
                        <span>{isBn ? 'দোকানে সরাসরি এসে দেখে নেওয়ার সুবিধা' : 'Visit Our Physical Retail Store'}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {isBn ? settings.storeNameBn : settings.storeNameEn}
                      </h3>
                      <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                        {isBn
                          ? `${settings.physicalAddressBn}-এ অবস্থিত আমাদের দোকানে সরাসরি এসে যেকোনো এক্সেসরিজ পরীক্ষা করে ক্রয় করতে পারেন অথবা ঘরে বসে ক্যাশ অন ডেলিভারিতে অর্ডার করতে পারেন।`
                          : `Located at ${settings.physicalAddressEn}. Visit us in person or place a Cash on Delivery order online.`}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a
                          href={`tel:${settings.phoneNumber}`}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-950 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors shadow-md"
                        >
                          <Phone className="w-4 h-4 text-sky-600" />
                          <span className="tabular-nums">{settings.phoneNumber}</span>
                        </a>

                        <a
                          href={settings.whatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>WhatsApp: {settings.whatsAppNumber}</span>
                        </a>

                        <a
                          href={settings.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-[#1877F2] text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Facebook Page</span>
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-slate-950/70 p-6 rounded-2xl border border-slate-800 text-xs space-y-3">
                      <span className="font-bold text-sky-400 uppercase tracking-wider block">
                        {isBn ? 'ডেলিভারি নির্দেশিকা' : 'Delivery Highlights'}
                      </span>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span>{isBn ? 'স্ট্যান্ডার্ড ডেলিভারি ফি:' : 'Standard Delivery:'}</span>
                          <span className="font-bold text-white tabular-nums">৳{settings.defaultDeliveryFee}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span>{isBn ? 'ফ্রি ডেলিভারি প্রযোজ্য:' : 'Free Delivery Starts at:'}</span>
                          <span className="font-bold text-emerald-400 tabular-nums">৳{settings.freeDeliveryThreshold.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>{isBn ? 'পেমেন্ট পদ্ধতি:' : 'Payment:'}</span>
                          <span className="font-bold text-white">ক্যাশ অন ডেলিভারি (COD)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        {isBn
                          ? '* সমগ্র বাংলাদেশে সুন্দরবন, রেডএক্স বা স্টেডফাস্ট কুরিয়ারের মাধ্যমে দ্রুত পার্সেল পাঠানো হয়।'
                          : '* Fast courier dispatch across all 64 districts in Bangladesh.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 6. Footer */}
      <Footer
        settings={settings}
        language={language}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 7. Mobile Floating Quick-Action Bar */}
      <MobileQuickBar
        settings={settings}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
      />

      {/* 8. Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        language={language}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
        }}
      />

      {/* 9. Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false);
          setSelectedProduct(null);
        }}
        language={language}
        settings={settings}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 10. Order Confirmation Modal with Printable Invoice */}
      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setConfirmedOrder(null);
        }}
        language={language}
        settings={settings}
      />

      {/* 11. Customer Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
      />

      {/* 12. Store Policy Modal */}
      <PolicyModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        policies={businessSettingsService.getPolicies()}
        language={language}
      />

      {/* 13. Owner Admin Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onProductsUpdated={reloadProducts}
      />
    </div>
  );
}
