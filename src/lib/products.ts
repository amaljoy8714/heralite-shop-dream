import img1 from "@/assets/cloud-humidifier-1.png";
import img2 from "@/assets/cloud-humidifier-2.png";
import img3 from "@/assets/cloud-humidifier-3.png";
import img4 from "@/assets/cloud-humidifier-4.png";
import img5 from "@/assets/cloud-humidifier-5.png";
import img6 from "@/assets/cloud-humidifier-6.png";
import img7 from "@/assets/cloud-humidifier-7.png";
import img8 from "@/assets/cloud-humidifier-8.png";
import product1 from "@/assets/cloud-humidifier-1.png";
import product1Cover from "@/assets/Product 1.png";
import product2 from "@/assets/Product 2.png";
import product3 from "@/assets/Product 3.png";
import product4 from "@/assets/Product 4.png";
import product5 from "@/assets/Product 5.png";
import product6 from "@/assets/Product 6.png";
import product7 from "@/assets/Product 7.png";
import product8 from "@/assets/Product 8.png";
import product9 from "@/assets/Product 9.png";

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
  title: "HeraLiite Cloud Rain Humidifier — Sleep & Wellness Diffuser",
  brand: "HeraLite",
  price: 24.99,
  oldPrice: 49.99,
  rating: 4.6,
  ratingCount: 2438,
  images: [img1, img2, img3, img4, img5, img6, img7, img8],
  thumb: product1,
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

export type SoldOutProduct = { id: string; title: string; price: number; oldPrice: number; emoji: string; image: string };

export const soldOutProducts: SoldOutProduct[] = [
  { id: "s0", title: "HeraLite CosmoMist-Astronaut Edition Wellness Diffuser", price: 24.99, oldPrice: 49.99, emoji: "🚀", image: product1Cover },
  { id: "s1", title: "HeraLite EdenMist-Raindrop Aromatherapy Diffuser & White Noise Humidifler", price: 21.99, oldPrice: 42.99, emoji: "🌧️", image: product2 },
  { id: "s2", title: "HeraLite LunaMist-Moon Lamp Humidifier&Ambient Night Light", price: 32.99, oldPrice: 64.99, emoji: "🌙", image: product3 },
  { id: "s3", title: "HeraLite LumaMist-Crystal Bulb Humidifier&Color Ambient Light", price: 15.99, oldPrice: 31.99, emoji: "💡", image: product4 },
  { id: "s4", title: "HeraLite EmberMist-Realistic Flame Diffuser&7-Color Mood Light", price: 39.99, oldPrice: 79.99, emoji: "🔥", image: product5 },
  { id: "s5", title: "HeraLite ZenMist — Wood Grain Aroma Diffuser & Ambient Wellness Humidifier", price: 27.99, oldPrice: 54.99, emoji: "🪵", image: product6 },
  { id: "s6", title: "HeraLite UmbraMist — Umbrella Rain Humidifier & 7-Color Mood Light", price: 17.99, oldPrice: 35.99, emoji: "☂️", image: product7 },
  { id: "s7", title: "HeraLite NordMist — Natural Wood Orb Humidifier & Soft Glow Diffuser", price: 19.99, oldPrice: 39.99, emoji: "🌲", image: product8 },
  { id: "s8", title: "HeraLite ChromaMist — RGB Rainbow Humidifier & Color Mist Diffuser", price: 29.99, oldPrice: 59.99, emoji: "🌈", image: product9 },
];
