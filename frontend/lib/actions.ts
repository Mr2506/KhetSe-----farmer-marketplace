"use server";

import { revalidatePath } from "next/cache";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function checkoutAction(data: any) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function verifyFarmerAction(userId: string, decision: "Verified" | "Rejected") {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function addReviewAction(orderId: string, rating: number, comment: string) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function cancelOrderAction(orderId: string) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function updateBuyerProfileAction(data: any) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function upsertListingAction(data: any) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function deleteListingAction(id: string) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function updateListingFieldAction(id: string, updates: any) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}

export async function updateFarmerProfileAction(data: any) {
  await delay(100);
  revalidatePath("/");
  return { success: true };
}
