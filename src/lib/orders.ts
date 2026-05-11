import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "Placed" | "Processing" | "Shipped" | "Out for delivery" | "Delivered";

export type Order = {
  trackingNumber: string;
  orderId: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: { title: string; qty: number; price: number; image: string }[];
  total: number;
  placedAt: number;
  status: OrderStatus;
  timeline: { status: OrderStatus; at: number }[];
  estimatedDelivery: string;
};

type OrdersState = {
  orders: Order[];
  add: (o: Order) => void;
  get: (trackingNumber: string) => Order | undefined;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      get: (tn) => get().orders.find((o) => o.trackingNumber.toUpperCase() === tn.toUpperCase()),
    }),
    { name: "heralite-orders" }
  )
);

export function generateTrackingNumber() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const stamp = Date.now().toString(36).slice(-5).toUpperCase();
  return `HL-${stamp}-${rand}`;
}
