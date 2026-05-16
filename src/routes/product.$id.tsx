import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, Truck, ShieldCheck, RefreshCw, Check, Minus, Plus, Crown, Lock, Undo2, X, ChevronLeft, ChevronRight, PackageX, BellRing, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts, BUNDLE_DISCOUNT, type Product } from "@/lib/products";
import { usePriceOverrides } from "@/lib/products-db";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: `${mainProduct.title} | HeraLite` },
      { name: "description", content: mainProduct.description },
      { property: "og:image", content: mainProduct.images[0] },
    ],
  }),
  beforeLoad: ({ params }) => {
    const isMain = params.id === mainProduct.id;
    const isSoldOut = soldOutProducts.some((p) => p.id === params.id);
    if (!isMain && !isSoldOut) throw notFound();
  },
  component: ProductRouter,
  notFoundComponent: () => (
    <div className="min-h-screen"><Header /><div className="mx-auto max-w-3xl p-10 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back to shop</Link>
    </div></div>
  ),
});

function ProductRouter() {
  const { id } = Route.useParams();
  const { data: overrides } = usePriceOverrides();
  const soldOut = soldOutProducts.find((p) => p.id === id);
  if (soldOut) {
    const o = overrides?.get(soldOut.id);
    const product = o ? { ...soldOut, price: o.price, oldPrice: o.oldPrice } : soldOut;
    return <SoldOutPage product={product} />;
  }
  const o = overrides?.get(mainProduct.id);
  const product: Product = o ? { ...mainProduct, price: o.price, oldPrice: o.oldPrice } : mainProduct;
  return <ProductPage product={product} />;
}

function SoldOutPage({ product }: { product: typeof soldOutProducts[number] }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
        </Link>

        <div className="mt-6 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-transparent to-[var(--gold)]/15 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/30 via-white to-secondary/10 shadow-[var(--shadow-card)]">
              <img src={product.image} alt={product.title} className="absolute inset-0 h-full w-full object-cover grayscale-[0.35]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-deep)] shadow-lg backdrop-blur">
                  <PackageX className="h-3.5 w-3.5 text-destructive" /> Sold Out
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-destructive">
              <PackageX className="h-3 w-3" /> Currently Unavailable
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[var(--primary-deep)] md:text-4xl">
              {product.title}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-[var(--primary-deep)] md:text-4xl">${product.price.toFixed(2)}</span>
              <span className="text-base text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              This piece sold out fast. We&rsquo;re crafting the next batch in our studio — leave us a note and we&rsquo;ll let you know the moment it&rsquo;s back.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  toast.success("You&rsquo;re on the list", {
                    description: "We&rsquo;ll email you the second this piece is back in stock.",
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-deep)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:bg-primary"
              >
                <BellRing className="h-3.5 w-3.5" /> Notify Me When Back
              </button>
              <Link
                to="/product/$id"
                params={{ id: mainProduct.id }}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-deep)]/20 bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] transition hover:-translate-y-0.5 hover:bg-secondary/40"
              >
                Shop our Bestseller
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
              <div>
                <Truck className="mx-auto h-4 w-4 text-primary" />
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Free Ship</div>
              </div>
              <div>
                <ShieldCheck className="mx-auto h-4 w-4 text-primary" />
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Secure</div>
              </div>
              <div>
                <Undo2 className="mx-auto h-4 w-4 text-primary" />
                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">30-Day Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const faqs = [
  { q: "How long does the water last?", a: "The 230ml tank runs for 6–8 hours on a full fill — perfect for a full night’s sleep." },
  { q: "Can I use essential oils?", a: "Yes! Add a few drops to the water for an aromatherapy experience." },
  { q: "Is the rain sound loud?", a: "No — it operates under 30 dB, quieter than a whisper." },
  { q: "What’s included in the box?", a: "1× HeraLite Cloud Rain Humidifier, 1× USB-C cable, and a quick-start guide." },
  { q: "What if I’m not happy with my order?", a: "We offer a hassle-free 30-day return policy. Contact us and we’ll make it right." },
];

