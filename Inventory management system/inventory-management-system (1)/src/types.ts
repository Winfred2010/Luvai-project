export enum UserRole {
  ADMIN = 'admin',
  STORE_MANAGER = 'store_manager',
  STAFF = 'staff'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  price: number;
  quantity: number;
  supplierId: string;
  description: string;
  image: string;
  expiryDate?: string; // ISO String or YYYY-MM-DD
  minLevel: number; // For low stock alerts
  branch: string; // Dynamic support for multi-branch
  
  // Custom Electronics-specific properties
  brand?: string;
  modelName?: string;
  imei?: string;
  serialNumber?: string;
  warranty?: string; // e.g. "12 Months" or "2 Years"
  storage?: string; // e.g. "128GB" or "512GB SSD"
  ram?: string; // e.g. "8GB" or "16GB"
  color?: string; // e.g. "Midnight Black"
  processor?: string; // e.g. "Intel Core i5"
  storageType?: string; // e.g. "SSD" or "HDD"
  screenSize?: string; // e.g. "14-inch"
  os?: string; // e.g. "Windows 11 Pro"
  batteryHealth?: string; // e.g. "100%" or "88%"
  condition?: string; // e.g. "New" or "Used"
  connectivity?: string; // e.g. "Wireless" or "Wired"
  batteryLife?: string; // e.g. "20 Hours"
  capacity?: string; // e.g. "1TB"
  transferSpeed?: string; // e.g. "150 MB/s"
  interfaceType?: string; // e.g. "USB 3.0"
  purchasePrice?: number; // Purchase cost
}

export type TransactionType = 'in' | 'out';
export type TransactionReason = 'purchase' | 'sale' | 'damaged' | 'expired' | 'adjustment';

export interface Transaction {
  id: string;
  productId: string;
  quantity: number;
  type: TransactionType;
  reason: TransactionReason;
  supplierId?: string; // relevant for purchases (Stock In)
  date: string; // ISO datetime
  userId: string; // Initiated by
  userName: string; // for easier UI display
  branch: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'mobile_money' | 'bank_transfer';
  date: string;
  userId: string;
  userName: string;
  branch: string;
  receiptNumber: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g., "Added product 'Aspirin'" "Removed 20 bags of Cement"
  date: string;
  branch: string;
}
