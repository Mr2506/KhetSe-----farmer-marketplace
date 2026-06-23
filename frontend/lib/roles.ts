export type AppRole = "BUYER" | "FARMER" | "ADMIN";

export const ROLE_PREFIX: Record<AppRole, string> = {
  BUYER: "/buyer",
  FARMER: "/farmer",
  ADMIN: "/admin",
};

export const ROLE_HOME: Record<AppRole, string> = {
  BUYER: "/buyer/browse",
  FARMER: "/farmer/listings",
  ADMIN: "/admin/dashboard",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  BUYER: "Buyer",
  FARMER: "Farmer",
  ADMIN: "Admin",
};

export function roleFromPath(pathname: string): AppRole | null {
  if (pathname.startsWith("/buyer")) return "BUYER";
  if (pathname.startsWith("/farmer")) return "FARMER";
  if (pathname.startsWith("/admin")) return "ADMIN";
  return null;
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    Placed: "Placed",
    Accepted: "Accepted",
    Packed: "Packed",
    "Out for delivery": "Out for delivery",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export const ORDER_STATUS_FLOW = [
  "Placed",
  "Accepted",
  "Packed",
  "Out for delivery",
  "Delivered",
] as const;

export const FARMER_ORDER_FLOW = [
  "Placed",
  "Accepted",
  "Packed",
  "Out for delivery",
  "Delivered",
] as const;

export function listingStatusFromQty(qty: number, paused = false) {
  if (paused) return "Paused" as const;
  if (qty === 0) return "Sold out" as const;
  if (qty <= 20) return "Low stock" as const;
  return "Live" as const;
}

export function formatListingStatus(status: string): string {
  const map: Record<string, string> = {
    Live: "Live",
    "Low stock": "Low stock",
    "Sold out": "Sold out",
    Paused: "Paused",
  };
  return map[status] ?? status;
}

export function formatBuyerType(type: string): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}
