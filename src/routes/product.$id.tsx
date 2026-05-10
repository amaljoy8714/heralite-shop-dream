import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, RefreshCw, Check, Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: `${mainProduct.title} | HeraLiite` },
      { name: "description", content: mainProduct.description },
      { property: "og:image", content: mainProduct.images[0] },
    ],
  }),
  loader: ({ params }) => {
    if (params.id !== mainProduct.id) throw notFound();
    return { product: mainProduct };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen"><Header /><div className="mx-auto max-w-3xl p-10 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back to shop</Link>
    </div></div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const handleAdd = () => {
    add({ id: product.id, title: product.title, price: product.price, image: product.thumb }, qty);
  };
  const handleBuyNow = () => {
    handleAdd();
    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground md:px-6">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span>Mood Lights</span> <span className="mx-1">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 md:grid-cols-12 md:px-6">
        {/* Gallery */}
        <div className="md:col-span-5">
          <div className="flex gap-3">
            <div className="hidden flex-col gap-2 md:flex">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(i)}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="aspect-square flex-1 overflow-hidden rounded-xl border bg-[var(--accent)]">
              <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-3 flex gap-2 md:hidden">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`h-14 w-14 overflow-hidden rounded-md border-2 ${activeImg === i ? "border-primary" : "border-border"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-4">
          <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-primary hover:underline">{product.rating} · {product.ratingCount.toLocaleString()} ratings</span>
          </div>

          <hr className="my-4" />

          <div className="flex items-baseline gap-3">
            <span className="rounded bg-destructive px-1.5 py-0.5 text-xs font-bold text-destructive-foreground">-{discount}%</span>
            <span className="font-display text-4xl font-bold text-primary">₹{product.price}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            M.R.P.: <span className="line-through">₹{product.oldPrice}</span>
            <span className="ml-2 text-foreground">Inclusive of all taxes</span>
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {product.bullets.map((b) => (
              <li key={b} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{b}</span></li>
            ))}
          </ul>
        </div>

        {/* Buy Box */}
        <aside className="md:col-span-3">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="font-display text-2xl font-bold text-primary">₹{product.price}</div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" /> FREE delivery <span className="font-semibold text-foreground">tomorrow</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[var(--success)]">In stock</div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-semibold">Qty</span>
              <div className="flex items-center rounded-md border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 py-1.5 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-2 py-1.5 hover:bg-muted"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <button onClick={handleAdd} className="mt-4 w-full rounded-full bg-[var(--gold)] py-2.5 text-sm font-semibold text-[var(--primary-deep)] hover:brightness-95">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
              Buy Now
            </button>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure transaction</li>
              <li className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-primary" /> 7-day replacement</li>
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Cash on delivery available</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="flex gap-1 border-b">
          {([
            ["desc", "Description"],
            ["specs", "Specifications"],
            ["reviews", `Reviews (${product.reviews.length})`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "desc" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-bold">About this item</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {product.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <img src={product.images[1]} alt="" className="aspect-square rounded-xl object-cover" />
            </div>
          )}
          {tab === "specs" && (
            <table className="w-full max-w-2xl text-sm">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-b">
                    <td className="bg-muted/40 px-4 py-3 font-semibold">{s.label}</td>
                    <td className="px-4 py-3">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "reviews" && (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border bg-card p-5">
                <div className="font-display text-5xl font-bold text-primary">{product.rating}</div>
                <div className="mt-1 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                  ))}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{product.ratingCount.toLocaleString()} global ratings</div>
              </div>
              <div className="space-y-5 md:col-span-2">
                {product.reviews.map((r, i) => (
                  <div key={i} className="border-b pb-5 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {r.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{r.title}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
