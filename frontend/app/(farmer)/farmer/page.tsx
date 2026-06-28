import { redirect } from "next/navigation";

export default function FarmerRoot() {
  // Instantly teleport the farmer to their orders dashboard
  // (If Meet's main page is listings, just change this to "/farmer/listings")
  redirect("/farmer/orders");
}