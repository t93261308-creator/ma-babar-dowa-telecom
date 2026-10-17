import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { BusinessSettings, Language } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  settings: BusinessSettings;
  language: Language;
  onOpenPolicies: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  language,
  onOpenPolicies,
  onOpenAdmin,
}) => {
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Official Brand Identity */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-2xl inline-block shadow-sm">
              <BrandLogo customLogoUrl={settings.customLogoUrl} size="sm" showText={false} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {isBn ? settings.storeNameBn : settings.storeNameEn}
              </h3>
              <p className="text-xs text-sky-400 font-medium">
                {isBn ? settings.taglineBn : settings.taglineEn}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isBn
                ? 'মোবাইল এক্সেসরিজ রিটেইল স্টোর। দ্রুততম সময়ে ক্যাশ অন ডেলিভারিতে অরিজিনাল পণ্য পৌছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।'
                : 'Mobile accessories retail store in Bangladesh. Dedicated to delivering authentic gear nationwide via Cash on Delivery.'}
            </p>
          </div>

          {/* Col 2: Confirmed Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'যোগাযোগের তথ্য' : 'Contact Details'}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href={`tel:${settings.phoneNumber}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-sky-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">
                    {isBn ? 'সরাসরি ফোন' : 'Phone'}
                  </span>
                  <span className="font-semibold tabular-nums">{settings.phoneNumber}</span>
                </div>
              </a>

              <a
                href={settings.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-emerald-600 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">WhatsApp</span>
                  <span className="font-semibold tabular-nums">{settings.whatsAppNumber}</span>
                </div>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-sky-600 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Email</span>
                  <span className="font-medium truncate">{settings.email}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 3: Physical Address & Facebook */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'দোকানের ঠিকানা ও সোশ্যাল' : 'Location & Social'}
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="p-1.5 bg-slate-900 rounded-lg shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  {isBn ? 'দোকানের অবস্থান' : 'Physical Address'}
                </span>
                <p className="leading-relaxed font-medium">
                  {isBn ? settings.physicalAddressBn : settings.physicalAddressEn}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-[#1877F2] text-white text-xs font-semibold rounded-xl border border-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isBn ? 'অফিসিয়াল ফেসবুক পেজ' : 'Official Facebook Page'}</span>
              </a>
            </div>
          </div>

          {/* Col 4: Delivery policy overview & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isBn ? 'ডেলিভারি ও পলিসি' : 'Delivery & Policies'}
            </h4>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-400">{isBn ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
                <span className="text-white tabular-nums">৳{settings.defaultDeliveryFee}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-400">{isBn ? 'ফ্রি ডেলিভারি সীমা:' : 'Free Threshold:'}</span>
                <span className="text-emerald-400 tabular-nums">৳{settings.freeDeliveryThreshold.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                {isBn ? 'পেমেন্ট মাধ্যম: ক্যাশ অন ডেলিভারি (COD)' : 'Payment: Cash on Delivery'}
              </div>
            </div>

            <div className="pt-1 flex flex-col gap-1.5 text-xs">
              <button
                onClick={onOpenPolicies}
                className="text-left text-slate-400 hover:text-sky-400 transition-colors"
              >
                {isBn ? '• ডেলিভারি ও রিটার্ন নীতি' : '• Delivery & Return Policy'}
              </button>
              <button
                onClick={onOpenPolicies}
                className="text-left text-slate-400 hover:text-sky-400 transition-colors"
              >
                {isBn ? '• শর্তাবলী ও গোপনীয়তা' : '• Terms & Privacy Policy'}
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left text-slate-500 hover:text-slate-300 transition-colors text-[11px] mt-1"
              >
                {isBn ? '• অ্যাডমিন পোর্টাল (মালিক)' : '• Owner Admin Portal'}
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeNameBn} ({settings.storeNameEn}). {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isBn ? 'নিরাপদ ক্যাশ অন ডেলিভারি কেনাকাটা' : 'Reliable Cash on Delivery Shopping'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
