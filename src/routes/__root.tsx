import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HeraLite — Light. Life. Balance." },
      { name: "description", content: "HeraLite mood-lighting and wellness store. Premium humidifiers, diffusers and ambient lights for the modern home." },
      { property: "og:title", content: "HeraLite — Light. Life. Balance." },
      { name: "twitter:title", content: "HeraLite — Light. Life. Balance." },
      { property: "og:description", content: "HeraLite mood-lighting and wellness store. Premium humidifiers, diffusers and ambient lights for the modern home." },
      { name: "twitter:description", content: "HeraLite mood-lighting and wellness store. Premium humidifiers, diffusers and ambient lights for the modern home." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0025255a-dd33-4d4a-843f-a78088ea35cd/id-preview-7351736c--aff41bf4-2eaf-46ab-bc8d-08a36435c6fb.lovable.app-1778418203629.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0025255a-dd33-4d4a-843f-a78088ea35cd/id-preview-7351736c--aff41bf4-2eaf-46ab-bc8d-08a36435c6fb.lovable.app-1778418203629.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