function ProductPage({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [bundle, setBundle] = useState<1 | 2 | 3>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(0);
  const [lbTouchStart, setLbTouchStart] = useState<number | null>(null);
  const [lbTouchEnd, setLbTouchEnd] = useState<number | null>(null);
  const add = useCart((s) => s.add);
  const navigate = useNavigate();

  const bundleQty = bundle;
  const baseTotal = product.price * bundleQty;
  const bundleSavings = bundleQty >= 2 ? baseTotal * BUNDLE_DISCOUNT : 0;
  const effectiveTotal = baseTotal - bundleSavings;

  const handleAdd = () => {
    const finalQty = bundle > 1 ? bundleQty : qty;
    add({ id: product.id, title: product.title, price: product.price, image: product.thumb }, finalQty);
    toast.success(`Added ${finalQty} × ${product.title.split("—")[0].trim()} to cart`);
  };
  const handleBuyNow = () => {
    const finalQty = bundle > 1 ? bundleQty : qty;
    add({ id: product.id, title: product.title, price: product.price, image: product.thumb }, finalQty);
    navigate({ to: "/checkout", search: { step: "address" } });
  };

  const openLightbox = (index: number) => {
    setLightboxImg(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxImg((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setLightboxImg((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const onLbTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) { setLbTouchStart(null); setLbTouchEnd(null); return; }
    setLbTouchEnd(null);
    setLbTouchStart(e.targetTouches[0].clientX);
  };
  const onLbTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1) { setLbTouchStart(null); return; }
    setLbTouchEnd(e.targetTouches[0].clientX);
  };
  const onLbTouchEnd = () => {
    if (lbTouchStart === null || lbTouchEnd === null) return;
    const dist = lbTouchStart - lbTouchEnd;
    if (dist > 50) nextImage();
    else if (dist < -50) prevImage();
    setLbTouchStart(null);
    setLbTouchEnd(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextImage();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevImage();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setLightboxOpen(false);
    }
  };

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground md:px-6 md:py-4 md:text-sm">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span>Mood Lights</span> <span className="mx-1">/</span>
        <span className="text-foreground">{product.title.split("—")[0].trim()}</span>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 md:grid-cols-12 md:gap-8 md:px-6">
        {/* Gallery */}
        <div className="min-w-0 md:col-span-5">
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
            <SwipeGallery
              images={product.images}
              alt={product.title}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              onOpen={openLightbox}
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto md:hidden">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ${activeImg === i ? "border-primary" : "border-border"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 md:col-span-4">
          <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-base">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
              ))}
            </div>
            <a href="#reviews" className="text-primary hover:underline">{product.rating} · Read reviews</a>
          </div>

          <hr className="my-4" />

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">${product.price}</span>
            <span className="rounded-full bg-[var(--success)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--success)]">
              Free Shipping Included
            </span>
          </div>

          <ul className="mt-5 space-y-2.5 text-base">
            {product.bullets.map((b) => (
              <li key={b} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{b}</span></li>
            ))}
          </ul>

          {/* Bundle picker — premium */}
          <div className="mt-7 rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--gold)]/8 via-white to-accent/20 p-4 shadow-[0_8px_30px_-12px_oklch(0.62_0.22_295/0.25)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[oklch(0.7_0.16_70)] shadow-[0_4px_10px_-2px_oklch(0.78_0.14_80/0.6)]">
                  <Crown className="h-3.5 w-3.5 text-[var(--primary-deep)]" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-[var(--primary-deep)]">Bundle &amp; Save</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Limited</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              {([1, 2, 3] as const).map((n) => {
                const active = bundle === n;
                const total = product.price * n;
                const save = n >= 2 ? total * BUNDLE_DISCOUNT : 0;
                const popular = n === 2;
                return (
                  <button
                    key={n}
                    onClick={() => setBundle(n)}
                    className={`group relative rounded-xl border-2 p-2.5 text-left transition-all duration-300 sm:p-3.5 ${
                      active
                        ? "border-primary bg-white shadow-[0_10px_30px_-10px_oklch(0.62_0.22_295/0.5)] -translate-y-0.5"
                        : "border-border bg-white/60 hover:border-primary/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--gold)] to-[oklch(0.72_0.15_70)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--primary-deep)] shadow-md sm:px-3 sm:text-[10px]">
                        ★ Popular
                      </span>
                    )}
                    <div className="text-sm font-bold text-[var(--primary-deep)] sm:text-base">{n === 1 ? "Single" : `${n}-Pack`}</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">{n} × ${product.price.toFixed(2)}</div>
                    <div className="mt-1 font-display text-base font-bold text-primary sm:text-xl">${(total - save).toFixed(2)}</div>
                    {save > 0 ? (
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--success)] sm:px-2 sm:text-xs">
                        Save ${save.toFixed(2)}
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] font-medium text-muted-foreground sm:text-xs">Standard</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buy Box */}
        <aside className="min-w-0 md:col-span-3">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="font-display text-3xl font-bold text-primary">${effectiveTotal.toFixed(2)}</div>
            {bundleSavings > 0 && (
              <div className="text-sm font-semibold text-[var(--success)]">Bundle saving applied</div>
            )}
            <div className="mt-3 flex items-center gap-2 text-base text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" /> FREE delivery <span className="font-semibold text-foreground">3–7 business days</span>
            </div>
            <div className="mt-1 text-base font-bold text-[var(--success)]">In stock · Ships within 1 business day</div>

            {bundle === 1 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-base font-semibold">Qty</span>
                <div className="flex items-center rounded-md border">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center text-base font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            <div className="hidden md:block">
              <button onClick={handleAdd} className="mt-4 w-full rounded-full bg-[var(--gold)] py-3 text-base font-bold uppercase tracking-wider text-[var(--primary-deep)] hover:brightness-95">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="mt-2 w-full rounded-full bg-primary py-3 text-base font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
                Buy Now
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold leading-tight text-muted-foreground">Secure<br/>Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold leading-tight text-muted-foreground">Free<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Undo2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold leading-tight text-muted-foreground">30-Day<br/>Returns</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure transaction</li>
              <li className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-primary" /> 30-day returns</li>
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> FREE shipping</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Description */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-2xl border bg-card p-6 md:p-10 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Product description</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>
              <h3 className="mt-6 text-base font-bold uppercase tracking-wider text-[var(--primary-deep)]">Highlights</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
                {product.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <img src={product.images[1]} alt="" className="aspect-square rounded-xl object-cover" />
          </div>

          <h3 className="mt-10 text-base font-bold uppercase tracking-wider text-[var(--primary-deep)]">Specifications</h3>
          <div className="mt-3 -mx-2 overflow-x-auto">
            <table className="w-full max-w-2xl text-base">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-b">
                    <td className="bg-muted/40 px-4 py-3 font-semibold whitespace-nowrap">{s.label}</td>
                    <td className="px-4 py-3">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why HeraLite */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-accent/40 via-white to-secondary/40 p-8 md:p-12 shadow-[var(--shadow-soft)]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Our promise</span>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Why HeraLite?</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We believe your space should feel as good as it looks. Every HeraLite product is designed to bring calm, light, and balance into your everyday life.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="rounded-2xl border bg-card p-6 md:p-10 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 divide-y">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-base font-semibold hover:text-primary"
                >
                  <span>{f.q}</span>
                  <span className="ml-4 text-2xl text-primary">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="pb-4 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-2xl border bg-card p-6 md:p-10 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Customer reviews</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border bg-secondary/40 p-5">
              <div className="font-display text-5xl font-bold text-primary">{product.rating}</div>
              <div className="mt-1 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                ))}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Loved by customers</div>
            </div>
            <div className="space-y-5 md:col-span-2">
              {product.reviews.map((r, i) => (
                <div key={i} className="border-b pb-5 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="text-base font-semibold">{r.name}</div>
                      <div className="text-sm text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-base font-semibold">{r.title}</span>
                  </div>
                  <p className="mt-2 text-base text-muted-foreground">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Viewer */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div
            className="flex flex-1 items-center justify-center overflow-auto"
            style={{ touchAction: "pinch-zoom" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onLbTouchStart}
            onTouchMove={onLbTouchMove}
            onTouchEnd={onLbTouchEnd}
          >
            <img
              src={product.images[lightboxImg]}
              alt={product.title}
              className="max-h-full max-w-full select-none object-contain"
              draggable={false}
              style={{ touchAction: "pinch-zoom" }}
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="pb-6 pt-3 text-center text-xs text-white/60">
            {lightboxImg + 1} / {product.images.length} • Pinch to zoom • Swipe to browse
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function SwipeGallery({
  images,
  alt,
  activeImg,
  setActiveImg,
  onOpen,
}: {
  images: string[];
  alt: string;
  activeImg: number;
  setActiveImg: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipe = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const dist = touchStart - touchEnd;
    if (dist > minSwipe) setActiveImg((activeImg + 1) % images.length);
    else if (dist < -minSwipe) setActiveImg((activeImg - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-square flex-1 overflow-hidden rounded-xl border bg-[var(--accent)] select-none">
      <div
        className="flex h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeImg * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onOpen(i)}
            className="h-full w-full shrink-0"
            aria-label={`View image ${i + 1} of ${images.length}`}
          >
            <img src={img} alt={alt} draggable={false} className="pointer-events-none h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === activeImg ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
