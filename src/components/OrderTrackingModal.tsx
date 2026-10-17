import React, { useState } from 'react';
import { X, Search, PackageCheck, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, Language } from '../types';
import { StorageService } from '../services/storageService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const allOrders = await StorageService.getAll<Order>(StorageService.STORES.ORDERS);
    const matches = allOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(clean) ||
        o.customer.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, ''))
    );
    setFoundOrders(matches);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {isBn ? 'অপেক্ষমান (Pending)' : 'Pending Verification'}
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isBn ? 'নিশ্চিত করা হয়েছে' : 'Confirmed'}
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
            <Truck className="w-3.5 h-3.5" />
            {isBn ? 'কুরিয়ারে হস্তান্তর' : 'Dispatched/Shipped'}
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <PackageCheck className="w-3.5 h-3.5" />
            {isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            {isBn ? 'বাতিল' : 'Cancelled'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">
              {isBn ? 'অর্ডার ট্র্যাকিং ও অবস্থা অনুসন্ধান' : 'Track Your Order'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isBn
                ? 'আপনার অর্ডার আইডি বা ফোন নম্বর দিয়ে বর্তমান অবস্থা জানুন'
                : 'Enter your Order ID or phone number to check status'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBn ? 'অর্ডার আইডি (যেমন: MBDT-1001) বা মোবাইল নম্বর' : 'Order ID or phone number'}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'খুঁজুন' : 'Track'}</span>
            </button>
          </form>

          {/* Results Area */}
          <div>
            {hasSearched && foundOrders && foundOrders.length === 0 && (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-700">
                  {isBn ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No matching order found in this browser storage.'}
                </p>
                <p className="text-slate-400">
                  {isBn
                    ? 'দয়া করে সঠিক আইডি বা নম্বর চেক করুন অথবা আমাদের হটলাইনে (০১৫১৬৫৯৯১৮৫) যোগাযোগ করুন।'
                    : 'Please check your Order ID or call our hotline for assistance.'}
                </p>
              </div>
            )}

            {hasSearched && foundOrders && foundOrders.length > 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {foundOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">#{order.id}</span>
                        <span className="text-slate-500 text-[11px] tabular-nums">
                          {new Date(order.createdAt).toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    <div className="divide-y divide-slate-200/60 border-t border-b border-slate-200/60 py-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1 text-slate-700">
                          <span>{item.nameBn} × {item.quantity}</span>
                          <span className="font-semibold tabular-nums">৳{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span>{isBn ? 'মোট প্রদেয় (ক্যাশ অন ডেলিভারি):' : 'Total Payable (COD):'}</span>
                      <span className="text-sm font-bold text-sky-700 tabular-nums">৳{order.total.toLocaleString()}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      <span>ঠিকানা: {order.customer.address}, {order.customer.areaOrDistrict}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
