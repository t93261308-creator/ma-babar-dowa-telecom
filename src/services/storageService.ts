/**
 * IndexedDB and Local Storage Service for Ma Babar Dowa Telecom
 * Provides free-only, zero-subscription local persistent storage for products, orders, settings, and policies.
 */

const DB_NAME = 'MaBabarDowaTelecomDB';
const DB_VERSION = 1;

const STORES = {
  SETTINGS: 'business_settings',
  POLICIES: 'store_policies',
  PRODUCTS: 'products_catalog',
  ORDERS: 'customer_orders',
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.POLICIES)) {
        db.createObjectStore(STORES.POLICIES, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.ORDERS)) {
        const orderStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
        orderStore.createIndex('createdAt', 'createdAt', { unique: false });
        orderStore.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback helper using localStorage
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export const StorageService = {
  async getRecord<T>(storeName: string, key: string, defaultValue: T): Promise<T> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.value !== undefined) {
            resolve(req.result.value);
          } else {
            // Check fallback
            resolve(getLocalItem(`${storeName}_${key}`, defaultValue));
          }
        };
        req.onerror = () => resolve(getLocalItem(`${storeName}_${key}`, defaultValue));
      });
    } catch {
      return getLocalItem(`${storeName}_${key}`, defaultValue);
    }
  },

  async setRecord<T>(storeName: string, key: string, value: T): Promise<void> {
    setLocalItem(`${storeName}_${key}`, value);
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.put({ key, value });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // LocalStorage already updated as backup
    }
  },

  async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(getLocalItem<T[]>(`all_${storeName}`, []));
      });
    } catch {
      return getLocalItem<T[]>(`all_${storeName}`, []);
    }
  },

  async putItem<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    try {
      const existing = getLocalItem<T[]>(`all_${storeName}`, []);
      const idx = existing.findIndex((x) => x.id === item.id);
      if (idx >= 0) existing[idx] = item;
      else existing.unshift(item);
      setLocalItem(`all_${storeName}`, existing);

      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // LocalStorage updated
    }
  },

  async removeItem(storeName: string, id: string): Promise<void> {
    try {
      const existing = getLocalItem<{ id: string }[]>(`all_${storeName}`, []);
      setLocalItem(`all_${storeName}`, existing.filter((x) => x.id !== id));

      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // LocalStorage updated
    }
  },

  async setAll<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    setLocalItem(`all_${storeName}`, items);
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();
        for (const item of items) {
          store.put(item);
        }
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      // LocalStorage backup
    }
  },

  STORES,
};
