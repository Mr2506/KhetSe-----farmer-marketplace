import type { AppRole } from "@/lib/roles";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Leaf,
  Package,
  ShoppingCart,
  Sprout,
  Store,
  Tractor,
  User,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof Leaf;
};

export const buyerNav: NavItem[] = [
  { href: "/buyer/browse", label: "Browse", icon: Store },
  { href: "/buyer/cart", label: "Cart", icon: ShoppingCart },
  { href: "/buyer/orders", label: "My Orders", icon: Package },
  { href: "/buyer/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/buyer/profile", label: "Profile", icon: User },
];

export const farmerNav: NavItem[] = [
  { href: "/farmer/listings", label: "My Listings", icon: Sprout },
  { href: "/farmer/listings/new", label: "Add Listing", icon: Leaf },
  { href: "/farmer/orders", label: "Orders", icon: Package },
  { href: "/farmer/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/farmer/profile", label: "Profile", icon: User },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/farmers", label: "Farmers", icon: Tractor },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export const navByRole: Record<AppRole, NavItem[]> = {
  BUYER: buyerNav,
  FARMER: farmerNav,
  ADMIN: adminNav,
};
