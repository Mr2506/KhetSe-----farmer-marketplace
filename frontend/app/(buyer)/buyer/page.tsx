import { redirect } from "next/navigation";

export default function BuyerRoot() {
  // Instantly teleport the user to Meet's browse page!
  redirect("/buyer/browse");
}