import React from 'react';
import { ArrowDown, MessageCircle, Truck, ShieldCheck, Zap } from 'lucide-react';
import { BusinessSettings, Language } from '../types';

interface HeroBannerProps {
  settings: BusinessSettings;
  language: Language;
  onExploreProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  language,
  onExploreProducts,
}) => {
  const isBn = language === 'bn';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#07172C] to-[#0A2647] text-white py-12 md:py-20 border-b border-slate-800">
      {/* Background Decorative Tech Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(2,132,199,0.18),transparent_55%)] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-600/10 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand & Hero Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Brand Kicker with Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-400 tracking-wide uppercase">
              <span>{isBn ? 'অফিসিয়াল রিটেইল স্টোর' : 'Official Retail Store'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{isBn ? 'টঙ্গী, গাজীপুর' : 'Tongi, Gazipur'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-white text-balance">
                {isBn ? settings.bannerHeadlineBn : settings.bannerHeadlineEn}
              </h1>
              <p className="text-sky-300 font-semibold text-lg sm:text-xl">
                {isBn ? settings.storeNameBn : settings.storeNameEn}
                <span className="ml-2 text-sm font-normal text-slate-300">
                  {isBn ? settings.taglineBn : settings.taglineEn}
                </span>
              </p>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {isBn ? settings.bannerSubtextBn : settings.bannerSubtextEn}
            </p>

            {/* Benefit Highlights (Zero-Pill discipline, clean unboxed grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2 border-t border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {isBn ? 'ফ্রি ডেলিভারি' : 'Free Shipping'}
                  </div>
                  <div className="text-xs text-slate-300 tabular-nums">
                    {isBn
                      ? `৳${settings.freeDeliveryThreshold.toLocaleString()} এর কেনাকাটায়`
                      : `On orders ৳${settings.freeDeliveryThreshold.toLocaleString()}+`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {isBn ? '১০০% জেনুইন' : '100% Genuine'}
                  </div>
                  <div className="text-xs text-slate-300">
                    {isBn ? 'যাচাইকৃত কোয়ালিটি' : 'Tested & Verified'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {isBn ? 'ফাস্ট চার্জিং' : 'Fast Charging'}
                  </div>
                  <div className="text-xs text-slate-300">
                    {isBn ? 'GaN ও PD সাপোর্টেড' : 'GaN & PD Ready'}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
              >
                <span>{isBn ? 'কালেকশন দেখুন' : 'Explore Catalog'}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={settings.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-800/90 hover:bg-slate-700/90 rounded-xl border border-slate-700 transition-all hover:border-emerald-500/50"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'হোয়াটসঅ্যাপে ইনকোয়ারি' : 'WhatsApp Inquiry'}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Premium Showcase Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-sky-400 uppercase tracking-wider">
                  {isBn ? 'ফিচার্ড এক্সেসরিজ' : 'Featured Accessories'}
                </span>
                <span className="tabular-nums">
                  {isBn ? 'ডেলিভারি ফি: ৳১২০' : 'Delivery: ৳120'}
                </span>
              </div>

              {/* Visual Showcase Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {/* Visual 1: Fast Charger */}
                <div className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3]">
                  <img
                    src="/src/assets/images/product_fast_charger_1792168174776.jpg"
                    alt="65W Fast Charger"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-semibold text-white truncate">
                      {isBn ? '৬৫W GaN ফাস্ট চার্জার' : '65W GaN Charger'}
                    </span>
                  </div>
                </div>

                {/* Visual 2: TWS Earbuds */}
                <div className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3]">
                  <img
                    src="/src/assets/images/product_tws_earbuds_1792168174227.jpg"
                    alt="TWS Earbuds"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-semibold text-white truncate">
                      {isBn ? 'টিডব্লিউএস ইয়ারবাডস' : 'ANC TWS Earbuds'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Showcase Card: Power Bank with Free Delivery Notice */}
              <div className="mt-3 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                <div className="relative aspect-[16/9]">
                  <img
                    src="/src/assets/images/product_power_bank_1792168174610.jpg"
                    alt="20000mAh Power Bank"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white text-sm">
                        {isBn ? '২০,০০০ mAh ডিজিটাল পাওয়ার ব্যাংক' : '20000mAh Power Bank'}
                      </span>
                      <span className="font-bold text-sky-400 tabular-nums">৳২,১৫০</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium mt-1">
                      {isBn ? '✓ এটিতে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!' : '✓ Qualifies for FREE Delivery!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
