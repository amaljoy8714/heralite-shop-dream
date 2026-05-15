# Plan: Login Button + Your Orders Page

## 1. Header — Auth button
- Add account button to `src/components/Header.tsx` (between Track Order and Cart).
- Uses `useAuth()` hook (already exists in `src/lib/auth.ts`).
- Logged out → "Sign in" link to `/login`.
- Logged in → dropdown menu with: avatar/email, "Your Orders" → `/orders`, "Admin" (if admin role), "Sign out".
- Guests can continue checkout without login (no gating added).

## 2. `/orders` route — Your Orders (list page)
- New file `src/routes/orders.tsx` (public — reads from local `useOrders` zustand store, same as Track page).
- Sections:
  - **Purchase History**: list of past orders (most recent first) with thumbnail, order id, date, total, status, "View details" button → `/orders/$orderId`.
  - **Suggested for you**: 4 product cards from `products.ts` (random/other products).
- Empty state: "No orders yet" + CTA to shop.

## 3. `/orders/$orderId` route — Order Details
Three stacked sections matching the spec:

### a) Product details
- Each item in the order: image, title, qty, price.
- "Buy again" button → adds item to cart and navigates to `/checkout`.

### b) How's your item?
- "Write a product review" card per item.
- Click → navigate to `/product/$id` with hash `#reviews` so ReviewSection scrolls into view; ReviewForm focused.

### c) Order info (tabs/buttons)
- Tab 1: **Order details** — shows current position (timeline reusing `Order.timeline` from orders store), order summary, payment method (mock "Card ending •••• 4242"), shipping address, "Reorder" + "Feedback" buttons when status === "Delivered", invoice download button.
- Tab 2: **Download invoice** — directly triggers PDF generation.

### d) Suggested products at bottom (4 cards).

## 4. Invoice PDF
- `src/lib/invoice.ts` already exists — reuse it. If not exporting a generator, add `generateInvoicePDF(order)` using `jspdf` (already commonly used) or simple HTML→print. Check existing implementation first; add jspdf if missing.
- Trigger download via blob URL with filename `Invoice-${orderId}.pdf`.

## 5. Routing
- Add to header nav links automatically via routeTree regen.

## Technical notes
- All client-side; uses existing zustand `useOrders` store — no DB changes.
- Auth dropdown uses existing shadcn `dropdown-menu`.
- No changes to checkout/auth flow logic.
