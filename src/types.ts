export interface Review {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  content: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  stockQuantity: number;
  rating: number;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  reviews: Review[];
  brand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string; // 'guest' or uid
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string; // 'Paystack' | 'Flutterwave' | 'Bank Transfer'
  paymentStatus: string; // 'pending' | 'paid' | 'failed'
  orderStatus: string; // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponUsed?: string;
  createdAt: any; // Timestamp or string
  updatedAt: any;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  savedAddresses?: string[];
  isAdmin?: boolean;
  createdAt?: any;
}

export interface StoreSettings {
  whatsappNumber: string;
  whatsappLink: string;
  emailAddress: string;
  businessAddress: string;
  businessHours: string;
  promoTitle: string;
  promoSubtitle: string;
  bannerImages: string[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Resolved';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: string;
}
