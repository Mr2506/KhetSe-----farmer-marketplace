import { SEED_USERS, SEED_LISTINGS, SEED_ORDERS } from "./store";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllOrders() {
  await delay(100);
  return SEED_ORDERS;
}

export async function getAllFarmers() {
  await delay(100);
  return SEED_USERS.filter((u) => u.roles.includes("FARMER"));
}

export async function getAdminStats() {
  await delay(100);
  const totalRevenue = SEED_ORDERS.reduce((sum, order) => sum + order.grandTotal, 0);
  const farmers = SEED_USERS.filter((u) => u.roles.includes("FARMER")).length;
  const buyers = SEED_USERS.filter((u) => u.roles.includes("BUYER")).length;
  const orders = SEED_ORDERS.length;
  const listings = SEED_LISTINGS.length;
  return { totalRevenue, farmers, buyers, orders, listings };
}

export async function getAllBuyers() {
  await delay(100);
  return SEED_USERS.filter((u) => u.roles.includes("BUYER"));
}

export async function getBuyerOrders() {
  await delay(100);
  return SEED_ORDERS;
}

export async function getFarmerOrders() {
  await delay(100);
  return SEED_ORDERS;
}

export async function getListingById(id: string) {
  await delay(100);
  return SEED_LISTINGS.find((l) => l.id === id) || null;
}

export async function getFarmerListings() {
  await delay(100);
  return SEED_LISTINGS;
}

export async function getSeasonalCrops(month?: number) {
  await delay(100);
  return SEED_LISTINGS.slice(0, 4); // Just returning a few for mock
}

export async function getLiveListings(filters?: { search?: string; category?: string; maxPrice?: number; organic?: boolean; maxDistance?: number }) {
  await delay(100);
  let result = SEED_LISTINGS.filter((l) => l.status === "Live");
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(l => l.cropName.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }
  if (filters?.category) {
    result = result.filter(l => l.category === filters.category);
  }
  if (filters?.maxPrice !== undefined) {
    result = result.filter(l => l.price <= filters.maxPrice!);
  }
  if (filters?.organic) {
    result = result.filter(l => l.isOrganic);
  }
  if (filters?.maxDistance !== undefined) {
    result = result.filter(l => l.distance <= filters.maxDistance!);
  }
  return result;
}
