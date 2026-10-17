import React from 'react';
import { CheckCircle, Printer, MessageSquare, Phone, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { Order, Language, BusinessSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  settings: BusinessSettings;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  language,
  settings,
}) => {
  if (!isOpen || !order) return null;

  const isBn = language === 'bn';

  // Construct message for shop WhatsApp
  const itemsText = order.items
    .map((item) => `• ${item.nameBn} x ${item.quantity} = ৳${item.price * item.quantity}`)
    .join('\n');

  const prefilledWhatsAppText = `*নতুন অর্ডার বিজ্ঞপ্তি (${order.id})*
----------------------------
*দোকান:* ${settings.storeNameBn}
*গ্রাহক:* ${order.customer.name}
*মোবাইল:* ${order.customer.phone}
*ঠিকানা:* ${order.customer.address}, ${order.customer.areaOrDistrict}
${order.customer.notes ? `*নোট:* ${order.customer.notes}\n` : ''}
*অর্ডারকৃত পণ্য:*
${itemsText}
----------------------------
*পণ্যের মূল্য (Subtotal):* ৳${order.subtotal}
*ডেলিভারি ফি:* ৳${order.deliveryFee}
*সর্বমোট প্রদেয় (COD):* ৳${order.total}
*পেমেন্ট:* ক্যাশ অন ডেলিভারি (বকেয়া)`;

  const whatsAppUrl = settings.whatsAppUrl + `?text=${encodeURIComponent(prefilledWhatsAppText)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="no-print p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isBn ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
              </h2>
              <p className="text-xs text-slate-300">
                {isBn ? `অর্ডার আইডি: #${order.id}` : `Order ID: #${order.id}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'রশিদ প্রিন্ট' : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {isBn ? 'সম্পন্ন' : 'Done'}
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900 print:p-0">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <BrandLogo customLogoUrl={settings.customLogoUrl} size="sm" showText={true} />
              <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>{settings.physicalAddressBn}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-sky-600 shrink-0" />
                  <span className="tabular-nums">হটলাইন: {settings.phoneNumber} | হোয়াটসঅ্যাপ: {settings.whatsAppNumber}</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600">
              <span className="font-bold text-slate-900 text-sm block">ক্যাশ মেমো / চালান</span>
              <p className="tabular-nums">আইডি: <strong className="text-slate-900">{order.id}</strong></p>
              <p className="tabular-nums">তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')}</p>
              <p className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                {isBn ? 'পেমেন্ট: বকেয়া (COD)' : 'Payment: Unpaid (COD)'}
              </p>
            </div>
          </div>

          {/* Customer Delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                {isBn ? 'গ্রাহকের বিবরণ' : 'Customer Info'}
              </span>
              <p className="font-semibold text-slate-900">{order.customer.name}</p>
              <p className="tabular-nums text-slate-700">{order.customer.phone}</p>
              {order.customer.altPhone && (
                <p className="tabular-nums text-slate-500">বিকল্প: {order.customer.altPhone}</p>
              )}
            </div>
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
              </span>
              <p className="text-slate-800">{order.customer.address}</p>
              <p className="text-slate-600 font-medium">{order.customer.areaOrDistrict}</p>
              {order.customer.notes && (
                <p className="text-slate-500 italic mt-1">নোট: {order.customer.notes}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="py-2 pr-4">{isBn ? 'পণ্য' : 'Item'}</th>
                  <th className="py-2 text-center">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                  <th className="py-2 text-right">{isBn ? 'দর' : 'Unit Price'}</th>
                  <th className="py-2 text-right">{isBn ? 'মোট' : 'Total'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-2.5 pr-4 font-medium">
                      {isBn ? item.nameBn : item.nameEn}
                    </td>
                    <td className="py-2.5 text-center tabular-nums">{item.quantity}</td>
                    <td className="py-2.5 text-right tabular-nums">৳{item.price.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold tabular-nums">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'পণ্যের মোট মূল্য' : 'Subtotal'}</span>
              <span className="font-bold tabular-nums text-slate-900">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
              <span className={`font-bold tabular-nums ${order.deliveryFee === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {order.deliveryFee === 0 ? '৳০ (ফ্রি ডেলিভারি)' : `৳${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>{isBn ? 'সর্বমোট প্রদেয় (ক্যাশ অন ডেলিভারি)' : 'Total Payable (COD)'}</span>
              <span className="text-sky-700 text-lg tabular-nums">৳{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Fast WhatsApp / Phone contact instructions */}
          <div className="no-print pt-4 space-y-3">
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'অর্ডারটি দ্রুততম সময়ে কনফার্ম করতে চান?' : 'Want faster order processing?'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'নিচের বাটনে ক্লিক করে আপনার হোয়াটসঅ্যাপে এই অর্ডারের বিবরণ সরাসরি আমাদের পাঠিয়ে দিন। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবে।'
                  : 'Click below to send your order summary to our shop WhatsApp for immediate confirmation.'}
              </p>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isBn ? 'দোকানের হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Send Order to Shop WhatsApp'}</span>
              </a>
              <p className="text-[10px] text-slate-400 text-center">
                * লক্ষ্য করুন: হোয়াটসঅ্যাপ লিংক ওপেন করলে মেসেজ পাঠানো শুরু করার জন্য হোয়াটসঅ্যাপে "Send" বাটনে চাপ দিতে হবে।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={`tel:${settings.phoneNumber}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-600"
              >
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>{isBn ? `সরাসরি ফোন করুন: ${settings.phoneNumber}` : `Call us directly: ${settings.phoneNumber}`}</span>
              </a>

              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isBn ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
