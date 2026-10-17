import React, { useState } from 'react';
import { ShoppingBag, Eye, Smartphone, Zap, Headphones, BatteryCharging, Shield, Check } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isBn = language === 'bn';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'chargers':
      case 'cables':
        return <Zap className="w-8 h-8 text-sky-500" />;
      case 'audio':
        return <Headphones className="w-8 h-8 text-indigo-500" />;
      case 'powerbanks':
        return <BatteryCharging className="w-8 h-8 text-amber-500" />;
      case 'protection':
        return <Shield className="w-8 h-8 text-emerald-500" />;
      default:
        return <Smartphone className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Visual Image Container (65%–75% feel) */}
      <div className="relative aspect-[4/3] bg-slate-100/80 overflow-hidden flex items-center justify-center">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={isBn ? product.nameBn : product.nameEn}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Zero-Broken-Image Policy: High-polish CSS/SVG visual placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-200 text-slate-400">
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 mb-2">
              {getCategoryIcon(product.category)}
            </div>
            <span className="text-[11px] font-medium text-slate-500 text-center line-clamp-1 max-w-[80%]">
              {isBn ? product.categoryBn : product.category}
            </span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-white text-slate-900 hover:text-sky-600 rounded-xl shadow-md transition-transform hover:scale-110 active:scale-95"
            title={isBn ? 'বিস্তারিত দেখুন' : 'Quick View'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quiet Unboxed Indicators */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isSample && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/80">
              {isBn ? 'স্যাম্পল পণ্য' : 'Sample Data'}
            </span>
          )}
          {product.price >= 2000 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-200/80">
              {isBn ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </span>
          )}
          {(product.regularPrice || product.originalPrice) && (product.regularPrice || product.originalPrice)! > product.price && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-rose-200/80">
              {Math.round(((((product.regularPrice || product.originalPrice)!) - product.price) / ((product.regularPrice || product.originalPrice)!)) * 100)}% {isBn ? 'ছাড়' : 'OFF'}
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Category Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{isBn ? product.categoryBn : product.category}</span>
            <span aria-hidden="true">·</span>
            <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
              {product.stock > 0
                ? isBn ? `স্টকে আছে (${product.stock})` : `In Stock (${product.stock})`
                : isBn ? 'স্টক শেষ' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title (supports optional Bangla name fallback) */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
            {isBn ? (product.nameBn || product.nameEn) : (product.nameEn || product.nameBn)}
          </h3>
        </div>

        {/* Price & Action Row (Regular and Discount Price) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              {(product.regularPrice || product.originalPrice) && (product.regularPrice || product.originalPrice)! > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ৳{(product.regularPrice || product.originalPrice)!.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : product.stock > 0
                ? 'bg-slate-900 hover:bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? 'যোগ হয়েছে' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isBn ? 'ব্যাগে নিন' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
