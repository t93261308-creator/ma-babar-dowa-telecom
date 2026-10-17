import { BusinessSettings, StorePolicies } from '../types';
import { StorageService } from './storageService';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  storeNameEn: 'Ma Babar Dowa Telecom',
  storeNameBn: 'মা বাবার দোয়া টেলিকম',
  taglineBn: '— যোগাযোগে থাকুন সবসময় —',
  taglineEn: '— Stay Connected Always —',
  businessTypeBn: 'মোবাইল এক্সেসরিজ রিটেইল',
  businessTypeEn: 'Mobile accessories retail',
  country: 'Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
  whatsAppNumber: '+8801915857616',
  whatsAppUrl: 'https://wa.me/8801915857616',
  phoneNumber: '01516599185',
  email: 'siamkhan0394@gmail.com',
  physicalAddressBn: 'হিমারদিঘী, কনফিডেন্স স্কুল সংলগ্ন, টঙ্গী, গাজীপুর',
  physicalAddressEn: 'Himardighi, Adjacent to Confidence School, Tongi, Gazipur',
  facebookUrl: 'https://www.facebook.com/share/1bFwqpk2TP/',
  defaultDeliveryFee: 120,
  freeDeliveryThreshold: 2000,
  customLogoUrl: null,
  bannerHeadlineBn: 'অরিজিনাল মোবাইল এক্সেসরিজ ও প্রিমিয়াম গ্যাজেট',
  bannerHeadlineEn: 'Original Mobile Accessories & Premium Gadgets',
  bannerSubtextBn: 'ফাস্ট চার্জার, পাওয়ার ব্যাংক, ইয়ারবাডস ও সুরক্ষা সামগ্রী সুলভ মূল্যে ক্যাশ অন ডেলিভারিতে সারাদেশে পৌঁছে দিচ্ছি।',
  bannerSubtextEn: 'Fast chargers, power banks, earbuds, and protection essentials delivered across Bangladesh with Cash on Delivery.',
};

