import React, { useState } from 'react';
import { X, ShoppingBag, Truck, ShieldCheck, Check, MessageSquare } from 'lucide-react';
import { Product, Language, BusinessSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  settings: BusinessSettings;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  settings,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !product) return null;

  const isBn = language === 'bn';
  const qualifiesForFreeDelivery = product.price * quantity >= settings.freeDeliveryThreshold;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleInstantBuy = () => {
    onBuyNow(product, quantity);
  };

  const whatsAppInquiryUrl = settings.whatsAppUrl + `?text=${encodeURIComponent(
    `হ্যালো, মা বাবার দোয়া টেলিকম। আমি "${product.nameBn || product.nameEn}" (দাম: ৳${product.price}) সম্পর্কে জানতে ও অর্ডার করতে আগ্রহী।`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-900 bg-white/90 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media Area */}
          <div className="p-6 bg-slate-100/70 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200">
              {product.image && !imageError ? (
                <img
                  src={product.image}
                  alt={isBn ? (product.nameBn || product.nameEn) : product.nameEn}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 text-center">
                  <ShieldCheck className="w-12 h-12 text-sky-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-600">
                    {isBn ? (product.nameBn || product.nameEn) : product.nameEn}
                  </span>
                </div>
              )}

              {product.isSample && (
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
                  {isBn ? 'নমুনা প্রোডাক্ট' : 'Sample Product'}
                </span>
              )}

              {(product.regularPrice || product.originalPrice) && (product.regularPrice || product.originalPrice)! > product.price && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-md shadow-xs">
                  {Math.round(((((product.regularPrice || product.originalPrice)!) - product.price) / ((product.regularPrice || product.originalPrice)!)) * 100)}% {isBn ? 'ছাড়' : 'OFF'}
                </span>
              )}
            </div>

            {/* Quick WhatsApp Inquiry */}
            <a
              href={whatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'এই প্রোডাক্ট নিয়ে হোয়াটসঅ্যাপে চ্যাট' : 'Chat on WhatsApp about this'}</span>
            </a>
          </div>

          {/* Details & Purchase Contiguous Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{isBn ? product.categoryBn : product.category}</span>
                <span aria-hidden="true">·</span>
                <span className={product.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {product.stock > 0
                    ? isBn ? `স্টকে রয়েছে (${product.stock} টি)` : `In Stock (${product.stock})`
                    : isBn ? 'স্টক শেষ' : 'Out of Stock'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {isBn ? (product.nameBn || product.nameEn) : (product.nameEn || product.nameBn)}
              </h2>

              {/* Price & Free delivery notice (2 prices: Regular and Discount) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {(product.regularPrice || product.originalPrice) && (product.regularPrice || product.originalPrice)! > product.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through tabular-nums">
                        ৳{(product.regularPrice || product.originalPrice)!.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {Math.round(((((product.regularPrice || product.originalPrice)!) - product.price) / ((product.regularPrice || product.originalPrice)!)) * 100)}% {isBn ? 'ডিসকাউন্ট' : 'Savings'}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-slate-500 font-medium ml-auto">
                    {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs pt-1">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  {qualifiesForFreeDelivery ? (
                    <span className="text-emerald-700 font-semibold">
                      {isBn ? '✓ ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০)' : '✓ FREE Delivery applies (৳0)'}
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      {isBn
                        ? `ডেলিভারি ফি: ৳${settings.defaultDeliveryFee} (৳${settings.freeDeliveryThreshold} এর অর্ডারে ফ্রি)`
                        : `Delivery: ৳${settings.defaultDeliveryFee} (Free over ৳${settings.freeDeliveryThreshold})`}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {isBn ? product.descriptionBn : product.descriptionEn}
              </p>

              {/* Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {isBn ? 'পণ্যের স্পেসিফিকেশন' : 'Specifications'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block font-medium">
                          {isBn ? spec.labelBn : spec.labelEn}
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {isBn ? spec.valueBn : spec.valueEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Buy Module */}
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {isBn ? 'পরিমাণ (Quantity)' : 'Quantity'}
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isBn ? 'ব্যাগে যুক্ত' : 'Added'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-slate-700" />
                      <span>{isBn ? 'ব্যাগে রাখুন' : 'Add to Bag'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleInstantBuy}
                  disabled={product.stock <= 0}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all active:scale-95"
                >
                  <span>{isBn ? 'এখনই কিনুন (COD)' : 'Buy Now (COD)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
