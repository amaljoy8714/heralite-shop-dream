import img1 from "@/assets/cloud-humidifier-1.jpg";
import img2 from "@/assets/cloud-humidifier-2.jpg";
import img3 from "@/assets/cloud-humidifier-3.jpg";
import img4 from "@/assets/cloud-humidifier-4.jpg";

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  oldPrice: number;
  rating: number;
  ratingCount: number;
  images: string[];
  thumb: string;
  inStock: boolean;
  bullets: string[];
  description: string;
  specs: { label: string; value: string }[];
  reviews: { name: string; rating: number; date: string; title: string; body: string }[];
};

export const mainProduct: Product = {
  id: "cloud-rain-humidifier",
  title: "HeraLiite Cloud Rain Humidifier — Mushroom Aroma Diffuser with 7-Color RGB Night Light",
  brand: "HeraLiite",
  price: 1499,
  oldPrice: 3499,
  rating: 4.6,
  ratingCount: 2438,
  images: [img1, img2, img3, img4],
  thumb: img1,
  inStock: true,
  bullets: [
    "Calming raindrop sound — perfect for sleep, focus & meditation",
    "7-color RGB ambient mood lighting with smooth gradient mode",
    "230ml ultrasonic cool mist — quiet under 30 dB",
    "Auto shut-off when water runs low (safety protection)",
    "USB-C powered • Wood-grain base • Premium ABS body",
  ],
  description:
    "Transform any room into a calm sanctuary. The HeraLiite Cloud Rain Humidifier mimics the soothing sound of falling rain while diffusing a fine, cool mist into the air. Pair it with the built-in 7-color RGB night light for a dreamy ambience that helps you sleep, study or unwind.",
  specs: [
    { label: "Capacity", value: "230 ml" },
    { label: "Power", value: "USB-C, 5V / 1A" },
    { label: "Run time", value: "6–8 hours" },
    { label: "Material", value: "ABS + wood-grain finish" },
    { label: "Light modes", value: "7 colors + gradient" },
    { label: "Noise level", value: "< 30 dB" },
  ],
  reviews: [
    { name: "Aisha K.", rating: 5, date: "12 Apr 2026", title: "Helps me sleep so well", body: "The rain sound is genuinely calming and the purple light is so pretty. Whole bedroom feels like a spa now." },
    { name: "Rohit S.", rating: 5, date: "03 Apr 2026", title: "Beautiful build quality", body: "Wood base looks premium. Mist is fine and silent. Worth every rupee." },
    { name: "Maya P.", rating: 4, date: "27 Mar 2026", title: "Lovely mood light", body: "Great gift item. Slightly small tank but otherwise perfect." },
    { name: "Dev N.", rating: 5, date: "15 Mar 2026", title: "My kids love it", body: "Acts as a night light + humidifier. Very peaceful raindrop sound." },
  ],
};

export type SoldOutProduct = { id: string; title: string; price: number; oldPrice: number; emoji: string };

export const soldOutProducts: SoldOutProduct[] = [
  { id: "s1", title: "Galaxy Star Projector Lamp", price: 1299, oldPrice: 2499, emoji: "🌌" },
  { id: "s2", title: "Sunset Ambient Floor Lamp", price: 1899, oldPrice: 3299, emoji: "🌅" },
  { id: "s3", title: "Crystal Salt Night Lamp", price: 899, oldPrice: 1799, emoji: "🧂" },
  { id: "s4", title: "Moon Levitating Light", price: 2499, oldPrice: 4999, emoji: "🌙" },
  { id: "s5", title: "Volcano Mist Diffuser", price: 1599, oldPrice: 2999, emoji: "🌋" },
  { id: "s6", title: "Aurora LED Strip Pro", price: 999, oldPrice: 1999, emoji: "✨" },
  { id: "s7", title: "Zen Garden Aroma Stone", price: 1199, oldPrice: 2399, emoji: "🪨" },
  { id: "s8", title: "Forest Rain Sleep Speaker", price: 1799, oldPrice: 3499, emoji: "🌲" },
];
