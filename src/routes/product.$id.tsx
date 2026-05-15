import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, Truck, ShieldCheck, RefreshCw, Check, Minus, Plus, Crown, Lock, Undo2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, BUNDLE_DISCOUNT, type Product } from "@/lib/products";
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
    if (params.id !== mainProduct.id) throw notFound();
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen"><Header /><div className="mx-auto max-w-3xl p-10 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back to shop</Link>
    </div></div>
  ),
});

const faqs = [
  { q: "How long does the water last?", a: "The 230ml tank runs for 6–8 hours on a full fill — perfect for a full night’s sleep." },
  { q: "Can I use essential oils?", a: "Yes! Add a few drops to the water for an aromatherapy experience." },
  { q: "Is the rain sound loud?", a: "No — it operates under 30 dB, quieter than a whisper." },
  { q: "What’s included in the box?", a: "1× HeraLite Cloud Rain Humidifier, 1× USB-C cable, and a quick-start guide." },
  { q: "What if I’m not happy with my order?", a: "We offer a hassle-free 30-day return policy. Contact us and we’ll make it right." },
];

function ProductPage() {
  const product: Product = mainProduct;
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [bundle, setBundle] = useState<1 | 2 | 3>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(0);
  const [zoom, setZoom] = useState(1);
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
    setZoom(1);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxImg((prev) => (prev + 1) % product.images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setLightboxImg((prev) => (prev - 1 + product.images.length) % product.images.length);
    setZoom(1);
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
    <div className="min-h-screen bg-background">
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
                    className={`group relative rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${
                      active
                        ? "border-primary bg-white shadow-[0_10px_30px_-10px_oklch(0.62_0.22_295/0.5)] -translate-y-0.5"
                        : "border-border bg-white/60 hover:border-primary/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--gold)] to-[oklch(0.72_0.15_70)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary-deep)] shadow-md">
                        ★ Most Popular
                      </span>
                    )}
                    <div className="text-base font-bold text-[var(--primary-deep)]">{n === 1 ? "Single" : `${n}-Pack`}</div>
                    <div className="text-xs text-muted-foreground">{n} × ${product.price.toFixed(2)}</div>
                    <div className="mt-1 font-display text-xl font-bold text-primary">${(total - save).toFixed(2)}</div>
                    {save > 0 ? (
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-xs font-bold text-[var(--success)]">
                        Save ${save.toFixed(2)}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs font-medium text-muted-foreground">Standard price</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buy Box */}
        <aside className="md:col-span-3">
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

            <button onClick={handleAdd} className="mt-4 w-full rounded-full bg-[var(--gold)] py-3 text-base font-bold uppercase tracking-wider text-[var(--primary-deep)] hover:brightness-95">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="mt-2 w-full rounded-full bg-primary py-3 text-base font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
              Buy Now
            </button>

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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="flex w-full max-w-4xl flex-col items-center gap-4">
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg bg-black">
              <img
                src={product.images[lightboxImg]}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            <div className="flex w-full items-center justify-between gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <div className="flex flex-1 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(Math.max(1, zoom - 0.2));
                  }}
                  className="flex-1 rounded-lg bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  − Zoom Out
                </button>
                <div className="flex flex-1 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(Math.min(3, zoom + 0.2));
                  }}
                  className="flex-1 rounded-lg bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Zoom In +
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="text-center text-sm text-white/60">
              Image {lightboxImg + 1} of {product.images.length} • Use arrow keys to navigate • Press ESC to close
            </div>
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
