import {
  CalendarDays,
  FileText,
  LayoutGrid,
  Package,
  Tractor,
  Users,
} from "lucide-react";

export const navigationLinks = [
  { href: "/buyers", label: "Buyers", icon: Users },
  { href: "/farmers", label: "Farmers", icon: Tractor },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: LayoutGrid },
  { href: "/works", label: "Works", icon: FileText },
  
];
