import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  ShoppingBag,
  Settings,
  FileText,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Upload,
  Download,
  AlertTriangle,
  Info,
  PhoneCall,
  MessageSquare,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { Product, Order, BusinessSettings, StorePolicies, Language, OrderStatus, OrderSource } from '../types';
import { StorageService } from '../services/storageService';
import { businessSettingsService } from '../services/businessSettingsService';
import { INITIAL_PRODUCTS } from '../services/sampleData';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSettingsUpdated: (newSettings: BusinessSettings) => void;
  onProductsUpdated: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  language,
  onSettingsUpdated,
  onProductsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'policies' | 'storage'>('orders');
  const isBn = language === 'bn';

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(businessSettingsService.getSettings());
  const [policies, setPolicies] = useState<StorePolicies>(businessSettingsService.getPolicies());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter state for orders
  const [orderSourceFilter, setOrderSourceFilter] = useState<'All' | OrderSource>('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');

  // Manual Order Recording state
  const [isAddingManualOrder, setIsAddingManualOrder] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualSource, setManualSource] = useState<OrderSource>('WhatsApp');
  const [manualProductId, setManualProductId] = useState('');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualNotes, setManualNotes] = useState('');

  // Product Add / Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditingProductOpen, setIsEditingProductOpen] = useState(false);

  // Logo file upload state
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.customLogoUrl);

  const loadData = async () => {
    const o = await StorageService.getAll<Order>(StorageService.STORES.ORDERS);
    setOrders(o.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    const p = await StorageService.getAll<Product>(StorageService.STORES.PRODUCTS);
    setProducts(p);

    setSettings(businessSettingsService.getSettings());
    setPolicies(businessSettingsService.getPolicies());
    setLogoPreview(businessSettingsService.getSettings().customLogoUrl);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Flash message
  const flash = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // --- ORDER MANAGEMENT HANDLERS ---
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const updated: Order = { ...order, status };
    await StorageService.putItem(StorageService.STORES.ORDERS, updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    flash(isBn ? `অর্ডার #${orderId} এর স্ট্যাটাস আপডেট করা হয়েছে।` : `Order #${orderId} status updated.`);
  };

  const handleTogglePaymentStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const updated: Order = { ...order, isPaid: !order.isPaid };
    await StorageService.putItem(StorageService.STORES.ORDERS, updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    flash(
      updated.isPaid
        ? isBn ? `অর্ডার #${orderId} সফলভাবে পেইড চিহ্নিত করা হয়েছে।` : `Order #${orderId} marked as PAID.`
        : isBn ? `অর্ডার #${orderId} বকেয়া চিহ্নিত করা হয়েছে।` : `Order #${orderId} marked as UNPAID.`
    );
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this order?')) return;
    await StorageService.removeItem(StorageService.STORES.ORDERS, orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    flash(isBn ? 'অর্ডার মুছে ফেলা হয়েছে।' : 'Order removed.');
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualPhone.trim() || !manualProductId) {
      alert(isBn ? 'দয়া করে নাম, ফোন নম্বর এবং একটি পণ্য নির্বাচন করুন।' : 'Please fill all required fields.');
      return;
    }

    const selProduct = products.find((p) => p.id === manualProductId);
    if (!selProduct) return;

    const subtotal = selProduct.price * manualQuantity;
    const delivery = businessSettingsService.calculateDelivery(subtotal);
    const orderId = `MBDT-M${Date.now().toString().slice(-4)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: manualCustomerName.trim(),
        phone: manualPhone.trim(),
        address: manualAddress.trim() || 'ম্যানুয়াল এন্ট্রি (ঠিকানা প্রয়োজন অনুযায়ী আপডেট করুন)',
        areaOrDistrict: 'টঙ্গী / গাজীপুর',
        notes: manualNotes.trim() ? `[ম্যানুয়াল ${manualSource}] ${manualNotes}` : `[ম্যানুয়াল ${manualSource}]`,
      },
      items: [
        {
          productId: selProduct.id,
          nameBn: selProduct.nameBn || selProduct.nameEn,
          nameEn: selProduct.nameEn,
          price: selProduct.price,
          quantity: manualQuantity,
          image: selProduct.image,
        },
      ],
      subtotal: delivery.subtotal,
      deliveryFee: delivery.deliveryFee,
      total: delivery.total,
      paymentMethod: 'Cash on Delivery',
      isPaid: false,
      status: 'Confirmed',
      source: manualSource,
    };

    await StorageService.putItem(StorageService.STORES.ORDERS, newOrder);
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    selProduct.stock = Math.max(0, selProduct.stock - manualQuantity);
    await StorageService.putItem(StorageService.STORES.PRODUCTS, selProduct);
    setProducts((prev) => prev.map((p) => (p.id === selProduct.id ? selProduct : p)));
    onProductsUpdated();

    // Reset manual form
    setManualCustomerName('');
    setManualPhone('');
    setManualAddress('');
    setManualNotes('');
    setIsAddingManualOrder(false);
    flash(isBn ? `ম্যানুয়াল অর্ডার #${orderId} (${manualSource}) সফলভাবে রেকর্ড করা হয়েছে!` : `Manual order #${orderId} recorded!`);
  };

  // Product image upload handler from device/computer
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isBn ? 'ছবির সাইজ ৫MB এর নিচে হতে হবে।' : 'Image size must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingProduct({
          ...editingProduct,
          image: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // --- PRODUCT CATALOG HANDLERS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const nameEn = (editingProduct.nameEn || '').trim();
    const nameBn = (editingProduct.nameBn || '').trim();

    // At least one name should be provided (either Bangla or English). Bangla is not mandatory!
    if (!nameEn && !nameBn) {
      alert(isBn ? 'দয়া করে পণ্যের অন্তত একটি নাম লিখুন।' : 'Please enter a product name.');
      return;
    }

    const finalNameEn = nameEn || nameBn;
    const finalNameBn = nameBn || nameEn;

    const regular = Number(editingProduct.regularPrice) > 0
      ? Number(editingProduct.regularPrice)
      : Number(editingProduct.price) || 0;

    if (regular <= 0) {
      alert(isBn ? 'দয়া করে পণ্যের সঠিক রেগুলার মূল্য প্রদান করুন।' : 'Please enter a valid regular price.');
      return;
    }

    const discount = editingProduct.discountPrice && Number(editingProduct.discountPrice) > 0
      ? Number(editingProduct.discountPrice)
      : undefined;

    const effectivePrice = discount !== undefined ? discount : regular;
    const originalPrice = discount !== undefined && discount < regular ? regular : (regular > effectivePrice ? regular : undefined);

    const productToSave: Product = {
      ...editingProduct,
      nameEn: finalNameEn,
      nameBn: finalNameBn,
      price: effectivePrice,
      regularPrice: regular,
      discountPrice: discount,
      originalPrice: originalPrice,
    };

    await StorageService.putItem(StorageService.STORES.PRODUCTS, productToSave);
    await loadData();
    onProductsUpdated();
    setIsEditingProductOpen(false);
    setEditingProduct(null);
    flash(isBn ? 'পণ্য সফলভাবে সংরক্ষণ করা হয়েছে।' : 'Product saved successfully.');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this product?')) return;
    await StorageService.removeItem(StorageService.STORES.PRODUCTS, id);
    await loadData();
    onProductsUpdated();
    flash(isBn ? 'পণ্য মুছে ফেলা হয়েছে।' : 'Product deleted.');
  };

  const handleClearSampleProducts = async () => {
    if (!window.confirm(isBn ? 'সব স্যাম্পল/নমুনা পণ্য মুছে ফেলতে চান? আপনার কাস্টম পণ্যগুলো থাকবে।' : 'Remove all sample demonstration products?')) return;
    const remaining = products.filter((p) => !p.isSample);
    await StorageService.setAll(StorageService.STORES.PRODUCTS, remaining);
    await loadData();
    onProductsUpdated();
    flash(isBn ? 'স্যাম্পল পণ্যগুলো মুছে ফেলা হয়েছে।' : 'Sample demonstration products cleared.');
  };

  const handleResetSampleCatalog = async () => {
    if (!window.confirm(isBn ? 'স্যাম্পল ক্যাটালগ পুনরায় লোড করতে চান?' : 'Reset to default sample catalog?')) return;
    await StorageService.setAll(StorageService.STORES.PRODUCTS, INITIAL_PRODUCTS);
    await loadData();
    onProductsUpdated();
    flash(isBn ? 'নমুনা ক্যাটালগ রিস্টোর করা হয়েছে।' : 'Sample catalog restored.');
  };

  // --- BUSINESS SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await businessSettingsService.updateSettings({
      ...settings,
      customLogoUrl: logoPreview,
    });
    setSettings(updated);
    onSettingsUpdated(updated);
    flash(isBn ? 'ব্যবসার সেটিংস সফলভাবে সংরক্ষিত হয়েছে।' : 'Business settings saved.');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isBn ? 'লোগো ফাইলের সাইজ ২MB এর নিচে হতে হবে।' : 'Logo file size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogoToDefault = () => {
    setLogoPreview(null);
  };

  // --- POLICIES HANDLER ---
  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await businessSettingsService.updatePolicies(policies);
    setPolicies(updated);
    flash(isBn ? 'স্টোর পলিসি সফলভাবে সংরক্ষিত হয়েছে।' : 'Store policies saved.');
  };

  // --- DATA BACKUP & RESTORE HANDLERS ---
  const handleExportDataJSON = async () => {
    const allData = {
      backupTimestamp: new Date().toISOString(),
      storeName: 'Ma Babar Dowa Telecom',
      products,
      orders,
      settings,
      policies,
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaBabarDowaTelecom_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash(isBn ? 'ব্যাকআপ JSON ফাইল ডাউনলোড হয়েছে।' : 'Backup JSON file exported.');
  };

  const handleImportDataJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.products) await StorageService.setAll(StorageService.STORES.PRODUCTS, parsed.products);
        if (parsed.orders) await StorageService.setAll(StorageService.STORES.ORDERS, parsed.orders);
        if (parsed.settings) await businessSettingsService.updateSettings(parsed.settings);
        if (parsed.policies) await businessSettingsService.updatePolicies(parsed.policies);
        await loadData();
        onProductsUpdated();
        onSettingsUpdated(businessSettingsService.getSettings());
        flash(isBn ? 'ডেটা ব্যাকআপ থেকে সফলভাবে রিস্টোর করা হয়েছে!' : 'Data restored from backup!');
      } catch (err) {
        alert(isBn ? 'ভুল বা ক্ষতিগ্রস্ত JSON ফাইল।' : 'Invalid or corrupted JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderSourceFilter !== 'All' && o.source !== orderSourceFilter) return false;
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 min-h-[85vh] flex flex-col">
        {/* Admin Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>{isBn ? 'মা বাবার দোয়া টেলিকম — অ্যাডমিন কন্ট্রোল' : 'Owner Admin Management'}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 uppercase">
                  Local Mode (IndexedDB)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isBn ? 'অর্ডার প্রসেসিং, ক্যাটালগ এডিট, ডেলিভারি ও পলিসি কনফিগারেশন' : 'Process orders, edit catalog, delivery rules & settings'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close Admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-sky-600 text-white text-xs font-semibold py-2 px-6 flex items-center justify-between animate-in fade-in duration-150">
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isBn ? `অর্ডারসমূহ (${orders.length})` : `Orders (${orders.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isBn ? `পণ্য ক্যাটালগ (${products.length})` : `Products (${products.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isBn ? 'ব্যবসার তথ্য ও ডেলিভারি' : 'Business & Delivery'}</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'policies'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isBn ? 'স্টোর পলিসি এডিটর' : 'Store Policies'}</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'storage'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isBn ? 'ডেটা ব্যাকআপ ও সীমাবদ্ধতা' : 'Data & Limitations'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Quick KPI stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">মোট অর্ডার</span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{orders.length}</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-amber-600 uppercase">অপেক্ষমান (Pending)</span>
                  <div className="text-2xl font-bold text-amber-700 tabular-nums mt-1">
                    {orders.filter((o) => o.status === 'Pending').length}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase">ডেলিভারড</span>
                  <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                    {orders.filter((o) => o.status === 'Delivered').length}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-sky-600 uppercase">মোট অর্ডার মূল্য</span>
                  <div className="text-2xl font-bold text-sky-800 tabular-nums mt-1">
                    ৳{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-semibold">{isBn ? 'উৎস:' : 'Source:'}</span>
                    <select
                      value={orderSourceFilter}
                      onChange={(e) => setOrderSourceFilter(e.target.value as any)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="All">{isBn ? 'সকল উৎস' : 'All Sources'}</option>
                      <option value="Website">Website</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-semibold">{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="All">{isBn ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Manual Order button */}
                <button
                  onClick={() => setIsAddingManualOrder(!isAddingManualOrder)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ম্যানুয়াল অর্ডার এন্ট্রি (WhatsApp / Phone)' : 'Record Manual Order'}</span>
                </button>
              </div>

              {/* Manual Order Creation Form */}
              {isAddingManualOrder && (
                <div className="p-6 bg-sky-50/60 rounded-2xl border border-sky-200 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-200 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-sky-600" />
                      <span>{isBn ? 'হোয়াটসঅ্যাপ বা ফোনে প্রাপ্ত অর্ডার এন্ট্রি করুন' : 'Record WhatsApp / Phone Order'}</span>
                    </h3>
                    <button
                      onClick={() => setIsAddingManualOrder(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateManualOrder} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">অর্ডারের মাধ্যম *</label>
                      <select
                        value={manualSource}
                        onChange={(e) => setManualSource(e.target.value as OrderSource)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="WhatsApp">WhatsApp চ্যাট থেকে প্রাপ্ত</option>
                        <option value="Phone">সরাসরি ফোন কলে প্রাপ্ত</option>
                        <option value="Website">Website অর্ডার</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">গ্রাহকের নাম *</label>
                      <input
                        type="text"
                        required
                        value={manualCustomerName}
                        onChange={(e) => setManualCustomerName(e.target.value)}
                        placeholder="গ্রাহকের নাম"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">পণ্য নির্বাচন করুন *</label>
                      <select
                        required
                        value={manualProductId}
                        onChange={(e) => setManualProductId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="">-- পণ্য বেছে নিন --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameBn} — ৳{p.price} (স্টক: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">পরিমাণ (Quantity)</label>
                      <input
                        type="number"
                        min="1"
                        value={manualQuantity}
                        onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">ডেলিভারি ঠিকানা</label>
                      <input
                        type="text"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="ঠিকানা ও এলাকা"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">নোট / বিশেষ তথ্য</label>
                      <input
                        type="text"
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                        placeholder="যেমন: কাল বিকেলে লাগবে"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingManualOrder(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-xs"
                      >
                        অর্ডার সেভ করুন
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isBn ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
                          <th className="py-3 px-4">আইডি ও তারিখ</th>
                          <th className="py-3 px-4">উৎস</th>
                          <th className="py-3 px-4">গ্রাহক ও মোবাইল</th>
                          <th className="py-3 px-4">অর্ডারকৃত পণ্য</th>
                          <th className="py-3 px-4">মোট (COD)</th>
                          <th className="py-3 px-4">পেমেন্ট</th>
                          <th className="py-3 px-4">স্ট্যাটাস</th>
                          <th className="py-3 px-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">#{order.id}</span>
                              <span className="text-[10px] text-slate-400 tabular-nums">
                                {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[10px] ${
                                order.source === 'WhatsApp'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : order.source === 'Phone'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-sky-50 text-sky-700 border border-sky-200'
                              }`}>
                                {order.source === 'WhatsApp' && <MessageSquare className="w-3 h-3" />}
                                {order.source === 'Phone' && <PhoneCall className="w-3 h-3" />}
                                {order.source === 'Website' && <Globe className="w-3 h-3" />}
                                <span>{order.source}</span>
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-900 block">{order.customer.name}</span>
                              <a href={`tel:${order.customer.phone}`} className="text-sky-600 hover:underline tabular-nums">
                                {order.customer.phone}
                              </a>
                              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.customer.address}</p>
                            </td>

                            <td className="py-3 px-4">
                              <div className="space-y-0.5 max-w-[200px]">
                                {order.items.map((item, i) => (
                                  <div key={i} className="text-slate-700 truncate">
                                    • {item.nameBn} <span className="text-slate-400">({item.quantity}টি)</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 tabular-nums block">
                                ৳{order.total.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {order.deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : `ফি: ৳${order.deliveryFee}`}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleTogglePaymentStatus(order.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                                  order.isPaid
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-emerald-50'
                                }`}
                                title="পেমেন্ট স্ট্যাটাস টগল করতে ক্লিক করুন"
                              >
                                {order.isPaid ? 'পরিশোধিত (PAID)' : 'বকেয়া (COD)'}
                              </button>
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="px-2 py-1 text-xs rounded-lg border border-slate-300 font-medium bg-white"
                              >
                                <option value="Pending">Pending (অপেক্ষমান)</option>
                                <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                                <option value="Shipped">Shipped (কুরিয়ারে)</option>
                                <option value="Delivered">Delivered (সম্পন্ন)</option>
                                <option value="Cancelled">Cancelled (বাতিল)</option>
                              </select>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="অর্ডার ডিলিট করুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? 'পণ্য ক্যাটালগ ও ইনভেন্টরি' : 'Product Inventory Catalog'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'নতুন পণ্য যোগ করুন অথবা নমুনা পণ্য মুছে আপনার নিজস্ব স্টক সাজান।' : 'Add new accessories or replace demonstration items.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleClearSampleProducts}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
                  >
                    {isBn ? 'স্যাম্পল পণ্য ক্লিয়ার করুন' : 'Clear Sample Products'}
                  </button>

                  <button
                    onClick={handleResetSampleCatalog}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    {isBn ? 'নমুনা ডেটা রিস্টোর' : 'Reset Sample Catalog'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct({
                        id: `MBDT-P${Date.now().toString().slice(-4)}`,
                        nameBn: '',
                        nameEn: '',
                        category: 'accessories',
                        categoryBn: 'অন্যান্য এক্সেসরিজ',
                        price: 500,
                        stock: 10,
                        image: '',
                        descriptionBn: '',
                        descriptionEn: '',
                        specs: [
                          { labelBn: 'টাইপ', labelEn: 'Type', valueBn: 'অরিজিনাল', valueEn: 'Original' }
                        ],
                        isSample: false,
                        featured: false,
                      });
                      setIsEditingProductOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isBn ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
                        <th className="py-3 px-4">ছবি</th>
                        <th className="py-3 px-4">পণ্যের নাম</th>
                        <th className="py-3 px-4">ক্যাটাগরি</th>
                        <th className="py-3 px-4">মূল্য (BDT)</th>
                        <th className="py-3 px-4">স্টক সংখ্যা</th>
                        <th className="py-3 px-4">ধরণ</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                              {p.image ? (
                                <img src={p.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{p.nameBn || p.nameEn}</span>
                            <span className="text-[10px] text-slate-500">{p.nameEn}</span>
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            {p.categoryBn}
                          </td>

                          <td className="py-3 px-4">
                            {p.discountPrice && p.discountPrice < (p.regularPrice || p.originalPrice || p.price) ? (
                              <div className="flex flex-col">
                                <span className="font-bold text-emerald-700 tabular-nums">
                                  ৳{p.discountPrice.toLocaleString()} <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">বিক্রয়</span>
                                </span>
                                <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                  ৳{(p.regularPrice || p.originalPrice || p.price).toLocaleString()} (রেগুলার)
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 tabular-nums">
                                  ৳{(p.regularPrice || p.price).toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400">রেগুলার মূল্য</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`font-semibold tabular-nums ${p.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                              {p.stock} টি
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {p.isSample ? (
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-200">
                                নমুনা (Sample)
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-200">
                                নিজস্ব (Store)
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsEditingProductOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                                title="এডিট করুন"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUSINESS SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'অফিসিয়াল ব্যবসার পরিচয় ও ডেলিভারি কনফিগারেশন' : 'Official Business & Delivery Settings'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn
                    ? 'এখানে সেট করা তথ্য পুরো সাইটের হেডার, ফুটার, কার্ট এবং ইনভয়েসে একযোগে প্রতিফলিত হবে।'
                    : 'Changes here update storefront headers, footers, invoices and cart delivery rules.'}
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Store Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      দোকানের বাংলা নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.storeNameBn}
                      onChange={(e) => setSettings({ ...settings, storeNameBn: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      English Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.storeNameEn}
                      onChange={(e) => setSettings({ ...settings, storeNameEn: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Delivery Fee Settings */}
                <div className="p-5 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-4">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>ডেলিভারি সংক্রান্ত নিয়ম (Delivery Configuration)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        রেগুলার ডেলিভারি ফি (BDT) *
                      </label>
                      <input
                        type="number"
                        required
                        value={settings.defaultDeliveryFee}
                        onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums font-semibold"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        বর্তমান মান: ৳১২০ (সারা বাংলাদেশ)
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        ফ্রি ডেলিভারি প্রাপ্তির সর্বনিম্ন কেনাকাটার সীমা (BDT) *
                      </label>
                      <input
                        type="number"
                        required
                        value={settings.freeDeliveryThreshold}
                        onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums font-semibold"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        বর্তমান মান: ৳২,০০০ (এই মূল্যে ডেলিভারি ফি ৳০ হবে)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirmed Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      হোয়াটসঅ্যাপ নম্বর (WhatsApp) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsAppNumber}
                      onChange={(e) => setSettings({ ...settings, whatsAppNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      মোবাইল নম্বর (Phone Hotline) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      ইমেইল ঠিকানা (Email) *
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      ফেসবুক পেজ লিংক (Facebook URL) *
                    </label>
                    <input
                      type="url"
                      required
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Physical Address */}
                <div className="text-xs">
                  <label className="block font-bold uppercase text-slate-700 mb-1">
                    দোকানের মূল বাস্তব ঠিকানা (Physical Address) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.physicalAddressBn}
                    onChange={(e) => setSettings({ ...settings, physicalAddressBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                {/* Logo Upload Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <span className="font-bold text-slate-800 uppercase block">
                    দোকানের অফিসিয়াল লোগো আপলোড (Custom Logo Upload)
                  </span>
                  <p className="text-slate-500">
                    মালিকের নিজস্ব লোগো ফাইল আপলোড করতে পারবেন। কোনো ফাইল আপলোড না করা থাকলে নিশ্চিত অফিশিয়াল ভেক্টর লোগো প্রদর্শিত হবে।
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>লোগো ফাইল বেছে নিন (PNG/JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleResetLogoToDefault}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        কাস্টম লোগো মুছে ডিফল্ট লোগো ব্যবহার করুন
                      </button>
                    )}
                  </div>

                  {logoPreview && (
                    <div className="mt-2 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 inline-flex">
                      <img src={logoPreview} alt="Logo preview" className="w-12 h-12 object-contain rounded-full" />
                      <span className="text-emerald-700 font-semibold text-xs">✓ কাস্টম লোগো লোড হয়েছে</span>
                    </div>
                  )}
                </div>

                {/* Banner Headlines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      হোমপেজ ব্যানার শিরোনাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={settings.bannerHeadlineBn}
                      onChange={(e) => setSettings({ ...settings, bannerHeadlineBn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Homepage Banner Headline (English)
                    </label>
                    <input
                      type="text"
                      value={settings.bannerHeadlineEn}
                      onChange={(e) => setSettings({ ...settings, bannerHeadlineEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
                  >
                    ব্যবসার তথ্য সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: STORE POLICIES */}
          {activeTab === 'policies' && (
            <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'স্টোর পলিসি কাস্টমাইজেশন' : 'Editable Store Policies'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'প্রয়োজন অনুযায়ী বাংলা ও ইংরেজি পলিসি টেক্সট এডিট করে সেভ করতে পারেন।' : 'Edit bilingual policies for privacy, terms, delivery, and refunds.'}
                </p>
              </div>

              <form onSubmit={handleSavePolicies} className="space-y-6 text-xs">
                {/* Delivery policy */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase">
                    ডেলিভারি পলিসি (বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={policies.deliveryPolicyBn}
                    onChange={(e) => setPolicies({ ...policies, deliveryPolicyBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white leading-relaxed"
                  />
                </div>

                {/* Refund policy */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase">
                    রিটার্ন ও রিপ্লেসমেন্ট পলিসি (বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={policies.refundPolicyBn}
                    onChange={(e) => setPolicies({ ...policies, refundPolicyBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white leading-relaxed"
                  />
                </div>

                {/* Terms and conditions */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase">
                    সাধারণ শর্তাবলী (Terms & Conditions - বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={policies.termsConditionsBn}
                    onChange={(e) => setPolicies({ ...policies, termsConditionsBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white leading-relaxed"
                  />
                </div>

                {/* Privacy policy */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase">
                    গোপনীয়তা নীতি (Privacy Policy - বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={policies.privacyPolicyBn}
                    onChange={(e) => setPolicies({ ...policies, privacyPolicyBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    পলিসি সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: DATA STORAGE & IMPORTANT LIMITATIONS */}
          {activeTab === 'storage' && (
            <div className="max-w-4xl space-y-6">
              {/* Mandatory Limitations Warning Box */}
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>গুরুত্বপূর্ণ প্রযুক্তিগত তথ্য ও ব্রাউজার ডেটার সীমাবদ্ধতা (Important Limitations)</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-amber-950 font-medium">
                  <li>
                    <strong>স্থানীয় স্টোরেজ (IndexedDB):</strong> এই অ্যাপ্লিকেশনের সমস্ত ক্যাটালগ ও গ্রাহকের অর্ডার ব্রাউজারের নিজস্ব মেমোরিতে (IndexedDB) সংরক্ষিত থাকে।
                  </li>
                  <li>
                    <strong>ডিভাইস সীমাবদ্ধতা:</strong> এক ব্রাউজারে বা এক ডিভাইসে তৈরি অর্ডার অন্য ডিভাইসে স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে না, কারণ এখানে কোনো পেইড সেন্ট্রাল ক্লাউড সার্ভার যুক্ত করা হয়নি।
                  </li>
                  <li>
                    <strong>ক্যাশ ক্লিয়ারিং সতর্কতা:</strong> ব্রাউজার ক্যাশ বা হিস্ট্রি সম্পূর্ণ ক্লিয়ার করলে স্থানীয় সংরক্ষিত তথ্য মুছে যেতে পারে।
                  </li>
                  <li>
                    <strong>নিরাপত্তা ও অথেন্টিকেশন:</strong> এই অ্যাডমিন ইন্টারফেসটি প্রদর্শনী ও অফলাইন ব্যবস্থাপনার জন্য। মাল্টি-ইউজার বা পাবলিক প্রোডাকশন ক্লাউড ডেটাবেস হিসেবে এটি ব্যবহার্য নয়।
                  </li>
                </ul>
              </div>

              {/* Backup & Restore Tools */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isBn ? 'ব্যাকআপ ডাউনলোড ও রিস্টোর (JSON Export / Import)' : 'Backup & Restore Data'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'আপনার অর্ডার ও ক্যাটালগ নিরাপদ রাখতে নিয়মিত আপনার কম্পিউটারে JSON ব্যাকআপ ফাইল ডাউনলোড করে রাখতে পারেন।'
                      : 'Download your entire database as a JSON backup file to prevent data loss.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleExportDataJSON}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>{isBn ? 'সম্পূর্ণ ডেটা ব্যাকআপ ডাউনলোড (JSON)' : 'Export Backup (JSON)'}</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-200 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isBn ? 'ব্যাকআপ ফাইল রিস্টোর করুন' : 'Restore from JSON File'}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportDataJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Add / Edit Modal */}
        {isEditingProductOpen && editingProduct && (
          <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {editingProduct.id.includes('P') && products.some((p) => p.id === editingProduct.id)
                    ? 'পণ্য সম্পাদনা (Edit Product)'
                    : 'নতুন পণ্য যোগ করুন (Add Product)'}
                </h3>
                <button
                  onClick={() => setIsEditingProductOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
                {/* 1. Product Name: Bangla (Optional) and English (General) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">পণ্যের নাম (বাংলা)</label>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">ঐচ্ছিক (Optional)</span>
                    </div>
                    <input
                      type="text"
                      value={editingProduct.nameBn || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                      placeholder="যেমন: ফাস্ট চার্জার (না দিলে ইংরেজি নাম ব্যবহৃত হবে)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Product Name (English / সাধারণ নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameEn || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                      placeholder="e.g. 65W GaN Fast Charger"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* 2. Two Price Fields: Regular Price and Discount Price */}
                <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-slate-700 font-bold">
                    <span>মূল্য নির্ধারণ (Pricing)</span>
                    <span className="text-[10px] text-slate-500 font-normal">রেগুলার ও ডিসকাউন্ট মূল্য</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        রেগুলার মূল্য (Regular Price ৳) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editingProduct.regularPrice !== undefined ? editingProduct.regularPrice : editingProduct.price || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            regularPrice: val,
                            price: editingProduct.discountPrice && editingProduct.discountPrice > 0 ? editingProduct.discountPrice : val,
                          });
                        }}
                        placeholder="যেমন: ১৮০০"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums font-semibold"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        পণ্যের সাধারণ মূল দর
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-700">
                          ডিসকাউন্ট মূল্য (Discount Price ৳)
                        </label>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">ঐচ্ছিক ছাড়</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.discountPrice !== undefined ? editingProduct.discountPrice : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            discountPrice: val,
                            price: val && val > 0 ? val : (editingProduct.regularPrice || editingProduct.price),
                          });
                        }}
                        placeholder="যেমন: ১৪৫০ (যদি অফার থাকে)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums font-semibold"
                      />
                      <span className="text-[10px] text-emerald-700 mt-0.5 block font-medium">
                        {editingProduct.discountPrice && editingProduct.regularPrice && editingProduct.discountPrice < editingProduct.regularPrice
                          ? `✓ গ্রাহক ৳${editingProduct.regularPrice - editingProduct.discountPrice} (${Math.round(((editingProduct.regularPrice - editingProduct.discountPrice) / editingProduct.regularPrice) * 100)}%) ছাড় পাবেন`
                          : 'ডিসকাউন্ট দিলে এটি বিক্রয় মূল্য হিসেবে প্রযোজ্য হবে'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Category & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const labelMap: Record<string, string> = {
                          chargers: 'চার্জার ও এডাপ্টার',
                          audio: 'ইয়ারফোন ও অডিও',
                          powerbanks: 'পাওয়ার ব্যাংক',
                          cables: 'ডাটা কেবল',
                          protection: 'সুরক্ষা ও কভার',
                          accessories: 'অন্যান্য এক্সেসরিজ',
                        };
                        setEditingProduct({
                          ...editingProduct,
                          category: val,
                          categoryBn: labelMap[val] || 'অন্যান্য',
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="chargers">চার্জার ও এডাপ্টার</option>
                      <option value="audio">ইয়ারফোন ও অডিও</option>
                      <option value="powerbanks">পাওয়ার ব্যাংক</option>
                      <option value="cables">ডাটা কেবল</option>
                      <option value="protection">সুরক্ষা ও কভার</option>
                      <option value="accessories">অন্যান্য এক্সেসরিজ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">স্টক পরিমাণ (Stock Quantity) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white tabular-nums font-semibold"
                    />
                  </div>
                </div>

                {/* 4. Product Image Link and Device Upload option */}
                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700">
                      পণ্যের ছবি (Image Link ও সরাসরি আপলোড)
                    </label>
                    <span className="text-[10px] text-slate-400">URL বা গ্যালারি ফাইল</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="ছবির লিংক / URL পেস্ট করুন..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer font-bold transition-colors shrink-0 shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>ডিভাইস থেকে ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Thumbnail Live Preview */}
                  {editingProduct.image && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                      <img
                        src={editingProduct.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = '0.3';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-emerald-700 font-bold block truncate">
                          ✓ ছবি যুক্ত করা হয়েছে
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                          className="text-[10px] text-rose-600 hover:underline font-semibold"
                        >
                          ছবি রিমুভ করুন
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block">
                    আপনি লিংক দিতে পারেন অথবা কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড করতে পারেন।
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">পণ্যের বিবরণ (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.descriptionBn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProductOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
