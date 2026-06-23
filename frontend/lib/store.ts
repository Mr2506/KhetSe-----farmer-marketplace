import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ═══════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════ */

export type Role = "BUYER" | "FARMER" | "ADMIN";
export type BuyerType = "Household" | "Restaurant" | "Shop";
export type OrderStatus = "Placed" | "Accepted" | "Packed" | "Out for delivery" | "Delivered" | "Cancelled";
export type ListingStatus = "Live" | "Low stock" | "Sold out" | "Paused";
export type FarmerVerification = "Verified" | "Pending" | "Rejected";
export type FulfillmentType = "Pickup" | "Delivery" | "Both";

export interface User {
  id: string;
  phone: string;
  name: string;
  roles: Role[];
  buyerType?: BuyerType;
  /** farmer-specific */
  farmSize?: string;
  village?: string;
  cropsGrown?: string[];
  verification?: FarmerVerification;
  aadhaarUploaded?: boolean;
  registeredAt: string;
  addresses?: string[];
  notifications?: { newOrders: boolean; lowStock: boolean; sms: boolean };
}

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  category: string;
  description: string;
  price: number;
  mandiPrice: number;
  unit: string;
  quantity: number;
  harvestDate: string;
  isOrganic: boolean;
  fulfillment: FulfillmentType;
  photos: string[];
  status: ListingStatus;
  rating: number;
  distance: number;
}

export interface CartItem {
  listingId: string;
  quantity: number;
}

export interface OrderItem {
  listingId: string;
  cropName: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  fulfillment: "Pickup" | "Delivery";
  address?: string;
  timeSlot?: string;
  placedAt: string;
  review?: { rating: number; comment: string };
}

export interface Session {
  isLoggedIn: boolean;
  userId: string;
  phone: string;
  name: string;
  roles: Role[];
  activeRole: Role | null;
}

/* ═══════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════ */

export const SEED_USERS: User[] = [
  {
    id: "u1", phone: "9825012345", name: "Ramesh Patel", roles: ["FARMER", "BUYER"],
    buyerType: "Household", farmSize: "5 acres", village: "Olpad", cropsGrown: ["Tomatoes", "Cabbage", "Carrots"],
    verification: "Verified", aadhaarUploaded: true, registeredAt: "2024-03-15",
    addresses: ["Block C-402, Green Avenue, Vesu, Surat - 395007"],
    notifications: { newOrders: true, lowStock: true, sms: false }
  },
  {
    id: "u2", phone: "9712054321", name: "Kavita Ben", roles: ["FARMER"],
    farmSize: "3 acres", village: "Sachin", cropsGrown: ["Okra", "Leafy greens"],
    verification: "Verified", aadhaarUploaded: true, registeredAt: "2024-06-20",
    notifications: { newOrders: true, lowStock: true, sms: true }
  },
  {
    id: "u3", phone: "9099087654", name: "Priya Shah", roles: ["BUYER"],
    buyerType: "Household", registeredAt: "2025-01-10",
    addresses: ["Adajan, Surat - 395009"],
    notifications: { newOrders: true, lowStock: false, sms: false }
  },
  {
    id: "u4", phone: "9426098765", name: "Vikram Restaurant", roles: ["BUYER"],
    buyerType: "Restaurant", registeredAt: "2025-04-02",
    addresses: ["City Light, Surat - 395007"],
    notifications: { newOrders: true, lowStock: false, sms: true }
  },
  {
    id: "u5", phone: "9879034567", name: "Dinesh Patel", roles: ["FARMER"],
    farmSize: "2 acres", village: "Kamrej", cropsGrown: ["Potatoes", "Onions"],
    verification: "Pending", aadhaarUploaded: true, registeredAt: "2026-06-19",
    notifications: { newOrders: true, lowStock: true, sms: false }
  },
  {
    id: "u6", phone: "9924045678", name: "Suresh Naik", roles: ["FARMER"],
    farmSize: "4 acres", village: "Mandvi", cropsGrown: ["Wheat", "Groundnut"],
    verification: "Pending", aadhaarUploaded: true, registeredAt: "2026-06-20",
    notifications: { newOrders: true, lowStock: false, sms: false }
  },
  {
    id: "admin1", phone: "9000000000", name: "Admin KhetSe", roles: ["ADMIN"],
    registeredAt: "2024-01-01",
  },
];

