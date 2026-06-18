import { Category, Supplier, Product, Transaction, Sale, AuditLog, User, UserRole } from '../types';
import { PRODUCTS_PART_1 } from './productsPart1';
import { PRODUCTS_PART_2 } from './productsPart2';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Winfred',
    email: 'example@gmail.com',
    role: UserRole.ADMIN,
    branch: 'Nairobi HQ'
  },
  {
    id: 'usr_mgr_1',
    name: 'Jane Gitau',
    email: 'jane.gitau@example.com',
    role: UserRole.STORE_MANAGER,
    branch: 'Nakuru Branch'
  },
  {
    id: 'usr_staff_1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    role: UserRole.STAFF,
    branch: 'Nairobi HQ'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_mobile', name: 'Mobile Phones', description: 'Android Phones, iPhones, Feature Phones, Foldable Phones, Gaming Phones' },
  { id: 'cat_laptops', name: 'Laptops', description: 'Business Laptops, Gaming Laptops, Student Laptops, Ultrabooks, Workstations, 2-in-1 Laptops' },
  { id: 'cat_iphones', name: 'iPhones', description: 'iPhone 11 through 16 Series with battery health and IMEI tracking' },
  { id: 'cat_headphones', name: 'Headphones & Earbuds', description: 'Wired Earphones, Wireless Earbuds, Bluetooth Headphones, Noise Cancelling' },
  { id: 'cat_usb_storage', name: 'USB & Storage Devices', description: 'Flash Drives, External Hard Drives, SSD Drives, Memory Cards' },
  { id: 'cat_accessories', name: 'Computer Accessories', description: 'Keyboards, Mouse, Webcams, Speakers, Microphones, Cooling Pads' },
  { id: 'cat_networking', name: 'Networking Equipment', description: 'Routers, Switches, Access Points, Modems, Cable feeds' },
  { id: 'cat_printers_scanners', name: 'Printers & Scanners', description: 'Inkjet Printers, Laser Printers, Thermal Printers, Flatbed Scanners' },
  { id: 'cat_power_charging', name: 'Power & Charging Devices', description: 'Chargers, Power Banks, Extension Cables, UPS Systems, Laptop Chargers' },
  { id: 'cat_smart_devices', name: 'Smart Devices', description: 'Smart Watches, Smart TVs, Smart Home Devices, Security Cameras' },
  { id: 'cat_computing', name: 'Computing', description: 'Desktop PCs, High-Resolution Monitors, All-In-Ones, Motherboards and CPU parts' },
  { id: 'cat_home_office', name: 'Home & Office', description: 'Ergonomic Desk Chairs, Height-Adjustable Smart Desks, Lighting, and Shredders' },
  { id: 'cat_baby', name: 'Baby Products', description: 'Nanit Smart Monitors, Bottle Heaters, Safety Gates, Organic feeds & baby items' },
  { id: 'cat_supermarket', name: 'Supermarket', description: 'Premium Coffee Beans, Organic Nut Packs, Beverage feeds, and Cleaners' },
  { id: 'cat_health_beauty', name: 'Health & Beauty', description: 'Dyson Blow Dryers, Rechargeable Groomers, Grooming shavers, and styling tools' },
  { id: 'cat_gaming', name: 'Gaming', description: 'PlayStation 5 consoles, Xbox Wireless controllers, Nintendo consoles and VR headsets' },
  { id: 'cat_fashion', name: 'Fashion & Apparel', description: 'Smart sport jackets, Air Max sneakers, polarized specs and active gear' },
  { id: 'cat_appliances', name: 'Home & Kitchen Appliances', description: 'Air Fryers, smart coffee makers, microwave heaters, and small refrigeration systems' },
  { id: 'cat_tvs_audio', name: 'TVs & Audio', description: 'Samsung Smart QLED screens, Dolby Atmos soundbars, surround units and projectors' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Safaricom Wholesalers Ltd',
    email: 'wholesale@safaricom.co.ke',
    phone: '+254 722 000111',
    location: 'Safaricom House, Nairobi'
  },
  {
    id: 'sup_2',
    name: 'Apple Eastern Africa',
    email: 'distribution@apple-ea.com',
    phone: '+254 733 444555',
    location: 'Westlands, Nairobi'
  },
  {
    id: 'sup_3',
    name: 'Lenovo Eastern Africa (Redington)',
    email: 'lenovo.orders@redington.co.ke',
    phone: '+254 722 888999',
    location: 'Sameer Business Park, Nairobi'
  },
  {
    id: 'sup_4',
    name: 'Syntex Electronics & Wholesalers',
    email: 'orders@syntex.com',
    phone: '+254 701 555666',
    location: 'Luthuli Avenue, Nairobi'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  ...PRODUCTS_PART_1,
  ...PRODUCTS_PART_2
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    productId: 'prod_lenovo_l14',
    quantity: 15,
    type: 'in',
    reason: 'purchase',
    supplierId: 'sup_3',
    date: '2026-06-10T10:30:00Z',
    userId: 'usr_admin_1',
    userName: 'Winfred Luvai',
    branch: 'Nairobi HQ',
    notes: 'Initial stock shipment order'
  },
  {
    id: 'tx_2',
    productId: 'prod_lenovo_l14',
    quantity: 3,
    type: 'out',
    reason: 'sale',
    date: '2026-06-12T14:45:00Z',
    userId: 'usr_staff_1',
    userName: 'John Kamau',
    branch: 'Nairobi HQ',
    notes: 'Bulk corporate purchase'
  },
  {
    id: 'tx_3',
    productId: 'prod_iphone_15_pro',
    quantity: 10,
    type: 'in',
    reason: 'purchase',
    supplierId: 'sup_2',
    date: '2026-06-11T09:15:00Z',
    userId: 'usr_admin_1',
    userName: 'Winfred Luvai',
    branch: 'Nairobi HQ',
    notes: 'Direct from Apple Distribution'
  },
  {
    id: 'tx_4',
    productId: 'prod_iphone_15_pro',
    quantity: 2,
    type: 'out',
    reason: 'sale',
    date: '2026-06-15T11:20:00Z',
    userId: 'usr_staff_1',
    userName: 'John Kamau',
    branch: 'Nairobi HQ'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale_1',
    customerName: 'Kiambu Contractors Ltd',
    items: [
      {
        productId: 'prod_lenovo_l14',
        productName: 'Lenovo ThinkPad L14 Gen 3',
        quantity: 3,
        price: 85000
      }
    ],
    totalAmount: 255000,
    paymentMethod: 'bank_transfer',
    date: '2026-06-12T14:45:00Z',
    userId: 'usr_staff_1',
    userName: 'John Kamau',
    branch: 'Nairobi HQ',
    receiptNumber: 'REC-2026-0001'
  },
  {
    id: 'sale_2',
    customerName: 'Self Retail Walk-in',
    items: [
      {
        productId: 'prod_iphone_15_pro',
        productName: 'Apple iPhone 15 Pro Max (256GB)',
        quantity: 2,
        price: 175000
      }
    ],
    totalAmount: 350000,
    paymentMethod: 'mobile_money',
    date: '2026-06-15T11:20:00Z',
    userId: 'usr_staff_1',
    userName: 'John Kamau',
    branch: 'Nairobi HQ',
    receiptNumber: 'REC-2026-0002'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    userId: 'usr_admin_1',
    userName: 'Winfred Luvai',
    userRole: UserRole.ADMIN,
    action: 'Initialized standard database with 10 Electronics categories.',
    date: '2026-06-10T09:00:00Z',
    branch: 'Nairobi HQ'
  },
  {
    id: 'audit_2',
    userId: 'usr_admin_1',
    userName: 'Winfred Luvai',
    userRole: UserRole.ADMIN,
    action: 'Registered Safaricom, Apple EA, Redington and Syntex as electronics suppliers.',
    date: '2026-06-10T09:45:00Z',
    branch: 'Nairobi HQ'
  }
];
