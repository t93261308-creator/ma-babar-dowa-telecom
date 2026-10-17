import React from 'react';
import { X, Trash2, ArrowRight, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { businessSettingsService } from '../services/businessSettingsService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  language: Language;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  // Merchandise subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryInfo = businessSettingsService.calculateDelivery(subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / deliveryInfo.freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'আপনার শপিং ব্যাগ' : 'Your Shopping Bag'}
            </h2>
            <span className="text-xs text-slate-500 font-medium tabular-nums">
              ({cart.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Target Banner */}
        <div className="bg-sky-50 px-6 py-3 border-b border-sky-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-sky-600" />
              {deliveryInfo.isFreeDelivery
                ? isBn ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন (৳০)' : 'Congratulations! You unlocked FREE Delivery (৳0)'
                : isBn
                ? `আর ৳${deliveryInfo.remainingForFreeDelivery.toLocaleString()} টাকার কেনাকাটা করলেই ফ্রি ডেলিভারি!`
                : `Add ৳${deliveryInfo.remainingForFreeDelivery.toLocaleString()} more for FREE Delivery!`}
            </span>
            <span className="tabular-nums text-sky-700">{progressPercent}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-sky-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="p-4 bg-slate-100 rounded-full">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {isBn ? 'আপনার ব্যাগটি বর্তমানে খালি।' : 'Your shopping bag is empty.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
              >
                {isBn ? 'পণ্য ব্রাউজ করুন' : 'Browse Products'}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-4 flex gap-4 items-center">
                {/* Product thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={isBn ? (item.product.nameBn || item.product.nameEn) : (item.product.nameEn || item.product.nameBn)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {isBn ? (item.product.nameBn || item.product.nameEn) : (item.product.nameEn || item.product.nameBn)}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs mt-0.5">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      ৳{item.product.price.toLocaleString()}
                    </span>
                    {(item.product.regularPrice || item.product.originalPrice) && (item.product.regularPrice || item.product.originalPrice)! > item.product.price && (
                      <span className="text-slate-400 line-through text-[11px] tabular-nums">
                        ৳{(item.product.regularPrice || item.product.originalPrice)!.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-l-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-r-lg transition-colors disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isBn ? 'পণ্যের মোট মূল্য (Subtotal)' : 'Merchandise Subtotal'}</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  ৳{deliveryInfo.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  <span>{isBn ? 'ডেলিভারি ফি' : 'Delivery Fee'}</span>
                  {deliveryInfo.isFreeDelivery && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      {isBn ? 'ফ্রি অফার' : 'Free Offer'}
                    </span>
                  )}
                </span>
                <span className={`font-semibold tabular-nums ${deliveryInfo.isFreeDelivery ? 'text-emerald-700 font-bold' : 'text-slate-900'}`}>
                  {deliveryInfo.isFreeDelivery ? '৳০' : `৳${deliveryInfo.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>{isBn ? 'সর্বমোট প্রদেয় (COD)' : 'Total Payable (COD)'}</span>
                <span className="text-sky-700 text-lg tabular-nums">
                  ৳{deliveryInfo.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>{isBn ? 'চেকআউট করুন (ক্যাশ অন ডেলিভারি)' : 'Proceed to Checkout (COD)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-500">
              {isBn ? '✓ ডেলিভারির সময় পণ্য দেখে মূল্য পরিশোধ করুন' : '✓ Pay in cash upon physical receipt'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
