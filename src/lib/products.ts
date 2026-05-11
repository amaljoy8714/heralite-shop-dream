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
  title: "HeraLite Cloud Rain Humidifier — Sleep & Wellness Diffuser",
  brand: "HeraLite",
  price: 24.99,
  oldPrice: 49.99,
  rating: 4.6,
  ratingCount: 2438,
  images: [img1, img2, img3, img4],
  thumb: img1,
  inStock: true,
  bullets: [
    "Calming raindrop sound — perfect for sleep, focus & meditation",
    "7-color RGB ambient mood lighting with smooth gradient mode",
    "230ml ultrasonic cool mist — whisper quiet under 30 dB",
    "Auto shut-off when water runs low (safety protection)",
    "USB-C powered • Wood-grain base • Premium ABS body",
  ],
  description:
    "Transform any room into a calm sanctuary. The HeraLite Cloud Rain Humidifier mimics the soothing sound of falling rain while diffusing a fine, cool mist into the air. Pair it with the built-in 7-color RGB night light for a dreamy ambience that helps you sleep, study or unwind.",
  specs: [
    { label: "Capacity", value: "230 ml" },
    { label: "Power", value: "USB-C, 5V / 1A" },
    { label: "Run time", value: "6–8 hours" },
    { label: "Material", value: "ABS + wood-grain finish" },
    { label: "Light modes", value: "7 colors + gradient" },
    { label: "Noise level", value: "< 30 dB" },
  ],
  reviews: [
    { name: "Aisha K.", rating: 5, date: "Apr 12, 2026", title: "Helps me sleep so well", body: "The rain sound is genuinely calming and the purple light is so pretty. My whole bedroom feels like a spa now." },
    { name: "Ryan S.", rating: 5, date: "Apr 03, 2026", title: "Beautiful build quality", body: "Wood base looks premium. Mist is fine and silent. Worth every dollar." },
    { name: "Maya P.", rating: 4, date: "Mar 27, 2026", title: "Lovely mood light", body: "Great gift item. Slightly small tank but otherwise perfect." },
    { name: "Devon N.", rating: 5, date: "Mar 15, 2026", title: "My kids love it", body: "Acts as a night light + humidifier. Very peaceful raindrop sound." },
  ],
};

export const BUNDLE_DISCOUNT = 0.15; // 15% off when buying 2+ of main product

export type SoldOutProduct = { id: string; title: string; price: number; oldPrice: number; emoji: string };

export const soldOutProducts: SoldOutProduct[] = [
  { id: "s1", title: "Galaxy Star Projector Lamp", price: 21.99, oldPrice: 42.99, emoji: "🌌" },
  { id: "s2", title: "Sunset Ambient Floor Lamp", price: 32.99, oldPrice: 64.99, emoji: "🌅" },
  { id: "s3", title: "Crystal Salt Night Lamp", price: 15.99, oldPrice: 31.99, emoji: "🧂" },
  { id: "s4", title: "Moon Levitating Light", price: 39.99, oldPrice: 79.99, emoji: "🌙" },
  { id: "s5", title: "Volcano Mist Diffuser", price: 27.99, oldPrice: 54.99, emoji: "🌋" },
  { id: "s6", title: "Aurora LED Strip Pro", price: 17.99, oldPrice: 35.99, emoji: "✨" },
  { id: "s7", title: "Zen Garden Aroma Stone", price: 19.99, oldPrice: 39.99, emoji: "🪨" },
  { id: "s8", title: "Forest Rain Sleep Speaker", price: 29.99, oldPrice: 59.99, emoji: "🌲" },
];
