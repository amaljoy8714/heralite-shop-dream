import { jsPDF } from "jspdf";
import type { Order } from "@/lib/orders";

export function downloadInvoicePdf(order: Order) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const violet: [number, number, number] = [108, 63, 160];
  const deep: [number, number, number] = [38, 26, 64];
  const gold: [number, number, number] = [199, 161, 60];
  const muted: [number, number, number] = [120, 120, 135];

  // Header band
  doc.setFillColor(...violet);
  doc.rect(0, 0, W, 90, "F");

  // Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("HeraLite", M, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("LIGHT  ·  LIFE  ·  BALANCE", M, 64);

  // Invoice label
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", W - M, 48, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Order #${order.orderId}`, W - M, 64, { align: "right" });
  doc.text(new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), W - M, 78, { align: "right" });

  let y = 130;

  // Tracking card
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.2);
  doc.setFillColor(252, 248, 235);
  doc.roundedRect(M, y, W - M * 2, 64, 8, 8, "FD");
  doc.setTextColor(...muted);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TRACKING NUMBER", M + 16, y + 22);
  doc.setTextColor(...deep);
  doc.setFontSize(16);
  doc.setFont("courier", "bold");
  doc.text(order.trackingNumber, M + 16, y + 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Save this number to track your order anytime.", W - M - 16, y + 46, { align: "right" });

  y += 92;

  // Bill to
  doc.setTextColor(...muted);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", M, y);
  doc.text("SHIP TO", W / 2, y);
  doc.setTextColor(...deep);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const billLines = [order.customerName, order.email];
  const shipLines = [order.customerName, order.address, `${order.city}, ${order.state} ${order.zip}`, "United States"];
  billLines.forEach((l, i) => doc.text(l, M, y + 16 + i * 14));
  shipLines.forEach((l, i) => doc.text(l, W / 2, y + 16 + i * 14));

  y += 16 + Math.max(billLines.length, shipLines.length) * 14 + 24;

  // Items table header
  doc.setFillColor(245, 240, 252);
  doc.rect(M, y, W - M * 2, 26, "F");
  doc.setTextColor(...deep);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ITEM", M + 12, y + 17);
  doc.text("QTY", W - M - 180, y + 17, { align: "right" });
  doc.text("PRICE", W - M - 100, y + 17, { align: "right" });
  doc.text("TOTAL", W - M - 12, y + 17, { align: "right" });
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  order.items.forEach((it) => {
    const lineTotal = it.price * it.qty;
    doc.setTextColor(...deep);
    const titleLines = doc.splitTextToSize(it.title, W - M * 2 - 220);
    titleLines.forEach((l: string, i: number) => doc.text(l, M + 12, y + 18 + i * 12));
    doc.text(String(it.qty), W - M - 180, y + 18, { align: "right" });
    doc.text(`$${it.price.toFixed(2)}`, W - M - 100, y + 18, { align: "right" });
    doc.text(`$${lineTotal.toFixed(2)}`, W - M - 12, y + 18, { align: "right" });
    const rowH = Math.max(28, 12 + titleLines.length * 12 + 8);
    y += rowH;
    doc.setDrawColor(232, 230, 240);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
  });

  y += 16;

  // Totals
  const subtotal = order.items.reduce((a, i) => a + i.price * i.qty, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const totalsX = W - M - 200;
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text("Subtotal", totalsX, y);
  doc.setTextColor(...deep);
  doc.text(`$${subtotal.toFixed(2)}`, W - M - 12, y, { align: "right" });
  y += 16;
  doc.setTextColor(...muted);
  doc.text("Shipping", totalsX, y);
  doc.setTextColor(15, 130, 80);
  doc.text("FREE", W - M - 12, y, { align: "right" });
  y += 16;
  doc.setTextColor(...muted);
  doc.text("Tax (7%)", totalsX, y);
  doc.setTextColor(...deep);
  doc.text(`$${tax.toFixed(2)}`, W - M - 12, y, { align: "right" });
  y += 12;
  doc.setDrawColor(...violet);
  doc.setLineWidth(1);
  doc.line(totalsX, y, W - M, y);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...deep);
  doc.text("TOTAL PAID", totalsX, y);
  doc.setTextColor(...violet);
  doc.text(`$${order.total.toFixed(2)}`, W - M - 12, y, { align: "right" });

  y += 50;

  // Footer
  doc.setDrawColor(232, 230, 240);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Estimated delivery: ${order.estimatedDelivery}`, M, y);
  doc.text("Thank you for choosing HeraLite", W - M, y, { align: "right" });
  y += 14;
  doc.setFontSize(8);
  doc.text("30-day hassle-free returns  ·  Free US shipping  ·  support@heralite.com", M, y);

  doc.save(`HeraLite-Invoice-${order.orderId}.pdf`);
}
