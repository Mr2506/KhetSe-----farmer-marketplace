import {
  Apple,
  Carrot,
  ChefHat,
  CircleChevronRight,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react";

export const categories = [
  { name: "Vegetables", icon: Leaf, active: true, tone: "bg-[#f7efe7] text-[#7a9b50]" },
  { name: "Fruits", icon: Apple, active: false, tone: "bg-[#f3f5f7] text-[#d64a34]" },
  { name: "Grains", icon: ChefHat, active: false, tone: "bg-[#f3f5f7] text-[#9a8b62]" },
  { name: "Dairy", icon: ShieldCheck, active: false, tone: "bg-[#f3f5f7] text-[#6c88b3]" },
  { name: "Spices", icon: Star, active: false, tone: "bg-[#f3f5f7] text-[#bf8a2d]" },
  { name: "Offers", icon: CircleChevronRight, active: false, tone: "bg-[#f3f5f7] text-[#496b47]" },
];

export const products = [
  {
    name: "Cabbage",
    description: "Freshly picked, crisp and leafy.",
    price: "₹32 / kg",
    accent: "from-[#d9edd3] to-[#a9c48f]",
    icon: Leaf,
  },
  {
    name: "Green Beans",
    description: "Tender pods packed for daily cooking.",
    price: "₹48 / kg",
    accent: "from-[#c7e76b] to-[#7ca122]",
    icon: ChefHat,
  },
  {
    name: "Carrot",
    description: "Sweet, crunchy, and farm fresh.",
    price: "₹38 / kg",
    accent: "from-[#ffcb9a] to-[#ef6c1d]",
    icon: Carrot,
  },
  {
    name: "Okra",
    description: "Small, tender, and ideal for frying.",
    price: "₹42 / kg",
    accent: "from-[#c8ef8d] to-[#75a93a]",
    icon: Leaf,
  },
];

export const highlights = [
  { label: "Direct Sell & Buy", icon: Truck },
  { label: "1,200+ Local Members", icon: Users },
  { label: "Safe & Secure Deals", icon: ShieldCheck },
];