export const DEFAULT_STORE_POLICIES: StorePolicies = {
  privacyPolicyBn: `মা বাবার দোয়া টেলিকম-এ আপনার তথ্যের নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার।
১. আমরা শুধুমাত্র গ্রাহকের অর্ডার সফলভাবে ডেলিভারি ও যোগাযোগের উদ্দেশ্যে নাম, মোবাইল নম্বর এবং ঠিকানা সংরক্ষণ করি।
২. আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে বাণিজ্যিক উদ্দেশ্যে শেয়ার বা বিক্রি করা হয় না।
৩. স্থানীয় ব্রাউজার ডেটাবেসে সংরক্ষিত তথ্য নিরাপদ এবং শুধুমাত্র আপনার অর্ডার প্রক্রিয়া পরিচালনায় ব্যবহৃত হয়।`,
  privacyPolicyEn: `At Ma Babar Dowa Telecom, your data privacy is our highest priority.
1. We collect customer name, phone number, and shipping address strictly for processing and delivering your orders.
2. We never sell, share, or disclose your personal information to third parties for marketing purposes.
3. Local browser-stored order information remains private and is only used to fulfill transactions.`,

  termsConditionsBn: `মা বাবার দোয়া টেলিকম থেকে পণ্য ক্রয়ের ক্ষেত্রে সাধারণ শর্তাবলী:
১. আমাদের সমস্ত বিক্রয় নগদ ক্যাশ অন ডেলিভারি (Cash on Delivery) ভিত্তিতে পরিচালিত হয়।
২. অর্ডার কনফার্মেশনের জন্য আমাদের প্রতিনিধি গ্রাহকের প্রদত্ত ফোন নম্বরে যোগাযোগ করতে পারেন।
৩. পণ্য স্টক বা প্রযুক্তিগত সমস্যার কারণে যেকোনো সময় অর্ডার বাতিল বা সংশোধনের অধিকার কর্তৃপক্ষ সংরক্ষণ করে।
৪. ডেলিভারিম্যানের সামনে পার্সেলটি খুলে যাচাই করে মূল্য পরিশোধ করার অনুরোধ জানানো হচ্ছে।`,
  termsConditionsEn: `Terms & Conditions for purchasing from Ma Babar Dowa Telecom:
1. All retail transactions are fulfilled via Cash on Delivery (COD).
2. Our customer service representative may verify order details via telephone prior to dispatch.
3. The store reserves the right to cancel or amend orders in the event of stock unavailability or pricing corrections.
4. Customers are kindly advised to verify product contents in the presence of the courier delivery agent.`,

  deliveryPolicyBn: `ডেলিভারি সংক্রান্ত নিয়ম ও চার্জ:
১. নিয়মিত ডেলিভারি ফি: ৳১২০ (সারা বাংলাদেশ)।
২. বিশেষ অফার: ৳২,০০০ বা তার বেশি মূল্যের অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০)!
৩. ডেলিভারি সময়সীমা: গাজীপুর ও ঢাকার অভ্যন্তরে ১-২ কর্মদিবস, এবং অন্যান্য জেলায় ২-৪ কর্মদিবসের মধ্যে সরবরাহ করা হয়।
৪. কুরিয়ার পার্সেল হ্যান্ডওভার হওয়ার পর ট্র্যাকিং কোড বা আপডেট গ্রাহককে ফোনে জানানো হবে।`,
  deliveryPolicyEn: `Delivery Policy & Shipping Charges:
1. Standard Delivery Fee: ৳120 nationwide.
2. Special Benefit: Orders with an eligible merchandise subtotal of ৳2,000 or above receive 100% FREE delivery (৳0)!
3. Delivery Timeline: Within 1-2 business days for Tongi/Gazipur/Dhaka, and 2-4 business days for other districts across Bangladesh.
4. Courier updates are communicated via the customer phone number once dispatched.`,

  refundPolicyBn: `রিটার্ন ও রিপ্লেসমেন্ট পলিসি:
১. পণ্যে ফ্যাক্টরি ত্রুটি (Manufacturing Defect) থাকলে ডেলিভারি গ্রহণের ৩ দিনের মধ্যে আমাদের সাথে যোগাযোগ করতে হবে।
২. পণ্যটি অক্ষত অবস্থায় এর মূল বক্স ও এক্সেসরিজসহ রিটার্ন করতে হবে।
৩. ত্রুটিযুক্ত পণ্যের ক্ষেত্রে দ্রুত রিপ্লেসমেন্ট অথবা আলোচনা সাপেক্ষে পরিশোধিত অর্থ ফেরত (রিফান্ড) প্রদান করা হবে।
৪. ভুল পণ্য বা ভাঙা অবস্থায় ডেলিভারি পেলে ডেলিভারিম্যান থাকা অবস্থায়ই আমাদের হটলাইনে (+৮৮০১৫১৬৫৯৯১৮৫) জানান।`,
  refundPolicyEn: `Return & Refund Policy:
1. If any product arrives with a manufacturing defect, please report within 3 days of delivery.
2. The product must be returned in its original condition with all included boxes, tags, and accessories.
3. For verified manufacturing defects, an immediate replacement or full refund will be processed upon inspection.
4. In case of damaged or incorrect items upon delivery, please notify our hotline (01516599185) immediately.`,
};

class BusinessSettingsService {
  private cachedSettings: BusinessSettings = { ...DEFAULT_BUSINESS_SETTINGS };
  private cachedPolicies: StorePolicies = { ...DEFAULT_STORE_POLICIES };
  private isLoaded = false;