export const SEED_LISTINGS: Listing[] = [
  { id: "l1", farmerId: "u1", farmerName: "Ramesh Patel", cropName: "Fresh Tomatoes", category: "Vegetables", description: "Sun-ripened organic tomatoes, perfect for salads and cooking.", price: 28, mandiPrice: 22, unit: "kg", quantity: 350, harvestDate: "2026-06-20", isOrganic: true, fulfillment: "Both", photos: ["🍅"], status: "Live", rating: 4.8, distance: 5 },
  { id: "l2", farmerId: "u1", farmerName: "Ramesh Patel", cropName: "Crisp Cabbage", category: "Vegetables", description: "Freshly harvested compact cabbage heads, pesticide-free.", price: 32, mandiPrice: 26, unit: "kg", quantity: 500, harvestDate: "2026-06-19", isOrganic: true, fulfillment: "Both", photos: ["🥬"], status: "Live", rating: 4.7, distance: 5 },
  { id: "l3", farmerId: "u1", farmerName: "Ramesh Patel", cropName: "Sweet Carrots", category: "Vegetables", description: "Crunchy orange carrots, sweet and rich in nutrients.", price: 38, mandiPrice: 30, unit: "kg", quantity: 20, harvestDate: "2026-06-18", isOrganic: false, fulfillment: "Pickup", photos: ["🥕"], status: "Low stock", rating: 4.9, distance: 5 },
  { id: "l4", farmerId: "u2", farmerName: "Kavita Ben", cropName: "Farm Fresh Okra", category: "Vegetables", description: "Tender green ladies' fingers, handpicked this morning.", price: 42, mandiPrice: 35, unit: "kg", quantity: 150, harvestDate: "2026-06-21", isOrganic: true, fulfillment: "Both", photos: ["🫑"], status: "Live", rating: 4.6, distance: 8 },
  { id: "l5", farmerId: "u2", farmerName: "Kavita Ben", cropName: "Organic Spinach", category: "Vegetables", description: "Deep green spinach leaves, chemical-free and nutrient-rich.", price: 30, mandiPrice: 24, unit: "kg", quantity: 0, harvestDate: "2026-06-17", isOrganic: true, fulfillment: "Delivery", photos: ["🥬"], status: "Sold out", rating: 4.5, distance: 8 },
  { id: "l6", farmerId: "u1", farmerName: "Ramesh Patel", cropName: "Premium Basmati Rice", category: "Grains", description: "Aromatic long-grain basmati rice, aged to perfection.", price: 85, mandiPrice: 72, unit: "kg", quantity: 1200, harvestDate: "2026-06-10", isOrganic: true, fulfillment: "Both", photos: ["🌾"], status: "Live", rating: 4.9, distance: 5 },
  { id: "l7", farmerId: "u2", farmerName: "Kavita Ben", cropName: "Green Chilli", category: "Spices", description: "Fresh, medium-hot green chillies for everyday cooking.", price: 60, mandiPrice: 50, unit: "kg", quantity: 80, harvestDate: "2026-06-21", isOrganic: false, fulfillment: "Both", photos: ["🌶️"], status: "Live", rating: 4.4, distance: 8 },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "ORD-4892", buyerId: "u3", buyerName: "Priya Shah", farmerId: "u1", farmerName: "Ramesh Patel",
    items: [{ listingId: "l1", cropName: "Fresh Tomatoes", quantity: 5, price: 28, unit: "kg" }, { listingId: "l5", cropName: "Organic Spinach", quantity: 2, price: 30, unit: "kg" }],
    status: "Out for delivery", total: 200, shipping: 30, tax: 10, grandTotal: 240,
    fulfillment: "Delivery", address: "Adajan, Surat - 395009", timeSlot: "4:00 PM - 6:00 PM", placedAt: "2026-06-20T10:30:00",
  },
  {
    id: "ORD-4901", buyerId: "u4", buyerName: "Vikram Restaurant", farmerId: "u1", farmerName: "Ramesh Patel",
    items: [{ listingId: "l6", cropName: "Premium Basmati Rice", quantity: 25, price: 85, unit: "kg" }],
    status: "Accepted", total: 2125, shipping: 50, tax: 106, grandTotal: 2281,
    fulfillment: "Delivery", address: "City Light, Surat", timeSlot: "Morning", placedAt: "2026-06-21T08:00:00",
  },
  {
    id: "ORD-4877", buyerId: "u3", buyerName: "Priya Shah", farmerId: "u2", farmerName: "Kavita Ben",
    items: [{ listingId: "l4", cropName: "Farm Fresh Okra", quantity: 3, price: 42, unit: "kg" }],
    status: "Delivered", total: 126, shipping: 25, tax: 6, grandTotal: 157,
    fulfillment: "Delivery", address: "Adajan, Surat - 395009", placedAt: "2026-06-18T14:00:00",
    review: { rating: 5, comment: "Very fresh okra, loved it!" }
  },
];

