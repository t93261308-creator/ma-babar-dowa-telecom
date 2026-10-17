export type Language = 'bn' | 'en';

export type OrderSource = 'Website' | 'WhatsApp' | 'Phone';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery';

export interface Product {
  id: string;
  nameBn?: string;
  nameEn: string;
  category: string;
  categoryBn: string;
  price: number; // Active selling / payable price
  regularPrice?: number; // Regular price before discount
  discountPrice?: number; // Discounted promotional price
  originalPrice?: number; // Maintained for backward compatibility
  stock: number;
  image: string;
  descriptionBn: string;
  descriptionEn: string;
  specs: {
    labelBn: string;
    labelEn: string;
    valueBn: string;
    valueEn: string;
  }[];
  isSample?: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  altPhone?: string;
  address: string;
  areaOrDistrict: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  nameBn: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. MBDT-1001
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  source: OrderSource;
  adminNotes?: string;
}

export interface BusinessSettings {
  storeNameEn: string;
  storeNameBn: string;
  taglineBn: string;
  taglineEn: string;
  businessTypeBn: string;
  businessTypeEn: string;
  country: string;
  currency: string;
  currencySymbol: string;
  whatsAppNumber: string; // +8801915857616
  whatsAppUrl: string; // https://wa.me/8801915857616
  phoneNumber: string; // 01516599185
  email: string; // siamkhan0394@gmail.com
  physicalAddressBn: string; // হিমারদিঘী, কনফিডেন্স স্কুল সংলগ্ন, টঙ্গী, গাজীপুর
  physicalAddressEn: string; // Himardighi, Adjacent to Confidence School, Tongi, Gazipur
  facebookUrl: string; // https://www.facebook.com/share/1bFwqpk2TP/
  defaultDeliveryFee: number; // 120
  freeDeliveryThreshold: number; // 2000
  customLogoUrl: string | null;
  bannerHeadlineBn: string;
  bannerHeadlineEn: string;
  bannerSubtextBn: string;
  bannerSubtextEn: string;
}

export interface StorePolicies {
  privacyPolicyBn: string;
  privacyPolicyEn: string;
  termsConditionsBn: string;
  termsConditionsEn: string;
  deliveryPolicyBn: string;
  deliveryPolicyEn: string;
  refundPolicyBn: string;
  refundPolicyEn: string;
}
