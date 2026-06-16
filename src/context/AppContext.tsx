import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';

import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  StoreSettings,
  Coupon,
  ContactMessage,
  Testimonial
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_TESTIMONIALS
} from '../data/seedData';

export interface AppContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  products: Product[];
  orders: Order[];
  testimonials: Testimonial[];
  coupons: Coupon[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  contacts: ContactMessage[]; // Admin view
  dbMode: 'local' | 'firebase';
  setDbMode: (mode: 'local' | 'firebase') => void;
  
  // Auth Functions
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileAddress: (address: string) => Promise<void>;
  saveAddress: (address: string) => Promise<void>;
  updateProfileDetails: (fullName: string, phone: string) => Promise<void>;
  
  // Shopping Functions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => Coupon | null;
  submitOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  submitReview: (productId: string, rating: number, content: string) => Promise<void>;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'reviews' | 'rating'>) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, deliveryDetails?: string) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, status: 'paid' | 'pending_confirmation' | 'unpaid') => Promise<void>;
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
  seedDatabase: () => Promise<void>;
  addTestimonial: (t: Omit<Testimonial, 'id' | 'createdAt'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addCoupon: (c: Coupon) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateContactStatus: (id: string, status: 'Unread' | 'Read' | 'Resolved') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DB Mode preference (default to local sandbox as explicitly requested)
  const [dbMode, setDbModeState] = useState<'local' | 'firebase'>(() => {
    const saved = localStorage.getItem('blessed_db_mode');
    return saved === 'firebase' ? 'firebase' : 'local';
  });

  const setDbMode = (mode: 'local' | 'firebase') => {
    localStorage.setItem('blessed_db_mode', mode);
    setDbModeState(mode);
  };

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- LOCAL SANBOX DATA INITS ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('blessed_local_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('blessed_local_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('blessed_local_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('blessed_local_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('blessed_local_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [contacts, setContacts] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('blessed_local_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  // Local Storage Cart & Wishlist persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('blessed_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('blessed_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep LocalStorage synched
  useEffect(() => {
    localStorage.setItem('blessed_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('blessed_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth Listener
  useEffect(() => {
    if (dbMode === 'local') {
      const savedUser = localStorage.getItem('blessed_local_user');
      const savedProfile = localStorage.getItem('blessed_local_profile');
      if (savedUser && savedProfile) {
        setUser(JSON.parse(savedUser));
        setUserProfile(JSON.parse(savedProfile));
      } else {
        // Pre-authenticate mock local administrator to satisfy immediate product modifications!
        const mockAdminUser = {
          uid: 'mock-admin-uid-123',
          email: 'ogechukwublessing009@gmail.com',
          displayName: 'Blessed Admin (Local)',
          emailVerified: true
        } as any;
        const mockAdminProfile: UserProfile = {
          id: 'mock-admin-uid-123',
          fullName: 'Blessed Admin (Local)',
          email: 'ogechukwublessing009@gmail.com',
          phone: '+234 801 234 5678',
          savedAddresses: ['1 Main Street, Lagos, Nigeria'],
          isAdmin: true,
          createdAt: new Date().toISOString()
        };
        setUser(mockAdminUser);
        setUserProfile(mockAdminProfile);
        localStorage.setItem('blessed_local_user', JSON.stringify(mockAdminUser));
        localStorage.setItem('blessed_local_profile', JSON.stringify(mockAdminProfile));
      }
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isDefaultAdmin = currentUser.email?.toLowerCase() === 'ogechukwublessing009@gmail.com';
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserProfile({
              id: currentUser.uid,
              fullName: data.fullName || currentUser.displayName || 'No Name',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              savedAddresses: data.savedAddresses || [],
              isAdmin: data.isAdmin || isDefaultAdmin,
              createdAt: data.createdAt
            });
          } else {
            const newProfile: UserProfile = {
              id: currentUser.uid,
              fullName: currentUser.displayName || 'Blessed Customer',
              email: currentUser.email || '',
              phone: '',
              savedAddresses: [],
              isAdmin: isDefaultAdmin,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, {
              fullName: newProfile.fullName,
              email: newProfile.email,
              phone: newProfile.phone,
              savedAddresses: newProfile.savedAddresses,
              isAdmin: newProfile.isAdmin,
              createdAt: newProfile.createdAt
            });
            setUserProfile(newProfile);
          }
        } catch (err) {
          setUserProfile({
            id: currentUser.uid,
            fullName: currentUser.displayName || 'Blessed Customer',
            email: currentUser.email || '',
            isAdmin: isDefaultAdmin,
            savedAddresses: []
          });
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, [dbMode]);

  // Sync Products in real-time
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    const pRef = collection(db, 'products');
    const unsubscribe = onSnapshot(pRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as Product);
          });
          setProducts(items);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      }, 
      (err) => {
        console.warn("Product Read permission: reading offline products.");
        setProducts(INITIAL_PRODUCTS);
      }
    );
    return unsubscribe;
  }, [dbMode]);

  // Sync Settings in real-time
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    const sRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(sRef, 
      (d) => {
        if (d.exists()) {
          setSettings(d.data() as StoreSettings);
        } else {
          setSettings(INITIAL_SETTINGS);
        }
      },
      (err) => {
        setSettings(INITIAL_SETTINGS);
      }
    );
    return unsubscribe;
  }, [dbMode]);

  // Sync testimonials
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    const tRef = collection(db, 'testimonials');
    const unsubscribe = onSnapshot(tRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Testimonial[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Testimonial);
          });
          setTestimonials(list);
        } else {
          setTestimonials(INITIAL_TESTIMONIALS);
        }
      },
      (err) => {
        setTestimonials(INITIAL_TESTIMONIALS);
      }
    );
    return unsubscribe;
  }, [dbMode]);

  // Sync coupons
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    const cRef = collection(db, 'coupons');
    const unsubscribe = onSnapshot(cRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((doc) => {
            list.push({ ...doc.data() } as Coupon);
          });
          setCoupons(list);
        } else {
          setCoupons(INITIAL_COUPONS);
        }
      },
      (err) => {
        setCoupons(INITIAL_COUPONS);
      }
    );
    return unsubscribe;
  }, [dbMode]);

  // Sync Orders
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    if (!user) {
      setOrders([]);
      return;
    }

    const oRef = collection(db, 'orders');
    const isAdminUser = user.email?.toLowerCase() === 'ogechukwublessing009@gmail.com' || userProfile?.isAdmin;
    
    const q = isAdminUser 
      ? query(oRef)
      : query(oRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Order);
        });
        setOrders(list);
      },
      (error) => {
        console.log("Order snapshot connection offline or restricted.");
      }
    );

    return unsubscribe;
  }, [user, userProfile, dbMode]);

  // Sync Contacts for admin panel
  useEffect(() => {
    if (dbMode !== 'firebase') return;
    if (!userProfile?.isAdmin && user?.email?.toLowerCase() !== 'ogechukwublessing009@gmail.com') {
      setContacts([]);
      return;
    }

    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list: ContactMessage[] = [];
        snapshot.forEach((dt) => {
          list.push({ id: dt.id, ...dt.data() } as ContactMessage);
        });
        setContacts(list);
      },
      (error) => {
        console.warn("Contact snapshot offline or restricted.");
      }
    );
    return unsubscribe;
  }, [user, userProfile, dbMode]);

  // AUTH ACTIONS
  const loginWithEmail = async (email: string, pass: string) => {
    if (dbMode === 'local') {
      const isDefaultAdmin = email.toLowerCase() === 'ogechukwublessing009@gmail.com' || pass === 'admin123';
      const mockUser = {
        uid: isDefaultAdmin ? 'mock-admin-uid-123' : `mock-user-${Date.now()}`,
        email: email,
        displayName: isDefaultAdmin ? 'Blessed Admin' : 'Blessed Customer',
        emailVerified: true
      } as any;
      const mockProfile: UserProfile = {
        id: mockUser.uid,
        fullName: isDefaultAdmin ? 'Blessed Admin' : 'Blessed Customer',
        email: email,
        phone: '+234 801 234 5678',
        savedAddresses: ['1 Main Street, Lagos, Nigeria'],
        isAdmin: isDefaultAdmin,
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem('blessed_local_user', JSON.stringify(mockUser));
      localStorage.setItem('blessed_local_profile', JSON.stringify(mockProfile));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      throw new Error(err.message || 'Invalid login details.');
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    if (dbMode === 'local') {
      const isDefaultAdmin = email.toLowerCase() === 'ogechukwublessing009@gmail.com';
      const mockUser = {
        uid: `mock-user-${Date.now()}`,
        email: email,
        displayName: name,
        emailVerified: true
      } as any;
      const mockProfile: UserProfile = {
        id: mockUser.uid,
        fullName: name,
        email: email,
        phone: phone || '',
        savedAddresses: [],
        isAdmin: isDefaultAdmin,
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem('blessed_local_user', JSON.stringify(mockUser));
      localStorage.setItem('blessed_local_profile', JSON.stringify(mockProfile));
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const isDefaultAdmin = email.toLowerCase() === 'ogechukwublessing009@gmail.com';
      const uDoc = doc(db, 'users', cred.user.uid);
      await setDoc(uDoc, {
        fullName: name,
        email,
        phone: phone || '',
        savedAddresses: [],
        isAdmin: isDefaultAdmin,
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to register account.');
    }
  };

  const resetPassword = async (email: string) => {
    if (dbMode === 'local') {
      alert(`[Offline Simulation] A password reset security request was dispatched to ${email}.`);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to send password reset email.');
    }
  };

  const loginWithGoogle = async () => {
    if (dbMode === 'local') {
      const mockUser = {
        uid: 'mock-admin-uid-123',
        email: 'ogechukwublessing009@gmail.com',
        displayName: 'Blessed Admin (Google)',
        emailVerified: true
      } as any;
      const mockProfile: UserProfile = {
        id: 'mock-admin-uid-123',
        fullName: 'Blessed Admin (Google)',
        email: 'ogechukwublessing009@gmail.com',
        phone: '+234 801 234 5678',
        savedAddresses: ['1 Main Street, Lagos, Nigeria'],
        isAdmin: true,
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserProfile(mockProfile);
      localStorage.setItem('blessed_local_user', JSON.stringify(mockUser));
      localStorage.setItem('blessed_local_profile', JSON.stringify(mockProfile));
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(err.message || 'Google Authentication cancelled.');
    }
  };

  const logout = async () => {
    if (dbMode === 'local') {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('blessed_local_user');
      localStorage.removeItem('blessed_local_profile');
      return;
    }
    await signOut(auth);
  };

  const updateProfileAddress = async (address: string) => {
    if (dbMode === 'local') {
      if (!userProfile) return;
      const currentAddresses = userProfile.savedAddresses || [];
      if (!currentAddresses.includes(address)) {
        const updated = [...currentAddresses, address];
        const updatedProfile = { ...userProfile, savedAddresses: updated };
        setUserProfile(updatedProfile);
        localStorage.setItem('blessed_local_profile', JSON.stringify(updatedProfile));
      }
      return;
    }

    if (!user) return;
    try {
      const uDoc = doc(db, 'users', user.uid);
      const currentAddresses = userProfile?.savedAddresses || [];
      if (!currentAddresses.includes(address)) {
        const updated = [...currentAddresses, address];
        await updateDoc(uDoc, { savedAddresses: updated });
        setUserProfile(prev => prev ? { ...prev, savedAddresses: updated } : null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const saveAddress = async (address: string) => {
    await updateProfileAddress(address);
  };

  const updateProfileDetails = async (fullName: string, phone: string) => {
    if (dbMode === 'local') {
      if (!userProfile) return;
      const updatedProfile = { ...userProfile, fullName, phone };
      setUserProfile(updatedProfile);
      localStorage.setItem('blessed_local_profile', JSON.stringify(updatedProfile));
      return;
    }

    if (!user) return;
    try {
      const uDoc = doc(db, 'users', user.uid);
      await updateDoc(uDoc, { fullName, phone });
      setUserProfile(prev => prev ? { ...prev, fullName, phone } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // STOREFRONT CART LOGIC
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockQuantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stockQuantity)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const applyCoupon = (code: string): Coupon | null => {
    const c = coupons.find(coupon => coupon.code.toUpperCase() === code.trim().toUpperCase() && coupon.active);
    return c || null;
  };

  // SUBMIT ORDER
  const submitOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const generatedId = `order-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...orderData,
      id: generatedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (dbMode === 'local') {
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('blessed_local_orders', JSON.stringify(updatedOrders));

      // Subtract stock quantities locally
      const updatedProducts = products.map(p => {
        const matched = orderData.items.find(item => item.productId === p.id);
        if (matched) {
          return {
            ...p,
            stockQuantity: Math.max(0, p.stockQuantity - matched.quantity)
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem('blessed_local_products', JSON.stringify(updatedProducts));

      return generatedId;
    }

    try {
      await setDoc(doc(db, 'orders', generatedId), newOrder);
      
      for (const item of orderData.items) {
        const pr = products.find(p => p.id === item.productId);
        if (pr) {
          const updatedStock = Math.max(0, pr.stockQuantity - item.quantity);
          const pDocRef = doc(db, 'products', item.productId);
          await updateDoc(pDocRef, { stockQuantity: updatedStock }).catch(err => {
            console.warn("Failed updating product stock online:", err);
          });
        }
      }
      
      return generatedId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${generatedId}`);
      return generatedId;
    }
  };

  const submitReview = async (productId: string, rating: number, content: string) => {
    const pr = products.find(p => p.id === productId);
    if (!pr) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      reviewerName: userProfile?.fullName || 'Anonymous Customer',
      reviewerEmail: user?.email || 'guest@example.com',
      rating,
      content,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [...(pr.reviews || []), newReview];
    const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const newAverage = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    if (dbMode === 'local') {
      const updatedProducts = products.map(p => p.id === productId ? { ...p, reviews: updatedReviews, rating: newAverage } : p);
      setProducts(updatedProducts);
      localStorage.setItem('blessed_local_products', JSON.stringify(updatedProducts));
      return;
    }

    try {
      await updateDoc(doc(db, 'products', productId), {
        reviews: updatedReviews,
        rating: newAverage
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  // ADMIN OPERATIONS
  const addProduct = async (productData: Omit<Product, 'id' | 'reviews' | 'rating'>) => {
    const id = `prod-${productData.subcategory.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const completeProduct: Product = {
      ...productData,
      id,
      rating: 4.5,
      reviews: []
    };

    if (dbMode === 'local') {
      const updated = [completeProduct, ...products];
      setProducts(updated);
      localStorage.setItem('blessed_local_products', JSON.stringify(updated));
      return;
    }

    try {
      await setDoc(doc(db, 'products', id), completeProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}`);
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    if (dbMode === 'local') {
      const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      setProducts(updated);
      localStorage.setItem('blessed_local_products', JSON.stringify(updated));
      return;
    }

    try {
      await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${updatedProduct.id}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (dbMode === 'local') {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      localStorage.setItem('blessed_local_products', JSON.stringify(updated));
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (dbMode === 'local') {
      const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o);
      setOrders(updated);
      localStorage.setItem('blessed_local_orders', JSON.stringify(updated));
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, status: 'paid' | 'pending_confirmation' | 'unpaid') => {
    if (dbMode === 'local') {
      const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o);
      setOrders(updated);
      localStorage.setItem('blessed_local_orders', JSON.stringify(updated));
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    if (dbMode === 'local') {
      setSettings(newSettings);
      localStorage.setItem('blessed_local_settings', JSON.stringify(newSettings));
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
      setSettings(newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const id = `tst-${Date.now()}`;
    const item: Testimonial = {
      ...t,
      id,
      createdAt: new Date().toISOString()
    };

    if (dbMode === 'local') {
      const updated = [item, ...testimonials];
      setTestimonials(updated);
      localStorage.setItem('blessed_local_testimonials', JSON.stringify(updated));
      return;
    }

    try {
      await setDoc(doc(db, 'testimonials', id), item);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `testimonials/${id}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (dbMode === 'local') {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      localStorage.setItem('blessed_local_testimonials', JSON.stringify(updated));
      return;
    }

    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  const addCoupon = async (c: Coupon) => {
    if (dbMode === 'local') {
      const updated = [c, ...coupons.filter(co => co.code.toUpperCase() !== c.code.toUpperCase())];
      setCoupons(updated);
      localStorage.setItem('blessed_local_coupons', JSON.stringify(updated));
      return;
    }

    try {
      await setDoc(doc(db, 'coupons', c.code.toUpperCase()), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `coupons/${c.code}`);
    }
  };

  const deleteCoupon = async (code: string) => {
    if (dbMode === 'local') {
      const updated = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
      setCoupons(updated);
      localStorage.setItem('blessed_local_coupons', JSON.stringify(updated));
      return;
    }

    try {
      await deleteDoc(doc(db, 'coupons', code.toUpperCase()));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${code}`);
    }
  };

  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const id = `contact-${Date.now()}`;
    const record: ContactMessage = {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
      status: 'Unread'
    };

    if (dbMode === 'local') {
      const updated = [record, ...contacts];
      setContacts(updated);
      localStorage.setItem('blessed_local_contacts', JSON.stringify(updated));
      return;
    }

    try {
      await setDoc(doc(db, 'contacts', id), record);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `contacts/${id}`);
    }
  };

  const updateContactStatus = async (id: string, status: 'Unread' | 'Read' | 'Resolved') => {
    if (dbMode === 'local') {
      const updated = contacts.map(c => c.id === id ? { ...c, status } : c);
      setContacts(updated);
      localStorage.setItem('blessed_local_contacts', JSON.stringify(updated));
      return;
    }

    try {
      await updateDoc(doc(db, 'contacts', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contacts/${id}`);
    }
  };

  const seedDatabase = async () => {
    if (dbMode === 'local') {
      localStorage.setItem('blessed_local_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('blessed_local_orders', JSON.stringify([]));
      localStorage.setItem('blessed_local_settings', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('blessed_local_coupons', JSON.stringify(INITIAL_COUPONS));
      localStorage.setItem('blessed_local_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
      localStorage.setItem('blessed_local_contacts', JSON.stringify([]));

      setProducts(INITIAL_PRODUCTS);
      setOrders([]);
      setSettings(INITIAL_SETTINGS);
      setCoupons(INITIAL_COUPONS);
      setTestimonials(INITIAL_TESTIMONIALS);
      setContacts([]);
      alert("Local sandbox database has been fully recompiled and re-seeded back to standard settings!");
      return;
    }

    try {
      console.log("Seeding Database collections...");
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      await setDoc(doc(db, 'settings', 'global'), INITIAL_SETTINGS);
      for (const t of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }
      for (const c of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', c.code.toUpperCase()), c);
      }
      console.log("Database seeded successfully!");
      alert("Cloud database seeded successfully!");
    } catch (error) {
      console.error("Database seeding encountered error:", error);
      alert("Cloud Database seeding failed. Check console error for more parameters.");
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      userProfile,
      authLoading,
      products,
      orders,
      testimonials,
      coupons,
      settings,
      cart,
      wishlist,
      contacts,
      dbMode,
      setDbMode,
      loginWithEmail,
      registerWithEmail,
      resetPassword,
      loginWithGoogle,
      logout,
      updateProfileAddress,
      saveAddress,
      updateProfileDetails,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      applyCoupon,
      submitOrder,
      submitReview,
      addProduct,
      editProduct,
      deleteProduct,
      updateOrderStatus,
      updateOrderPaymentStatus,
      updateSettings,
      seedDatabase,
      addTestimonial,
      deleteTestimonial,
      addCoupon,
      deleteCoupon,
      submitContactMessage,
      updateContactStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
