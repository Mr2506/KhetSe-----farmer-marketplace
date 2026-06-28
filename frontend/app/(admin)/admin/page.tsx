import { redirect } from "next/navigation";

export default function AdminRoot() {
  // Instantly teleport the admin to their main dashboard
  // (Change "dashboard" to whatever folder Meet created for the admin's main page!)
  redirect("/admin/dashboard");
}