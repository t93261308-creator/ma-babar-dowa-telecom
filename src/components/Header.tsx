import React from 'react';
import { ShoppingBag, ShieldCheck, Phone, MessageSquare, Wrench } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BusinessSettings, Language } from '../types';

interface HeaderProps {
  settings: BusinessSettings;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateContact: () => void;
  onNavigatePolicies: () => void;
  customLogoUrl: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  language,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenTracking,
  onNavigateHome,
  onNavigateProducts,
  onNavigateContact,
  onNavigatePolicies,
  customLogoUrl,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5 text-sky-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isBn ? '১০০% অরিজিনাল মোবাইল এক্সেসরিজ' : '100% Genuine Mobile Accessories'}
            </span>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
            <span className="hidden sm:inline">
              {isBn
                ? `৳${settings.freeDeliveryThreshold.toLocaleString()} এর অর্ডারে ফ্রি ডেলিভারি!`
                : `Free Delivery on orders ৳${settings.freeDeliveryThreshold.toLocaleString()}+!`}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Contact links */}
            <a
              href={`tel:${settings.phoneNumber}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
              title={isBn ? 'কল করুন' : 'Call'}
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline tabular-nums">{settings.phoneNumber}</span>
            </a>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <a
              href={settings.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              title={isBn ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Chat on WhatsApp'}
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <span className="text-slate-700" aria-hidden="true">·</span>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(isBn ? 'en' : 'bn')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-[11px] transition-colors"
              aria-label="Change Language"
            >
              {isBn ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Official Emblem */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sky-600 rounded-lg p-1"
        >
          <BrandLogo customLogoUrl={customLogoUrl} size="md" showText={true} />
        </button>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <button
            onClick={onNavigateHome}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            {isBn ? 'হোম' : 'Home'}
          </button>
          <button
            onClick={onNavigateProducts}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            {isBn ? 'এক্সেসরিজ কালেকশন' : 'Accessories'}
          </button>
          <button
            onClick={onOpenTracking}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            {isBn ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}
          </button>
          <button
            onClick={onNavigatePolicies}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            {isBn ? 'স্টোর পলিসি' : 'Store Policies'}
          </button>
          <button
            onClick={onNavigateContact}
            className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0"
          >
            {isBn ? 'যোগাযোগ ও ঠিকানা' : 'Contact Us'}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Admin Portal + Cart Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
            title={isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Portal'}
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-sky-600 active:scale-95 whitespace-nowrap shrink-0"
            aria-label={isBn ? `ব্যাগ (${cartCount} টি পণ্য)` : `Bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">{isBn ? 'ব্যাগ' : 'Cart'}</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold bg-sky-500 text-white rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
