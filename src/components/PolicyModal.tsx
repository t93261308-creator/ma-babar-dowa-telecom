import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Truck, RotateCcw } from 'lucide-react';
import { StorePolicies, Language } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: StorePolicies;
  language: Language;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  policies,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'delivery' | 'terms' | 'refund' | 'privacy'>('delivery');
  const isBn = language === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {isBn ? 'স্টোর পলিসি ও নির্দেশিকা' : 'Store Policies & Guidelines'}
            </h2>
            <p className="text-xs text-slate-300">
              {isBn ? 'মা বাবার দোয়া টেলিকম — স্বচ্ছ ও গ্রাহকবান্ধব সেবা' : 'Ma Babar Dowa Telecom Store Policies'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'delivery'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{isBn ? 'ডেলিভারি নীতি (৳১২০ / ফ্রি)' : 'Delivery Policy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'refund'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isBn ? 'রিটার্ন ও রিপ্লেসমেন্ট' : 'Return & Refund'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isBn ? 'শর্তাবলী (Terms)' : 'Terms & Conditions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto leading-relaxed text-sm text-slate-700 whitespace-pre-line">
          {activeTab === 'delivery' && (isBn ? policies.deliveryPolicyBn : policies.deliveryPolicyEn)}
          {activeTab === 'refund' && (isBn ? policies.refundPolicyBn : policies.refundPolicyEn)}
          {activeTab === 'terms' && (isBn ? policies.termsConditionsBn : policies.termsConditionsEn)}
          {activeTab === 'privacy' && (isBn ? policies.privacyPolicyBn : policies.privacyPolicyEn)}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