  async init(): Promise<void> {
    if (this.isLoaded) return;
    try {
      const storedSettings = await StorageService.getRecord<BusinessSettings>(
        StorageService.STORES.SETTINGS,
        'config',
        DEFAULT_BUSINESS_SETTINGS
      );
      this.cachedSettings = { ...DEFAULT_BUSINESS_SETTINGS, ...storedSettings };

      const storedPolicies = await StorageService.getRecord<StorePolicies>(
        StorageService.STORES.POLICIES,
        'policies',
        DEFAULT_STORE_POLICIES
      );
      this.cachedPolicies = { ...DEFAULT_STORE_POLICIES, ...storedPolicies };
    } catch {
      this.cachedSettings = { ...DEFAULT_BUSINESS_SETTINGS };
      this.cachedPolicies = { ...DEFAULT_STORE_POLICIES };
    } finally {
      this.isLoaded = true;
    }
  }

  getSettings(): BusinessSettings {
    return this.cachedSettings;
  }

  getPolicies(): StorePolicies {
    return this.cachedPolicies;
  }

  async updateSettings(newSettings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    this.cachedSettings = {
      ...this.cachedSettings,
      ...newSettings,
    };
    await StorageService.setRecord(StorageService.STORES.SETTINGS, 'config', this.cachedSettings);
    return this.cachedSettings;
  }

  async updatePolicies(newPolicies: Partial<StorePolicies>): Promise<StorePolicies> {
    this.cachedPolicies = {
      ...this.cachedPolicies,
      ...newPolicies,
    };
    await StorageService.setRecord(StorageService.STORES.POLICIES, 'policies', this.cachedPolicies);
    return this.cachedPolicies;
  }

  /**
   * Consolidated delivery calculation rule:
   * - If eligible merchandise subtotal < freeDeliveryThreshold, charge defaultDeliveryFee (৳120).
   * - If eligible merchandise subtotal >= freeDeliveryThreshold (৳2000), charge ৳0.
   * - Does NOT include delivery fee inside subtotal.
   * - Returns pure subtotal, calculated delivery fee, and final payable total.
   */
  calculateDelivery(subtotal: number): {
    subtotal: number;
    deliveryFee: number;
    total: number;
    isFreeDelivery: boolean;
    remainingForFreeDelivery: number;
    freeDeliveryThreshold: number;
  } {
    const cleanSubtotal = Math.max(0, subtotal);
    const threshold = this.cachedSettings.freeDeliveryThreshold ?? 2000;
    const baseFee = this.cachedSettings.defaultDeliveryFee ?? 120;

    const isFreeDelivery = cleanSubtotal >= threshold;
    const deliveryFee = cleanSubtotal === 0 ? 0 : isFreeDelivery ? 0 : baseFee;
    const total = cleanSubtotal + deliveryFee;
    const remainingForFreeDelivery = isFreeDelivery ? 0 : Math.max(0, threshold - cleanSubtotal);

    return {
      subtotal: cleanSubtotal,
      deliveryFee,
      total,
      isFreeDelivery,
      remainingForFreeDelivery,
      freeDeliveryThreshold: threshold,
    };
  }

  /**
   * Normalized WhatsApp click-to-chat URL with optional pre-filled text.
   * Number is normalized to international digits without '+', spaces, or dashes.
   */
  getWhatsAppChatUrl(prefilledText?: string): string {
    const rawNumber = this.cachedSettings.whatsAppNumber || '+8801915857616';
    const normalizedDigits = rawNumber.replace(/\D/g, ''); // 8801915857616
    const base = `https://wa.me/${normalizedDigits}`;
    if (!prefilledText) return base;
    return `${base}?text=${encodeURIComponent(prefilledText)}`;
  }

  /**
   * Telephone link
   */
  getTelUrl(): string {
    const clean = (this.cachedSettings.phoneNumber || '01516599185').replace(/\s+/g, '');
    return `tel:${clean}`;
  }

  /**
   * Email link
   */
  getMailtoUrl(subject?: string): string {
    const email = this.cachedSettings.email || 'siamkhan0394@gmail.com';
    return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
  }

  /**
   * Facebook Page link
   */
  getFacebookUrl(): string {
    return this.cachedSettings.facebookUrl || 'https://www.facebook.com/share/1bFwqpk2TP/';
  }
}

export const businessSettingsService = new BusinessSettingsService();
