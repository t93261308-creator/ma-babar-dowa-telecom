import React from 'react';
import { Phone, MessageSquare, ShoppingBag } from 'lucide-react';
import { BusinessSettings, Language } from '../types';

interface MobileQuickBarProps {
  settings: BusinessSettings;
  cartCount: number;
  onOpenCart: () => void;
  language: Language;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  language,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg no-print">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Telephone Call Button */}
        <a
          href={`tel:${settings.phoneNumber}`}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-sky-600 mb-0.5" />
          <span className="text-[11px] font-semibold">{isBn ? 'কল করুন' : 'Call'}</span>
        </a>

        {/* WhatsApp Chat Button */}
        <a
          href={settings.whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-700 hover:bg-emerald-50 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-semibold">WhatsApp</span>
        </a>

        {/* Cart Drawer Trigger */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slate-900 text-white font-semibold shadow-xs"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-sky-400 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 flex items-center justify-center bg-sky-500 text-white text-[10px] font-bold rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">{isBn ? 'ব্যাগ' : 'Cart'}</span>
        </button>
      </div>
    </div>
  );
};