/* ═══════════════════════════════════════
   STORE INTERFACE
   ═══════════════════════════════════════ */

interface AppState {
  /* Data */
  session: Session;
  users: User[];
  listings: Listing[];
  orders: Order[];
  cart: CartItem[];

  /* Auth actions */
  login: (phone: string) => User | null;
  setActiveRole: (role: Role) => void;
  logout: () => void;

  /* Cart actions */
  addToCart: (listingId: string, qty: number) => void;
  updateCartQty: (listingId: string, qty: number) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;

  /* Order actions */
  checkout: (fulfillment: "Pickup" | "Delivery", address?: string, timeSlot?: string) => string | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  addReview: (orderId: string, rating: number, comment: string) => void;

  /* Listing actions */
  addListing: (listing: Omit<Listing, "id" | "status" | "rating">) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  pauseListing: (id: string) => void;

  /* Admin actions */
  verifyFarmer: (userId: string, decision: "Verified" | "Rejected") => void;

  /* Profile actions */
  updateProfile: (userId: string, updates: Partial<User>) => void;
}

/* ═══════════════════════════════════════
   STORE IMPLEMENTATION
   ═══════════════════════════════════════ */

const emptySession: Session = { isLoggedIn: false, userId: "", phone: "", name: "", roles: [], activeRole: null };

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: emptySession,
      users: SEED_USERS,
      listings: SEED_LISTINGS,
      orders: SEED_ORDERS,
      cart: [],

      /* ── Auth ─────────────────────────── */
      login: (phone) => {
        const user = get().users.find((u) => u.phone === phone);
        if (!user) return null;
        set({
          session: {
            isLoggedIn: true,
            userId: user.id,
            phone: user.phone,
            name: user.name,
            roles: user.roles,
            activeRole: user.roles.length === 1 ? user.roles[0] : null,
          },
        });
        return user;
      },

      setActiveRole: (role) => {
        set((s) => ({ session: { ...s.session, activeRole: role } }));
      },

      logout: () => {
        set({ session: emptySession, cart: [] });
      },

      /* ── Cart ─────────────────────────── */
      addToCart: (listingId, qty) => {
        set((s) => {
          const existing = s.cart.find((c) => c.listingId === listingId);
          if (existing) {
            return { cart: s.cart.map((c) => (c.listingId === listingId ? { ...c, quantity: c.quantity + qty } : c)) };
          }
          return { cart: [...s.cart, { listingId, quantity: qty }] };
        });
      },

      updateCartQty: (listingId, qty) => {
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((c) => c.listingId !== listingId) : s.cart.map((c) => (c.listingId === listingId ? { ...c, quantity: qty } : c)),
        }));
      },

      removeFromCart: (listingId) => {
        set((s) => ({ cart: s.cart.filter((c) => c.listingId !== listingId) }));
      },

      clearCart: () => set({ cart: [] }),

      /* ── Orders ───────────────────────── */
      checkout: (fulfillment, address, timeSlot) => {
        const { cart, listings, session } = get();
        if (cart.length === 0 || !session.isLoggedIn) return null;

        // Group cart items by farmer
        const byFarmer = new Map<string, { farmerId: string; farmerName: string; items: OrderItem[] }>();
        for (const ci of cart) {
          const listing = listings.find((l) => l.id === ci.listingId);
          if (!listing) continue;
          if (!byFarmer.has(listing.farmerId)) {
            byFarmer.set(listing.farmerId, { farmerId: listing.farmerId, farmerName: listing.farmerName, items: [] });
          }
          byFarmer.get(listing.farmerId)!.items.push({
            listingId: ci.listingId, cropName: listing.cropName, quantity: ci.quantity, price: listing.price, unit: listing.unit,
          });
        }

        const newOrders: Order[] = [];
        for (const [, group] of byFarmer) {
          const total = group.items.reduce((s, it) => s + it.price * it.quantity, 0);
          const shipping = fulfillment === "Delivery" ? 30 : 0;
          const tax = Math.round(total * 0.05);
          newOrders.push({
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            buyerId: session.userId, buyerName: session.name,
            farmerId: group.farmerId, farmerName: group.farmerName,
            items: group.items, status: "Placed",
            total, shipping, tax, grandTotal: total + shipping + tax,
            fulfillment, address, timeSlot,
            placedAt: new Date().toISOString(),
          });
        }

        // Decrease stock
        const updatedListings = listings.map((l) => {
          const ci = cart.find((c) => c.listingId === l.id);
          if (!ci) return l;
          const newQty = Math.max(0, l.quantity - ci.quantity);
          const newStatus: ListingStatus = newQty === 0 ? "Sold out" : newQty <= 20 ? "Low stock" : l.status === "Paused" ? "Paused" : "Live";
          return { ...l, quantity: newQty, status: newStatus };
        });

        set((s) => ({ orders: [...newOrders, ...s.orders], listings: updatedListings, cart: [] }));
        return newOrders[0]?.id ?? null;
      },

      updateOrderStatus: (orderId, status) => {
        set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
      },

      cancelOrder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        // Restore stock
        const updatedListings = get().listings.map((l) => {
          const item = order.items.find((it) => it.listingId === l.id);
          if (!item) return l;
          const newQty = l.quantity + item.quantity;
          return { ...l, quantity: newQty, status: newQty > 20 ? "Live" as ListingStatus : "Low stock" as ListingStatus };
        });
        set((s) => ({
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" as OrderStatus } : o)),
          listings: updatedListings,
        }));
      },

      addReview: (orderId, rating, comment) => {
        set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, review: { rating, comment } } : o)) }));
      },

      /* ── Listings ─────────────────────── */
      addListing: (listing) => {
        const id = `l${Date.now()}`;
        set((s) => ({ listings: [...s.listings, { ...listing, id, status: "Live" as ListingStatus, rating: 0 }] }));
      },

      updateListing: (id, updates) => {
        set((s) => ({
          listings: s.listings.map((l) => {
            if (l.id !== id) return l;
            const merged = { ...l, ...updates };
            if (merged.quantity === 0) merged.status = "Sold out";
            else if (merged.quantity <= 20 && merged.status !== "Paused") merged.status = "Low stock";
            else if (merged.quantity > 20 && merged.status !== "Paused") merged.status = "Live";
            return merged;
          }),
        }));
      },

      deleteListing: (id) => {
        set((s) => ({ listings: s.listings.filter((l) => l.id !== id) }));
      },

      pauseListing: (id) => {
        set((s) => ({
          listings: s.listings.map((l) => (l.id === id ? { ...l, status: l.status === "Paused" ? (l.quantity === 0 ? "Sold out" : l.quantity <= 20 ? "Low stock" : "Live") : "Paused" } as Listing : l)),
        }));
      },

      /* ── Admin ─────────────────────────── */
      verifyFarmer: (userId, decision) => {
        set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, verification: decision } : u)) }));
      },

      /* ── Profile ───────────────────────── */
      updateProfile: (userId, updates) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
          session: s.session.userId === userId ? { ...s.session, name: updates.name ?? s.session.name } : s.session,
        }));
      },
    }),
    { name: "khetse-store" }
  )
);
