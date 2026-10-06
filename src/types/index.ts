export type ServiceStatus = 'menunggu' | 'proses' | 'selesai' | 'diambil';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  type: 'jasa' | 'part';
}

export interface ServiceQueue {
  id: string;
  queueNumber: string; // e.g. "BQ-01", "BQ-02"
  plateNumber: string; // e.g. "B 3829 TKR"
  customerName: string;
  customerPhone: string;
  vehicleModel: string; // e.g. "Honda Vario 160"
  vehicleType: 'Motor Matic' | 'Motor Bebek' | 'Motor Sport' | 'Mobil' | 'Lainnya';
  serviceCategory: 'Servis Ringan' | 'Servis Berkala' | 'Turun Mesin' | 'Ganti Oli & Filter' | 'Kelistrikan' | 'Custom';
  mechanicName: string;
  status: ServiceStatus;
  complaint: string;
  timeIn: string;
  estimatedCompletion: string;
  items: ServiceItem[];
  progressPercent: number;
  totalCost: number;
  notes?: string;
}

export interface Sparepart {
  id: string;
  code: string;
  name: string;
  category: 'Oli & Pelumas' | 'Sistem Rem' | 'Transmisi / CVT' | 'Busi & Kelistrikan' | 'Ban & Velg' | 'Filter & Karburator' | 'Bodi & Aksesoris';
  brand: string;
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  unit: string; // e.g. "Botol", "Pcs", "Set"
  rackLocation: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string; // e.g. "INV-20261006-001"
  date: string;
  customerName: string;
  plateNumber: string;
  vehicleModel: string;
  mechanicName: string;
  items: ServiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit';
  cashPaid?: number;
  change?: number;
  status: 'Lunas' | 'Belum Lunas';
}

export interface Mechanic {
  id: string;
  name: string;
  role: string;
  phone: string;
  activeTasks: number;
  completedToday: number;
  rating: number;
  avatarBg: string;
}

export interface CustomerVehicle {
  id: string;
  name: string;
  phone: string;
  plateNumber: string;
  vehicleModel: string;
  year: string;
  lastServiceDate: string;
  totalVisits: number;
  loyaltyPoints: number;
  notes: string;
}

export interface SubMenuItemConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
  targetView: string;
}

export interface MenuModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badgeCount?: string | number;
  badgeColor?: string;
  description: string;
  subMenus: SubMenuItemConfig[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'service' | 'stock' | 'payment' | 'system';
}

export interface WorkshopProfile {
  workshopName: string;
  address: string;
  ownerName: string;
  phone: string;
  email: string;
}

export interface RolePermissionConfig {
  id: string;
  category: string;
  permissionName: string;
  spv: boolean;
  kasir: boolean;
  description: string;
}

export interface BranchItem {
  id: string;
  branchName: string;
  address: string;
  spvName: string;
  phone: string;
  email: string;
  isActive?: boolean;
}

export interface UserSession {
  name: string;
  email: string;
  avatar?: string;
  role: 'Supervisor' | 'Owner' | 'Kasir';
  autoLogin: boolean;
  loginTime: string;
}
