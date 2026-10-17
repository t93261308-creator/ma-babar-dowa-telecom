import React, { useState } from 'react';
import { ArrowLeft, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CartItem, Order, Language, BusinessSettings } from '../types';
import { businessSettingsService } from '../services/businessSettingsService';
import { StorageService } from '../services/storageService';

interface CheckoutViewProps {
  cart: CartItem[];
  language: Language;
  settings: BusinessSettings;
  onBackToShopping: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  language,
  settings,
  onBackToShopping,
  onOrderCompleted,
}) => {
  const isBn = language === 'bn';

  // Customer form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [areaOrDistrict, setAreaOrDistrict] = useState('টঙ্গী / গাজীপুর');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consolidated delivery calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryInfo = businessSettingsService.calculateDelivery(subtotal);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)।' : 'Please enter a valid 11-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।' : 'Please provide full delivery address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(isBn ? 'আপনার কার্টে কোনো পণ্য নেই।' : 'Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate clean unique Order ID
      const orderId = `MBDT-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          altPhone: altPhone.trim() || undefined,
          address: address.trim(),
          areaOrDistrict,
          notes: notes.trim() || undefined,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          nameBn: item.product.nameBn || item.product.nameEn,
          nameEn: item.product.nameEn || item.product.nameBn || '',
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image || '',
        })),
        subtotal: deliveryInfo.subtotal,
        deliveryFee: deliveryInfo.deliveryFee,
        total: deliveryInfo.total,
        paymentMethod: 'Cash on Delivery',
        isPaid: false, // Per prompt: Do not mark a COD order as paid before payment is actually collected
        status: 'Pending',
        source: 'Website',
      };

      // Store order in persistent local storage
      await StorageService.putItem(StorageService.STORES.ORDERS, newOrder);

      // Decrement stock in catalog
      const existingProducts = await StorageService.getAll<{ id: string; stock: number }>(StorageService.STORES.PRODUCTS);
      for (const item of cart) {
        const p = existingProducts.find((x) => x.id === item.product.id);
        if (p) {
          p.stock = Math.max(0, p.stock - item.quantity);
          await StorageService.putItem(StorageService.STORES.PRODUCTS, p as any);
        }
      }

      onOrderCompleted(newOrder);
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(isBn ? 'অর্ডার প্রসেস করতে সাময়িক সমস্যা হয়েছে, আবার চেষ্টা করুন।' : 'Failed to process order, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBackToShopping}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'কেনাকাটায় ফিরে যান' : 'Back to Shopping'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Delivery Details Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              {isBn ? 'ডেলিভারির তথ্য পূরণ করুন' : 'Delivery Information'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isBn
                ? 'পণ্য পৌঁছানোর পর দেখে মূল্য পরিশোধ (Cash on Delivery) করবেন।'
                : 'Pay with Cash on Delivery once you physically receive your package.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {isBn ? 'আপনার পুরো নাম *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBn ? 'যেমন: মো: রফিকুল ইসলাম' : 'e.g. John Doe'}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {isBn ? 'সচল মোবাইল নম্বর *' : 'Active Mobile Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {isBn ? 'বিকল্প মোবাইল নম্বর (ঐচ্ছিক)' : 'Alternate Phone (Optional)'}
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {isBn ? 'জেলা / এলাকা নির্বাচন করুন *' : 'District / Region *'}
              </label>
              <select
                value={areaOrDistrict}
                onChange={(e) => setAreaOrDistrict(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="টঙ্গী / গাজীপুর">টঙ্গী / গাজীপুর (লোকাল ডেলিভারি ১-২ দিন)</option>
                <option value="ঢাকা সিটি">ঢাকা সিটি (১-২ দিন)</option>
                <option value="ঢাকা বিভাগীয় জেলা">ঢাকা বিভাগীয় অন্যান্য জেলা (২-৩ দিন)</option>
                <option value="চট্টগ্রাম বিভাগ">চট্টগ্রাম বিভাগ</option>
                <option value="রাজশাহী বিভাগ">রাজশাহী বিভাগ</option>
                <option value="খুলনা বিভাগ">খুলনা বিভাগ</option>
                <option value="সিলেট বিভাগ">সিলেট বিভাগ</option>
                <option value="বরিশাল বিভাগ">বরিশাল বিভাগ</option>
                <option value="রংপুর বিভাগ">রংপুর বিভাগ</option>
                <option value="ময়মনসিংহ বিভাগ">ময়মনসিংহ বিভাগ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {isBn ? 'সম্পূর্ণ ডেলিভারি ঠিকানা *' : 'Detailed Delivery Address *'}
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isBn ? 'বাসা/ফ্ল্যাট নং, রোড নং, পাড়া বা এলাকার নাম, পোস্ট অফিস...' : 'House, Road, Area, Landmark...'}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {isBn ? 'অতিরিক্ত নির্দেশনা (ঐচ্ছিক)' : 'Delivery Notes (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBn ? 'যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়' : 'e.g. Please call before delivery'}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            {/* Payment Method Notice */}
            <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-3 mt-4">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">
                  {isBn ? 'পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Payment Method: Cash on Delivery (COD)'}
                </span>
                <p>
                  {isBn
                    ? 'কোনো অগ্রিম পেমেন্ট করতে হবে না। পণ্য হাতে পেয়ে কুরিয়ারের কাছে মূল্য পরিশোধ করবেন।'
                    : 'No advance payment needed. Pay in cash to the courier upon delivery inspection.'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-4 px-6 bg-slate-900 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50 text-base"
            >
              {isSubmitting
                ? isBn ? 'অর্ডার প্রক্রিয়াকরণ হচ্ছে...' : 'Processing Order...'
                : isBn ? `অর্ডার নিশ্চিত করুন (৳${deliveryInfo.total.toLocaleString()})` : `Confirm Order (৳${deliveryInfo.total.toLocaleString()})`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            {isBn ? 'অর্ডারের সারসংক্ষেপ' : 'Order Summary'}
          </h3>

          {/* Cart items list */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 tabular-nums">
                    {item.quantity}×
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {isBn ? (item.product.nameBn || item.product.nameEn) : (item.product.nameEn || item.product.nameBn)}
                  </span>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'পণ্যের মোট মূল্য (Subtotal)' : 'Merchandise Subtotal'}</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ৳{deliveryInfo.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
              </span>
              <span className={`font-semibold tabular-nums ${deliveryInfo.isFreeDelivery ? 'text-emerald-700 font-bold' : 'text-slate-900'}`}>
                {deliveryInfo.isFreeDelivery ? '৳০ (ফ্রি অফার)' : `৳${deliveryInfo.deliveryFee}`}
              </span>
            </div>

            {deliveryInfo.isFreeDelivery && (
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-medium border border-emerald-100">
                {isBn
                  ? `✓ ৳${settings.freeDeliveryThreshold.toLocaleString()} এর বেশি অর্ডারে আপনার জন্য ফ্রি ডেলিভারি প্রয়োগ করা হয়েছে!`
                  : `✓ Free delivery applied for orders reaching ৳${settings.freeDeliveryThreshold.toLocaleString()}!`}
              </div>
            )}

            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>{isBn ? 'সর্বমোট প্রদেয় টাকা' : 'Total Payable'}</span>
              <span className="text-sky-700 text-xl tabular-nums">
                ৳{deliveryInfo.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Trust box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? settings.storeNameBn : settings.storeNameEn} নিশ্চয়তা</span>
            </div>
            <p className="leading-relaxed">
              {isBn
                ? 'আমরা গ্রাহকের আস্থা রক্ষায় ১০০% প্রতিশ্রুতিবদ্ধ। পার্সেল ডেলিভারি পাওয়ার পর কোনো সমস্যা হলে আমাদের সাথে সাথে যোগাযোগ করুন।'
                : 'We stand 100% behind genuine quality. Contact us immediately for any inquiries.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
